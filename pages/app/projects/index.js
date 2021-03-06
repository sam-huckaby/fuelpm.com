import Link from 'next/link';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';

import { supabase } from "../../../utils/supabaseClient";

import AuthGuard from '../../../components/auth/AuthGuard';
import FloatingHeader from '../../../components/common/FloatingHeader';

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
        if (projects?.length < 1 && loading === true) {
            return (
                <div className="animate-pulse
                                flex flex-col justify-center items-center cursor-pointer
                                p-4 mt-2 border-stone-400 border-solid border
                                hover:bg-stone-700/10 active:bg-white
                                hover:dark:bg-white/10 active:dark:bg-stone-700
                                
                                md:mr-2 md:justify-start md:items-start md:h-60 md:w-64
                                ">
                    <div className="text-lg font-bold bg-gray-300 w-full">&nbsp;</div>
                    <p className="hidden md:line-clamp-6 mt-4 bg-gray-300 w-full">
                        <span className="block">&nbsp;</span>
                        <span className="block">&nbsp;</span>
                        <span className="block">&nbsp;</span>
                        <span className="block">&nbsp;</span>
                        <span className="block">&nbsp;</span>
                        <span className="block">&nbsp;</span>
                    </p>
                </div>
            );
        } else if (projects?.length < 1 && loading === false) {
            return (
                <div className="text-stone-400 flex flex-row justify-center items-center p-5">You Have No Projects</div>
            );
        } else {
            return (
                <div className="flex flex-col md:flex-row">
                    {
                        projects &&
                        projects.map(
                            (cur) => 
                                <Link key={cur.name} href={`/app/p/${cur.id}`}>
                                    <div className="
                                                    flex flex-col justify-center items-center cursor-pointer
                                                    p-4 mt-2 border-stone-400 border-solid border
                                                    hover:bg-stone-700/10 active:bg-white
                                                    hover:dark:bg-white/10 active:dark:bg-stone-700
                                                    
                                                    md:mr-2 md:justify-start md:items-start md:h-60 md:w-64
                                                    ">
                                        <div className="text-lg font-bold">{cur.name}</div>
                                        <p className="hidden md:line-clamp-6 mt-4">{cur.description}</p>
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
            <div className="flex-auto p-2 flex flex-col">
                <div className="flex flex-row items-center justify-between pb-2 border-b border-solid border-stone-400">
                    <span className="text-3xl text-black dark:text-white font-mono">Projects</span>
                    <Link href="/app/projects/create"><button className={((projects?.length < 5)? 'relative' : 'hidden') + ` text-xl p-2 rounded`}>&#xFF0B;&nbsp;Create</button></Link>
                </div>
                {renderProjects()}
            </div>
        </div>
    );
}