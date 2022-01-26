import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import * as Switch from '@radix-ui/react-switch';

import { supabase } from "../../../../utils/supabaseClient";
import { textColorChoice } from '../../../../utils/helpers';

import AuthGuard from '../../../../components/auth/AuthGuard';
import FloatingHeader from '../../../../components/common/FloatingHeader';
import LoadingPane from '../../../../components/common/LoadingPane';
import Dropdown from '../../../../components/common/Dropdown';

import styles from '../../../../styles/app/ProjectDetail.module.scss';

export default function Project() {
    // View state values
    const [project, setProject] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewTerminal, setViewTerminal] = useState(false);

    // Project state values
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    // TODO: Consider the implications of there being two projects with the same name
    // Should the DB prevent duplicate names within the same account? - Yes (Sam, January 8th, 2022) [Added Unique constraint on `projects`]
    // Should there be a different page for projects that don't belong to the current user?
    const router = useRouter();

    useEffect(() => {
        const fetchProject = async () => {
            if (router.query.projectId) {
                // Grab all the projects
                let { data: projects, error } = await supabase
                    .from('projects')
                    .select('*, tasks(*, states(*))')
                    .eq('id', router.query.projectId);

                if (error) throw error;
                
                if (projects.length === 0) {
                    setProject({
                        notFound: true
                    });
                    setLoading(false);
                } else if (projects.length === 1) {
                    setProject(projects[0]);
                    setNewName(projects[0].name);
                    setNewDescription(projects[0].description);
                    setLoading(false);
                } else {
                    throw 'More than one project found';
                }
            }
        }
        fetchProject();
    }, [router.query.projectId]);

    async function saveProjectEdits() {
        const { data, error } = await supabase
            .from('projects')
            .update({
                name: newName,
                description: newDescription,
            })
            .eq('id', router.query.projectId);

        if (error) throw error;

        data[0].tasks = project?.tasks;
        setProject(data[0]);

        setEditing(false);
    }

    async function deleteThisProject() {
        // Call Supabase to remove this project
        const { data, error } = await supabase
            .from('projects')
            .delete()
            .eq('id', router.query.projectId);

        if (error) throw error;

        // Call router to take us back to the projects page
        router.push("/app/projects");
    }

    function renderDetails() {
        if (loading) {
            return <></>;
        } else if (project && project.notFound) {
            return <div>Sorry! That project doesn't seem to exist.</div>;
        } else {
            return (
                <>
                    <div className="flex flex-row justify-between pb-2 border-b border-orange-600 border-solid">
                        {
                            (editing)?
                                <input
                                    className="bg-transparent rounded border-stone-700 dark:border-white border border-solid p-2 flex-auto"
                                    type="text"
                                    defaultValue={project.name}
                                    onChange={(e) => setNewName(e.target.value)}></input> :
                                <div className="text-3xl">{project.name}</div>
                        }
                        {
                            (editing)?
                                '' :
                                <Dropdown title="&#8943;" type="settings" items={[
                                    { label: 'Edit', onClick: () => setEditing(true) },
                                    { separator: true },
                                    { label: 'Delete This Project', onClick: deleteThisProject, classes: 'text-red-600', confirm: { title: 'Delete This Project', description: 'This will delete this project permanently along with all tasks, are you sure this is what you want to do?', danger: true, proceed: 'Delete', cancel: 'Cancel' } },
                                ]}></Dropdown>
                        }
                    </div>
                    {
                        (editing)?
                            <textarea
                                className="bg-transparent rounded mt-2 border-stone-700 dark:border-white border border-solid p-2"
                                defaultValue={project.description}
                                rows={5}
                                onChange={(e) => setNewDescription(e.target.value)} /> :
                            <div className="text-sm mt-2">{project.description}</div>
                    }
                    <div className="flex flex-row justify-end">
                        {
                            (editing)?
                            (
                                <>
                                    <button onClick={() => setEditing(false)} className="my-2">Cancel</button>
                                    <button onClick={saveProjectEdits} className="ml-4 my-2 p-2 border-solid border border-stone-400 rounded">Save</button>
                                </>
                            ) : <></>
                        }
                    </div>
                    <div className="flex flex-row justify-between items-center mt-5 pb-2 mb-2 font-bold">
                        <span className="text-lg">Tasks</span>
                        <div className="flex flex-row sm:ml-4">
                            <Switch.Root onCheckedChange={(checked) => setViewTerminal(checked)} className={`${styles['terminal-toggle']} rounded-full w-[50px] h-[31px] p-0 bg-white dark:bg-stone-700 border border-solid border-stone-800`}>
                                <Switch.Thumb className={`${styles['terminal-toggle-thumb']} rounded-full h-[25px] w-[25px] block bg-stone-700 dark:bg-white translate-x-[2px] transition-transform`} />
                            </Switch.Root>
                            <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center text-xs ml-2">
                                <span>Show Completed</span>
                                <span className="sm:ml-1">Tasks</span>
                            </div>
                        </div>
                        <div className="hidden sm:block sm:flex-auto">&nbsp;</div>
                        <button onClick={() => addTask()} className="p-0 border-solid border border-stone-400 rounded-full flex flex-col justify-center items-center h-8 w-8">&#43;</button>
                    </div>
                    <div className="flex flex-col md:flex-row md:flex-wrap">
                        {renderTasks()}
                    </div>
                </>
            );
        }
    }

    function addTask() {
        router.push({
            pathname: '/app/tasks/create',
            query: {
                project_id: project.id,
            },
        });
    }

    function renderTasks() {
        if (project?.tasks && project?.tasks.length) {
            return (
                <>
                    {project?.tasks.map((cur) => 
                        <Link key={cur.serial} href={`/app/p/${project?.id}/t/${cur.serial}`}>
                            <div className={((!cur.states.terminal || viewTerminal)? 'flex' : 'hidden') + ` flex-col
                                py-4 px-2 mb-2 border-stone-400 border-solid border cursor-pointer transition-opacity
                                hover:bg-stone-700/10 active:bg-white
                                hover:dark:bg-white/10 active:dark:bg-stone-700
                                
                                md:mr-2 md:justify-start md:items-start md:h-60 md:w-64`}>
                                <div className="flex flex-row md:w-full justify-between items-center">
                                    <span className="flex-1 text-ellipsis overflow-hidden whitespace-nowrap">{cur.name}</span>
                                    <span style={{backgroundColor: cur.states.color, color: textColorChoice(cur.states.color)}} className="ml-3 basis-20 w-20 text-ellipsis overflow-hidden whitespace-nowrap text-center p-1">{cur.states.label}</span>
                                </div>
                                <span className="text-stone-600 dark:text-stone-300 pt-2 border-t border-solid border-stone-600 dark:border-stone-300 md:line-clamp-6 md:w-full">{cur.description}</span>
                            </div>
                        </Link>
                    )}
                </>
            );
        } else {
            return (
                <div className="text-stone-400/60 flex flex-row justify-center items-center">No Tasks Yet</div>
            );
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>{(loading)? 'Loading...' : project.name} | FuelPM</title>
                <meta name="description" content={((loading)? 'Loading...' : project.description)} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={((loading)? 'Loading...' : project.name) + ' | FuelPM'} />
                <meta
                    property="og:description"
                    content={((loading)? 'Loading...' : project.description)}
                />
                <link rel="icon" href="/Fuel-Favicon.svg" />
            </Head>
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto flex flex-col p-3">
                <LoadingPane loading={loading}></LoadingPane>
                { renderDetails() }
            </div>
        </div>
    );
}