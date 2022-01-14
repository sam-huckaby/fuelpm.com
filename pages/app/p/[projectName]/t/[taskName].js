import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import { supabase } from "../../../../../utils/supabaseClient";
import { textColorChoice } from '../../../../../utils/helpers';

import AuthGuard from '../../../../../components/auth/AuthGuard';
import FloatingHeader from '../../../../../components/common/FloatingHeader';
import LoadingPane from '../../../../../components/common/LoadingPane';

export default function Project() {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchTask = async () => {
            let { data: tasks, error } = await supabase
                .from('tasks')
                .select('*, states(*)')
                .eq('name', router.query.taskName)
                .eq('projects.name', router.query.projectName);

            if (error) throw error;

            if (tasks.length === 0) {
                setTask({
                    notFound: true
                });
                setLoading(false);
            } else if (tasks.length === 1) {
                setTask(tasks[0]);
                setLoading(false);
            } else {
                throw 'More than one task found';
            }
        }
        fetchTask();
    }, [router.query.projectName, router.query.taskName]);

    function renderTaskDetails() {
        if (loading) {
            return <></>;
        } else if (task && task.notFound) {
            return <div>Sorry! That task doesn't seem to exist.</div>;
        } else {
            return (
                <>
                    <div className="flex flex-row justify-between pb-2 border-b border-orange-600 border-solid">
                        <div className="text-3xl">{task.name}</div>
                        <button className="p-2 border-solid border border-stone-400 rounded">Edit</button>
                    </div>
                    <div className="py-4 flex flex-row justify-between items-center">
                        <span style={{backgroundColor: task.states.color, color: textColorChoice(task.states.color)}} className="text-ellipsis overflow-hidden whitespace-nowrap text-center p-1">{task.states.label}</span>
                        <div className="flex flex-col justify-start items-start">
                            <span className="text-stone-500 dark:text-stone-300 text-xs">Last Updated</span>
                            <span>{(new Date(task.updated_at)).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="text-sm">{task.description}</div>
                </>
            );
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>{(loading)? 'Loading...' : task.name + ' > ' + router.query.projectName} | FuelPM</title>
                <meta name="description" content={((loading)? 'Loading...' : task.description)} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={((loading)? 'Loading...' : task.name + ' > ' + router.query.projectName) + ' | FuelPM'} />
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
                    <Link href={`/app/p/${router.query.projectName}`}>
                        <span className="pb-1 cursor-pointer border-b border-solid border-stone-700 dark:border-white">&#8249; Back to {router.query.projectName}</span>
                    </Link>
                </div>
                <LoadingPane loading={loading}></LoadingPane>
                { renderTaskDetails() }
            </div>
        </div>
    );
}