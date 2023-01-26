/*
    This page needs to handle a variety of scenarios, each with unique paths forward for the user
    1. The user has no projects at all
        In this case, the user should be nudged towards the projects screen
        The projects screen should handle directing a user to create an initial project
        Display text: "Let's get started by adding a project to work on!"
    2. The user has one or more projects, but no unfinished tasks
        In this case, the user should be nudged towards the projects screen
        The projects screen should handle directing a user to create a new project or add tasks
        Display text: "Looks like you're all caught up on your projects, do you want to add some tasks?"
    3. The user has one or more projects with one or more unfinished tasks
        In this case, the user should be given a list of next steps that will allow them to jump back in
        Each "next step" should allow the user to go directly to the task or go directly to the project it is in
        Display text: "Here are the next tasks to do in your projects, time to dive back in!"
*/

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { supabase } from '../../utils/supabaseClient';
import { textColorChoice } from '../../utils/helpers';

import AuthGuard from '../../components/auth/AuthGuard';
import FloatingHeader from '../../components/common/FloatingHeader';

export default function Dashboard() {
    const [nextTasks, setNextTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If the user's session changes, fetch the dashboards if they are logged in after the change
        // This fixed Google auth users from getting a persistent loading veil.
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, _session) => {
            if (_session) {
                fetchNextTasks();
            }
        });
        
        const fetchNextTasks = async () => {
            setLoading(true);
            // Retrieve the serial of the only task that can be made terminal in this project
            try {
                let { data, error } = await supabase
                    .rpc('next_tasks_dashboard');
                    
                if (error) throw error;

                if (!data) {
                    setNextTasks([]);
                } else {
                    setNextTasks(data);
                }
                setLoading(false);
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        }

        // If the user is already logged in, just fetch and display the dashboards
        if (supabase?.auth?.currentSession) {
            fetchNextTasks();
        }

        return () => {
            authListener.unsubscribe();
        }
    }, [supabase?.auth?.currentSession]);

    function renderNextSteps() {
        if (loading) {
            return (
                <div className="flex flex-col md:flex-row md:flex-wrap">
                    <div className="flex flex-col md:w-96 md:h-48 md:mr-4 border-2 border-solid border-gray-300 p-2 mb-4 animate-pulse">
                        <div className="text-sm bg-gray-300">
                            <span className="block">&nbsp;</span>
                        </div>
                        <div className="flex flex-row justify-between pb-2 border-b border-solid border-gray-300">
                            <div className="font-bold flex-auto mt-1 bg-gray-300">
                                <span className="block">&nbsp;</span>
                            </div>
                            <div className="font-bold w-20 ml-4 mt-1 bg-gray-300">
                                <span className="block">&nbsp;</span>
                            </div>
                        </div>
                        <div className="flex-auto p-2 hidden md:line-clamp-2 mt-1 bg-gray-300">
                            <span className="block">&nbsp;</span>
                            <span className="block">&nbsp;</span>
                        </div>
                        <div className="flex flex-row space-between mt-2">
                            <button className="flex-auto basis-2/4 p-4 border border-solid border-gray-300 dark:border-white mr-1">
                                <span className="bg-gray-300 block">&nbsp;</span>
                            </button>
                            <button className="flex-auto basis-2/4 p-4 border border-solid border-gray-300 dark:border-white ml-1">
                                <span className="bg-gray-300 block">&nbsp;</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:w-96 md:h-48 md:mr-4 border-2 border-solid border-gray-300 p-2 mb-4 animate-pulse">
                        <div className="text-sm bg-gray-300">
                            <span className="block">&nbsp;</span>
                        </div>
                        <div className="flex flex-row justify-between pb-2 border-b border-solid border-gray-300">
                            <div className="font-bold flex-auto mt-1 bg-gray-300">
                                <span className="block">&nbsp;</span>
                            </div>
                            <div className="font-bold w-20 ml-4 mt-1 bg-gray-300">
                                <span className="block">&nbsp;</span>
                            </div>
                        </div>
                        <div className="flex-auto p-2 hidden md:line-clamp-2 mt-1 bg-gray-300">
                            <span className="block">&nbsp;</span>
                            <span className="block">&nbsp;</span>
                        </div>
                        <div className="flex flex-row space-between mt-2">
                            <button className="flex-auto basis-2/4 p-4 border border-solid border-gray-300 dark:border-white mr-1">
                                <span className="bg-gray-300 block">&nbsp;</span>
                            </button>
                            <button className="flex-auto basis-2/4 p-4 border border-solid border-gray-300 dark:border-white ml-1">
                                <span className="bg-gray-300 block">&nbsp;</span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else if (nextTasks?.length > 0) {
            return <div className="flex flex-col md:flex-row md:flex-wrap">
                {
                    nextTasks.map((cur, index) => 
                        <div key={index} className="flex flex-col md:w-96 md:h-48 md:mr-4 border-stone-400 border-solid border p-2 mb-4">
                            <div className="text-sm">{cur.project_name}</div>
                            <div className="flex flex-row justify-between pb-2 border-b border-solid border-stone-400">
                                <div className="font-bold">{cur.task_name}</div>
                                <div className="font-bold">
                                    <span style={{backgroundColor: cur.task_state_color, color: textColorChoice(cur.task_state_color)}} className="ml-3 basis-20 w-20 text-ellipsis overflow-hidden whitespace-nowrap text-center p-1">{cur.task_state_label}</span>
                                </div>
                            </div>
                            <div className="flex-auto p-2 hidden md:line-clamp-2">
                                {cur.task_description}
                            </div>
                            <div className="flex flex-row space-between mt-2">
                                <Link href={`/app/p/${cur.project_id}/t/${cur.task_serial}`}>
                                    <button className="flex-auto basis-2/4 p-4 border border-solid border-stone-700 dark:border-white mr-1">View Task</button>
                                </Link>
                                <Link href={`/app/p/${cur.project_id}`}>
                                    <button className="flex-auto basis-2/4 p-4 border border-solid border-stone-700 dark:border-white ml-1">View Project</button>
                                </Link>
                            </div>
                        </div>
                    )
                }
            </div>;
        } else {
            return <div className="flex flex-row justify-center items-center border border-solid border-sky-500 p-2 md:h-48">There's nothing for you to do right now!</div>
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>Account Dashboard | FuelPM</title>
                <meta name="description" content="Get a high-level view of where your projects stand - all in one place." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.fuelpm.com/app/dashboard" />
                <meta property="og:title" content="Account Dashboard | FuelPM" />
                <meta
                    property="og:description"
                    content="Get a high-level view of where your projects stand - all in one place."
                />
                <link rel="icon" href="/Fuel-Favicon.svg" />
            </Head>
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto flex flex-col p-2">
                <span className="text-2xl font-bold mb-2">Next Steps</span>
                <span className="italic mb-4">Get a look at the tasks that are next in your projects, and dive back in where you can get the most done.</span>
                { renderNextSteps() }
            </div>
        </div>
    );
}