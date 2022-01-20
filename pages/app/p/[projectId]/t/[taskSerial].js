import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import { supabase } from "../../../../../utils/supabaseClient";
import { textColorChoice } from '../../../../../utils/helpers';

import AuthGuard from '../../../../../components/auth/AuthGuard';
import FloatingHeader from '../../../../../components/common/FloatingHeader';
import LoadingPane from '../../../../../components/common/LoadingPane';
import Dropdown from '../../../../../components/common/Dropdown';
import StateDropdown from '../../../../../components/common/StateDropdown';

export default function Project() {
    // View state values
    const [task, setTask] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Data editing values
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newState, setNewState] = useState(0);

    const router = useRouter();

    useEffect(() => {
        // Only begin loading data if the query params have loaded
        if (router.query.projectId && router.query.taskSerial) {
            fetchTask();
        }
    }, [router.query.projectId, router.query.taskSerial]);

    async function fetchTask() {
        let { data: tasks, error } = await supabase
            .from('tasks')
            .select('*, states(*), projects(id, name, states!states_project_id_fkey(*))')
            .eq('serial', router.query.taskSerial)
            .eq('project_id', router.query.projectId);

        if (error) throw error;
        
        if (tasks.length === 0) {
            setTask({
                notFound: true
            });
            setLoading(false);
        } else if (tasks.length === 1) {
            setTask(tasks[0]);
            setNewName(tasks[0].name);
            setNewDescription(tasks[0].description);
            setNewState(tasks[0].states.id);
            setLoading(false);
        } else {
            throw 'More than one task found';
        }
    }

    async function saveTaskEdits() {
        const { data, error } = await supabase
            .from('tasks')
            .update({
                name: newName,
                description: newDescription,
                state_id: newState,
            })
            .eq('project_id', router.query.projectId)
            .eq('serial', router.query.taskSerial);

        if (error) throw error;

        // Reload the Task's info from the DB to keep things working
        await fetchTask();

        setEditing(false);
    }

    async function deleteThisTask() {
        console.log('OH NO! YOU KILLED THE TASK!');

        // Call Supabase to remove this task
        const { data, error } = await supabase
            .from('tasks')
            .delete()
            .eq('project_id', router.query.projectId)
            .eq('serial', router.query.taskSerial);

        if (error) throw error;

        // Call router to take us back to the parent project page
        router.push(`/app/p/${router.query.projectId}`);
    }

    function renderTaskDetails() {
        if (loading) {
            return <></>;
        } else if (task && task.notFound) {
            return <div>Sorry! That task doesn't seem to exist.</div>;
        } else {
            return (
                <>
                    <div className="flex flex-row justify-between pb-2 border-b border-orange-600 border-solid">
                        {
                            (editing)?
                                <input
                                    className="flex-auto bg-transparent rounded border-stone-700 dark:border-white border border-solid p-2"
                                    type="text"
                                    defaultValue={task.name}
                                    onChange={(e) => setNewName(e.target.value)}></input> :
                                <div className="text-3xl">{task.name}</div>
                        }
                        {
                            (editing)?
                                '' :
                                <Dropdown title="&#8943;" type="settings" items={[
                                    { label: 'Edit', onClick: () => setEditing(true) },
                                    { separator: true },
                                    { label: 'Delete This Task', onClick: deleteThisTask, classes: 'text-red-800', confirm: { title: 'Delete This Task', description: 'This will delete this task permanently, are you sure this is what you want to do?', danger: true, proceed: 'Delete', cancel: 'Cancel' } },
                                ]}></Dropdown>
                        }
                    </div>
                    <div className="py-4 flex flex-row justify-between items-center">
                        {/* {
                            (editing)?
                            <select
                                onChange={e => setNewState(e.target.value)}
                                defaultValue={task.states.id}
                                className="rounded border border-solid border-orange-600 bg-transparent h-8">
                                {
                                    task.projects.states &&
                                    task.projects.states.map((cur, index) => 
                                        <option key={cur.label+'_'+cur.terminal} value={cur.id}>{cur.label}</option>
                                    )
                                }
                            </select> :
                            <span style={{backgroundColor: task.states.color, color: textColorChoice(task.states.color)}} className="text-ellipsis overflow-hidden whitespace-nowrap text-center p-1">{task.states.label}</span>
                        } */}
                        {
                            (editing)?
                            <StateDropdown taskState={task.states} projectStates={task.projects.states} allowTerminal={false} updater={setNewState} /> :
                            <span style={{backgroundColor: task.states.color, color: textColorChoice(task.states.color)}} className="text-ellipsis overflow-hidden whitespace-nowrap text-center p-1">{task.states.label}</span>
                        }
                        <div className="flex flex-col justify-start items-start">
                            <span className="text-stone-500 dark:text-stone-300 text-xs">Last Updated</span>
                            <span>{(new Date(task.updated_at)).toLocaleString()}</span>
                        </div>
                    </div>
                    {
                        (editing)?
                            <textarea
                                className="bg-transparent rounded border-stone-700 dark:border-white border border-solid p-2"
                                defaultValue={task.description}
                                rows={5}
                                onChange={(e) => setNewDescription(e.target.value)} /> :
                            <div className="text-sm">{task.description}</div>
                    }
                    <div className="flex flex-row justify-end">
                        {
                            (editing)?
                            (
                                <>
                                    <button onClick={() => setEditing(false)} className="my-2 p-2 border-solid border border-stone-400 rounded">Cancel</button>
                                    <button onClick={saveTaskEdits} className="ml-4 my-2 p-2 border-solid border border-stone-400 rounded">Save</button>
                                </>
                            ) : <></>
                        }
                    </div>
                </>
            );
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>{(loading)? 'Loading...' : task.name} | FuelPM</title>
                <meta name="description" content={((loading)? 'Loading...' : task.description)} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={((loading)? 'Loading...' : task.name + ' | FuelPM')} />
                <meta
                    property="og:description"
                    content={((loading)? 'Loading...' : task.description)}
                />
                <link rel="icon" href="/Fuel-Favicon.svg" />
            </Head>
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto flex flex-col p-3">
                <div className="mb-1">
                    <Link href={`/app/p/${router.query.projectId}`}>
                        <span className="pb-1 cursor-pointer border-b border-solid border-stone-700 dark:border-white">&#8249; Back to {task?.projects?.name}</span>
                    </Link>
                </div>
                <LoadingPane loading={loading}></LoadingPane>
                { renderTaskDetails() }
            </div>
        </div>
    );
}