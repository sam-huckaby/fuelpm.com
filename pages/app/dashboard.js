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
        const fetchNextTasks = async () => {
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
        fetchNextTasks();
    }, []);

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
                <span className="italic mb-2">Get a look at the tasks that are next in your projects, and dive back in where you can get the most done.</span>
                {
                    nextTasks &&
                    nextTasks.map((cur, index) => 
                        <div key={index} className="flex flex-col border border-solid border-stone-400 p-2 mb-2">
                            <div className="text-sm">{cur.project_name}</div>
                            <div className="flex flex-row justify-between pb-2 border-b border-solid border-stone-400">
                                <div className="font-bold">{cur.task_name}</div>
                                <div className="font-bold">
                                    <span style={{backgroundColor: cur.task_state_color, color: textColorChoice(cur.task_state_color)}} className="ml-3 basis-20 w-20 text-ellipsis overflow-hidden whitespace-nowrap text-center p-1">{cur.task_state_label}</span>
                                </div>
                            </div>
                            <div className="p-2 line-clamp-2">
                                {cur.task_description}
                            </div>
                            <div className="flex flex-row space-between mt-2">
                                <Link href={`/app/p/${cur.project_id}/t/${cur.task_serial}`}>
                                    <button className="flex-auto basis-2/4 p-4 border border-solid border-stone-700 mr-1">View Task</button>
                                </Link>
                                <Link href={`/app/p/${cur.project_id}`}>
                                    <button className="flex-auto basis-2/4 p-4 border border-solid border-stone-700 ml-1">View Project</button>
                                </Link>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}