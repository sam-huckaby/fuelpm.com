import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import { supabase } from "../../../../utils/supabaseClient";
import { textColorChoice } from '../../../../utils/helpers';

import AuthGuard from '../../../../components/auth/AuthGuard';
import FloatingHeader from '../../../../components/common/FloatingHeader';
import LoadingPane from '../../../../components/common/LoadingPane';

export default function Project() {
    const [project, setProject] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // TODO: Consider the implications of there being two projects with the same name
    // Should the DB prevent duplicate names within the same account? - Yes (Sam, January 8th, 2022) [Added Unique constraint on `projects`]
    // Should there be a different page for projects that don't belong to the current user?
    const router = useRouter();

    useEffect(() => {
        const fetchProject = async () => {
            if (router.query.projectName) {
                // Grab all the projects
                let { data: projects, error } = await supabase
                    .from('projects')
                    .select('*, tasks(*, states(*))')
                    .eq('name', router.query.projectName);

                if (error) throw error;
                
                if (projects.length === 0) {
                    setProject({
                        notFound: true
                    });
                    setLoading(false);
                } else if (projects.length === 1) {
                    setProject(projects[0]);
                    setLoading(false);
                } else {
                    throw 'More than one project found';
                }
            }
        }
        fetchProject();
    }, [router.query.projectName]);

    // Data manipulation functions
    function nameChange(value) {
        project.name = value;
    }

    function descriptionChange(value) {
        project.description = value;
    }

    function saveProjectEdits() {
        console.log('SAVING...');
        setEditing(false);
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
                        { renderNameField() }
                        {
                            (editing)?
                            <button onClick={saveProjectEdits} className="p-2 border-solid border border-stone-400 rounded">Save</button> :
                            <button onClick={() => setEditing(true)} className="p-2 border-solid border border-stone-400 rounded">Edit</button>
                        }
                    </div>
                    { renderDescriptionField() }
                    <div className="flex flex-row justify-between items-center mt-5 pb-2 mb-2 font-bold">
                        <span className="text-lg">Tasks</span>
                        <button onClick={() => addTask()} className="p-2 border-solid border border-stone-400 rounded">+ Add</button>
                    </div>
                    <div className="flex flex-col">
                        {renderTasks()}
                    </div>
                </>
            );
        }
    }

    function renderNameField() {
        if (editing) {
            return (
                <input
                    className="bg-transparent rounded border-white border border-solid p-2"
                    type="text"
                    defaultValue={project.name}
                    onChange={(e) => nameChange(e.target.value)} />
            );
        } else {
            return (
                <div className="text-3xl">{project.name}</div>
            );
        }
    }

    function renderDescriptionField() {
        if (editing) {
            return (
                <textarea
                    className="bg-transparent rounded border-white border border-solid p-2"
                    defaultValue={project.description}
                    onChange={(e) => descriptionChange(e.target.value)} />
            );
        } else {
            return (
                <div className="text-sm">{project.description}</div>
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
                        <Link key={cur.name} href={`/app/p/${project?.name}/t/${cur.name}`}>
                            <div className="flex flex-col py-4 px-2 mb-2 border-stone-400 border-solid border cursor-pointer
                                hover:bg-stone-700/10 active:bg-white
                                hover:dark:bg-white/10 active:dark:bg-stone-700">
                                <div className="flex flex-row justify-between items-center">
                                    <span className="flex-1 text-ellipsis overflow-hidden whitespace-nowrap">{cur.name}</span>
                                    <span style={{backgroundColor: cur.states.color, color: textColorChoice(cur.states.color)}} className="ml-3 basis-20 w-20 text-ellipsis overflow-hidden whitespace-nowrap text-center p-1">{cur.states.label}</span>
                                </div>
                                <span className="text-stone-600 dark:text-stone-300 pt-2 border-t border-solid border-stone-600 dark:border-stone-300">{cur.description}</span>
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