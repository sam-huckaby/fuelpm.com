import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import { supabase } from "../../../../../utils/supabaseClient";
import { textColorChoice } from '../../../../../utils/helpers';

import AuthGuard from '../../../../../components/auth/AuthGuard';
import FloatingHeader from '../../../../../components/common/FloatingHeader';
import Dropdown from '../../../../../components/common/Dropdown';
import StateDropdown from '../../../../../components/common/StateDropdown';
import HelpText from '../../../../../components/common/HelpText';

export default function Project() {
    // View state values
    const [task, setTask] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [nextTerminal, setNextTerminal] = useState(1)

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

        // Retrieve the serial of the only task that can be made terminal in this project
        try {
            let { data, error } = await supabase
                .rpc('next_terminal', { task_project_id: parseInt(router.query.projectId, 10) });
                
            if (error) throw error;

            if (!data) {
                setNextTerminal(1);
            } else {
                setNextTerminal(parseInt(data, 10));
            }
        } catch (e) {
            console.log(e);
        }
        
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
        // IF this task is already terminal, do not allow edits
        if (nextTerminal > task.serial) {
            return;
        }

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
        // IF this task is already terminal, do not allow edits
        if (nextTerminal > task.serial) {
            return;
        }

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
            return (
                <div className="flex-auto flex flex-col animate-pulse">
                    <div className="flex flex-row justify-between pb-2 border-b border-stone-400 border-solid">
                        <div className="text-3xl bg-gray-300 w-full mt-1">&nbsp;</div>
                    </div>
                    <div className="py-4 flex flex-row justify-between items-center">
                        <span className="block bg-gray-300 w-20">&nbsp;</span>
                        <div className="flex flex-col justify-start items-start">
                            <span className="text-stone-500 dark:text-stone-300 text-xs w-20 bg-gray-300">&nbsp;</span>
                            <span className="bg-gray-300 w-32 mt-2">&nbsp;</span>
                        </div>
                    </div>
                    <div className="bg-gray-300 block">&nbsp;</div>
                    <div className="bg-gray-300 block mt-1">&nbsp;</div>
                    <div className="bg-gray-300 block mt-1">&nbsp;</div>
                    <div className="bg-gray-300 block mt-1">&nbsp;</div>
                </div>
            );
        } else if (task && task.notFound) {
            return <div>Sorry! That task doesn't seem to exist.</div>;
        } else {
            return (
                <div className="flex-auto flex flex-col">
                    <div className="flex flex-row justify-between pb-2 border-b border-stone-400 border-solid">
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
                                    { label: 'Delete This Task', onClick: deleteThisTask, classes: 'text-red-600', confirm: { title: 'Delete This Task', description: 'This will delete this task permanently, are you sure this is what you want to do?', danger: true, proceed: 'Delete', cancel: 'Cancel' } },
                                ]}></Dropdown>
                        }
                    </div>
                    <div className="py-4 flex flex-row justify-between items-center">
                        {
                            // Only allow them to edit the state if it is the most recent terminal task or an unfinished on
                            (editing && task.serial >= (nextTerminal-1))?
                                <StateDropdown taskState={task.states} projectStates={task.projects.states} allowTerminal={nextTerminal === task.serial} updater={setNewState} /> :
                                <div className="flex flex-row items-center">
                                    <span style={{backgroundColor: task.states.color, color: textColorChoice(task.states.color)}} className="text-ellipsis overflow-hidden whitespace-nowrap text-center p-1 mr-2">{task.states.label}</span>
                                    {(editing && task.serial < (nextTerminal-1))? <HelpText text="Why can't I change this?" description="This status cannot be changed because it is not the most recently completed task and is already in a terminal status. If you need to do more for this task you should consider creating a new task, that way it maintains the history of your work."></HelpText> : ''}
                                </div>
                        }
                        <div className="flex flex-col justify-start items-start">
                            <span className="text-stone-500 dark:text-stone-300 text-xs">Last Updated</span>
                            <span>{(new Date(task.updated_at)).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className={((editing)? 'flex' : 'hidden') + ` my-2 flex-row justify-center items-center`}>
                        <span>Fuel Supports <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener"><span className="underline">Markdown</span> <div className="inline-block rounded border-stone-700 dark:border-white border-solid border"><span className="w-3 h-3 flex flex-row justify-center items-center bg-neutral-100 dark:bg-stone-700 translate-x-[2px] -translate-y-[2px]">&#8599;</span></div></a></span>
                    </div>
                    {
                        (editing)?
                            <textarea
                                className="flex-auto bg-transparent rounded border-stone-700 dark:border-white border border-solid p-2 whitespace-pre-wrap"
                                defaultValue={task.description}
                                rows={5}
                                onChange={(e) => setNewDescription(e.target.value)} /> :
                            <ReactMarkdown className="prose prose-stone dark:prose-invert lg:max-w-none">{task.description}</ReactMarkdown>
                    }
                    <div className={((!editing)? 'hidden' : '') + ` mt-2 dark:bg-stone-700 p-2 flex flex-row items-end justify-between border-t border-solid border-stone-400`}>
                        {
                            (editing)?
                            (
                                <>
                                    <button onClick={() => setEditing(false)} className="text-xl p-2 border border-solid border-stone-300 rounded">Cancel</button>
                                    <button onClick={saveTaskEdits} className="text-xl p-2 rounded">Save</button>
                                </>
                            ) : <></>
                        }
                    </div>
                </div>
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
            <div className="flex-auto flex flex-col p-2">
                <div className={((editing)? 'hidden' : '') + ` mb-1`}>
                    <Link href={`/app/p/${router.query.projectId}`}>
                        <span className="pb-1 cursor-pointer border-b border-solid border-stone-700 dark:border-white">&#8249; Back to {task?.projects?.name}</span>
                    </Link>
                </div>
                { renderTaskDetails() }
            </div>
        </div>
    );
}