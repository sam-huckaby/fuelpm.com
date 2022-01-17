import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import { supabase } from "../../../utils/supabaseClient";

import AuthGuard from '../../../components/auth/AuthGuard';
import FloatingHeader from '../../../components/common/FloatingHeader';
import LoadingPane from "../../../components/common/LoadingPane";

export default function CreateTask() {
    // The router to move the user to the newly created tasks's detail page
    const router = useRouter();

    // State Values
    const [loading, setLoading] = useState(true);
    const [availableStates, setAvailableStates] = useState([]);
    const [nextSerial, setNextSerial] = useState(0);
    const [projectName, setProjectName] = useState('');

    // Form State values
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [state, setState] = useState(0);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            // The setup code is pointless to run wihout the project_id
            // and it would be an unnecessary hit to the Supabase API quota
            if (!router.query.project_id) {
                return false;
            }

            let projectDetails = {};
            try {
                // Grab all the projects
                let { data: projects, error } = await supabase
                    .from('projects')
                    .select('id, name, states!states_project_id_fkey(*)')
                    .eq('id', router.query.project_id);
                    
                if (error) throw error;

                projectDetails = projects;
            } catch (e) {
                console.log(e);
            }

            // TODO: Check if multiple projects have been returned

            setAvailableStates([...projectDetails[0].states]);
            setState(projectDetails[0].states[0].id);
            setProjectName(projectDetails[0].name);
            
            // Retrieve the next serial number
            let nextSerial = 1;
            try {
                const { data, error } = await supabase
                    .rpc('next_serial', { task_project_id: parseInt(router.query.project_id, 10) });
                    
                if (error) throw error;

                if (!data) {
                    nextSerial = 1;
                } else {
                    nextSerial = parseInt(data, 10) + 1;
                }
            } catch (e) {
                console.log(e);
            }

            setNextSerial(nextSerial);
            setLoading(false);
        }
        fetchProjectDetails();
    }, [router.query.project_id]);

    async function save() {
        const { data, error } = await supabase
            .from('tasks')
            .insert([
                {
                    name,
                    project_id: router.query.project_id,
                    description,
                    state_id: state,
                    serial: nextSerial
                }
            ]);

        if (error) throw error;

        // Send the user on to the detail page of their new task
        router.push(`/app/p/${router.query.project_id}/t/${name}`);
    }

    function reset() {
        // Set form back to defaults
        setName('');
        setDescription('');
        setState(availableStates[0].id);
    }

    function renderForm() {
        if (loading) {
            // Perhaps replace this with some fancy shimmering data boxes while people wait
            return <></>;
        } else {
            return (
                <>
                    <div className="flex flex-col pt-3">
                        <label htmlFor="project_name">Name</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="rounded border border-solid border-orange-600 bg-transparent h-8"
                            type="text"
                            name="name"
                            id="project_name" />
                    </div>
                    <div className="flex flex-col pt-3">
                        <label htmlFor="project_description">Description</label>
                        <textarea 
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="rounded border border-solid border-orange-600 bg-transparent h-8"
                            name="description"
                            rows="3"
                            id="project_description"></textarea>
                    </div>
                    <div className="flex flex-row items-end pt-3">
                        <div className="flex flex-col flex-auto">
                            <label htmlFor="project_name">Starting State</label>
                            <select
                                onChange={e => setState(e.target.value)}
                                defaultValue={availableStates[0].id}
                                className="rounded border border-solid border-orange-600 bg-transparent h-8">
                                {
                                    availableStates &&
                                    availableStates.map((cur, index) => 
                                        <option key={cur.label+'_'+cur.terminal} value={cur.id}>{cur.label}</option>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                </>
            );
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>{(loading)? 'Loading...' : 'Create task for project \'' + projectName + '\''} | FuelPM</title>
                <meta name="description" content='Create a new task for your project.' />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={((loading)? 'Loading...' : 'Create task for project \'' + projectName + '\'') + ' | FuelPM'} />
                <meta
                    property="og:description"
                    content="Create a new task for your project."
                />
                <link rel="icon" href="/Fuel-Favicon.svg" />
            </Head>
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto dark:bg-stone-700 dark:text-white flex flex-col p-2 relative">
                <div className="flex flex-row items-center justify-between pb-2 border-b border-solid border-orange-600">
                    <span className="text-2xl font-mono">Task Details:</span>
                    <Link href={`/app/p/${router.query.project_id}`}><button>Cancel</button></Link>
                </div>
                <LoadingPane loading={loading}></LoadingPane>
                { renderForm() }
            </div>
            <div className={((loading)? 'hidden' : '') + ` dark:bg-stone-700 p-2 flex flex-row items-center justify-between border-t border-solid border-orange-600`}>
                <button onClick={() => reset()} className="text-xl p-2 border border-solid border-stone-300 text-black dark:text-white rounded">Reset</button>
                <button onClick={() => save()} className="text-xl p-2 border border-solid border-orange-600 text-black dark:text-white rounded">Save</button>
            </div>
        </div>
    );
}