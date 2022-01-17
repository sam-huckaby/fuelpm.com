import Link from 'next/link';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';

import { supabase } from "../../../utils/supabaseClient";

import AuthGuard from '../../../components/auth/AuthGuard';
import FloatingHeader from '../../../components/common/FloatingHeader';
import LoadingPane from '../../../components/common/LoadingPane';

export default function AllProjects(props) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            // Grab all the projects
            let { data: projects, error } = await supabase
                .from('projects')
                .select('*');

            if (error) {
                const handleAuthErrors = (await import('../../../utils/helpers')).handleAuthErrors;
                handleAuthErrors(error);
            };

            setProjects(projects);
            setLoading(false);
        }
        fetchProjects();
    }, [])

    function renderProjects() {
        if (projects.length < 1 && loading === true) {
            return (
                <></>
            );
        } else if (projects.length < 1 && loading === false) {
            return (
                <div className="text-stone-400 flex flex-row justify-center items-center p-5">You Have No Projects</div>
            );
        } else {
            return (
                <div className="flex flex-col">
                    {
                        projects &&
                        projects.map(
                            (cur) => 
                                <Link key={cur.name} href={`/app/p/${cur.id}`}>
                                    <div className="flex flex-col justify-center items-center cursor-pointer
                                                    p-4 mt-2 border-stone-400 border-solid border
                                                    hover:bg-stone-700/10 active:bg-white
                                                    hover:dark:bg-white/10 active:dark:bg-stone-700">
                                        <div className="text-lg">{cur.name}</div>
                                    </div>
                                </Link>
                        )
                    }
                </div>
            );
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>My Projects | FuelPM</title>
                <meta name="description" content="Access the projects in your account quickly and easily." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.fuelpm.com/app/projects" />
                <meta property="og:title" content="My Projects | FuelPM" />
                <meta
                    property="og:description"
                    content="Access the projects in your account quickly and easily."
                />
                <link rel="icon" href="/Fuel-Favicon.svg" />
            </Head>
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto flex flex-col p-2">
                <div className="flex flex-row items-center justify-between pb-2 border-b border-solid border-orange-600">
                    <span className="text-3xl text-orange-600 font-mono">Projects</span>
                    <Link href="/app/projects/create"><button className={((projects.length < 5)? 'relative' : 'hidden') + ` text-xl p-2 border border-solid border-orange-600 rounded`}>&#43;&nbsp;Create</button></Link>
                </div>
                <LoadingPane loading={loading}></LoadingPane>
                {renderProjects()}
            </div>
        </div>
    );
}