import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';

import { supabase } from "../../../utils/supabaseClient";
import { supabaseCaptureSSRCookie } from '../../../utils/helpers';

import AuthGuard from '../../../components/auth/authGuard.component';
import FloatingHeader from '../../../components/common/floatingHeader.component';

export default function CreateTask(props) {
    // The router to move the user to the newly created tasks's detail page
    const router = useRouter();

    // State values
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [state, setState] = useState(props.availableStates[0].id);

    // References
    const nameInput = useRef('');
    const descriptionInput = useRef('');

    async function save() {
        const { data, error } = await supabase
            .from('tasks')
            .insert([
                {
                    name,
                    project_id: props.projectId,
                    description,
                    state_id: state,
                    serial: props.nextSerial
                }
            ]);

        if (error) throw error;

        // Send the user on to the detail page of their new task
        router.push(`/app/p/${props.projectName}/t/${name}`);
    }

    function reset() {
        // Set form back to defaults
        nameInput.current.value = '';
        descriptionInput.current.value = '';
        setState(props.availableStates[0].id);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto dark:bg-stone-700 dark:text-white flex flex-col p-2">
                <div className="flex flex-row items-center justify-between pb-2 border-b border-solid border-orange-600">
                    <span className="text-2xl font-mono">Task Details:</span>
                    <Link href={`/app/p/${props.projectName}`}><button>Cancel</button></Link>
                </div>
                <div className="flex flex-col pt-3">
                    <label htmlFor="project_name">Name</label>
                    <input
                        ref={nameInput}
                        onChange={e => setName(e.target.value)}
                        className="rounded border border-solid border-orange-600 bg-transparent h-8"
                        type="text"
                        name="name"
                        id="project_name" />
                </div>
                <div className="flex flex-col pt-3">
                    <label htmlFor="project_description">Description</label>
                    <textarea 
                        ref={descriptionInput}
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
                            defaultValue={props.availableStates[0].id}
                            className="rounded border border-solid border-orange-600 bg-transparent h-8">
                            {
                                props.availableStates &&
                                props.availableStates.map((cur, index) => 
                                    <option key={cur.label+'_'+cur.terminal} value={cur.id}>{cur.label}</option>
                                )
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className="dark:bg-stone-700 p-2 flex flex-row items-center justify-between border-t border-solid border-orange-600">
                <button onClick={() => reset()} className="text-xl p-2 border border-solid border-stone-300 text-black dark:text-white rounded">Reset</button>
                <button onClick={() => save()} className="text-xl p-2 border border-solid border-orange-600 text-black dark:text-white rounded">Save</button>
            </div>
        </div>
    );
}

export async function getServerSideProps({ req, query}) {
    // This code is run on the server, so it does not have access to the browser memory session
    // In order to get anything back, we need to scrape the user's JWT and apply it to this call
    supabase.auth.session = supabaseCaptureSSRCookie(req);

    let projectDetails = {};
    try {
        // Grab all the projects
        let { data: projects, error } = await supabase
            .from('projects')
            .select('id, name, states!states_project_id_fkey(*)')
            .eq('id', query.project_id);
            
        if (error) throw error;

        projectDetails = projects;
    } catch (e) {
        console.log(e);
    }
    
    // Retrieve the next serial number
    let nextSerial = 1;
    try {
        const { data, error } = await supabase
            .rpc('next_serial_number', { project_id: query.project_id });
            
        if (error) throw error;

        if (!data) {
            nextSerial = 1;
        } else {
            nextSerial = parseInt(data, 10) + 1;
        }
    } catch (e) {
        console.log(e);
    }

    return {
        props: {
            availableStates: [...projectDetails[0].states],
            nextSerial,
            projectId: query.project_id,
            projectName: projectDetails[0].name
        },
    }
}