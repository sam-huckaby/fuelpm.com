import React, { useState, useRef } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import AuthGuard from '../../../components/auth/AuthGuard';
import FloatingHeader from '../../../components/common/FloatingHeader';
import { supabase } from "../../../utils/supabaseClient";

export default function CreateProject() {
    // The router to move the user to the newly created project's detail page
    const router = useRouter();

    // State values
    const [name, setName] = useState("");
    const [description, setDescription] = useState('');
    const [nonTerminalStates, setNonTerminalStates] = useState([
        {
            label: 'To Do',
            color: '#CCCCCC',
            terminal: false
        },
        {
            label: 'In Progress',
            color: '#00B9D1',
            terminal: false
        }
    ]);
    const [terminalStates, setTerminalStates] = useState([
        {
            label: 'Complete',
            color: '#00A303',
            terminal: true
        }
    ]);

    // References
    const nonTerminalInput = useRef('');
    const terminalInput = useRef('');

    function handleNonTerminalEnter(e) {
        if (e.key === 'Enter') {
            addNonTerminal();
        }
    }
    
    function addNonTerminal() {
        // Add new status, but prevent duplicates
        setNonTerminalStates([...nonTerminalStates.filter((cur) => (cur.label !== nonTerminalInput.current.value)), {label:nonTerminalInput.current.value, color:'#CCCCCC', terminal:false}]);
        nonTerminalInput.current.value = '';
    }

    function removeNonTerminal(label) {
        setNonTerminalStates([...nonTerminalStates.filter((cur) => (cur.label !== label))]);
    }

    function handleTerminalEnter(e) {
        if (e.key === 'Enter') {
            addTerminal();
        }
    }

    function addTerminal() {
        // Add new status, but prevent duplicates
        setTerminalStates([...terminalStates.filter((cur) => (cur.label !== terminalInput.current.value)), {label:terminalInput.current.value, color:'#CCCCCC', terminal:true}]);
        terminalInput.current.value = '';
    }

    function removeTerminal(label) {
        setTerminalStates([...terminalStates.filter((cur) => (cur.label !== label))]);
    }

    async function save() {
        let user = await supabase.auth.user();

        const createdProject = await supabase
            .from('projects')
            .insert([
                {
                    owner_id: user.id,
                    name,
                    description,
                }
            ]);

        if (createdProject.error) throw createdProject.error;

        // Create the member entry manually, since the alpha-testing triggers/functions aren't quite working.
        const createdMembers = await supabase
            .from('members')
            .insert([
                {
                    member_id: user.id,
                    project_id: createdProject.data[0].id,
                }
            ]);

        if (createdMembers.error) throw createdMembers.error;

        // Call supabase to add all of these states
        const createdStates = await supabase
            .from('states')
            .insert([
                ...nonTerminalStates.map((cur) => ({...cur, project_id: createdProject.data[0].id})),
                ...terminalStates.map((cur) => ({...cur, project_id: createdProject.data[0].id})),
            ]);

        if (createdStates.error) throw createdStates.error;

        // Send the user on to the detail page of their new project
        router.push(`/app/p/${createdProject.data[0].id}`);
    }

    function reset() {
        // Set State back to defaults
        setName("");
        setDescription('');
        setNonTerminalStates([
            {
                label: 'To Do',
                color: '#CCCCCC',
                terminal: false
            },
            {
                label: 'In Progress',
                color: '#00B9D1',
                terminal: false
            }
        ]);
        setTerminalStates([
            {
                label: 'Complete',
                color: '#00A303',
                terminal: true
            }
        ]);

        // Set form back to defaults
        nonTerminalInput.current.value = '';
        terminalInput.current.value = '';
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>Create a New Project | FuelPM</title>
                <meta name="description" content="Create a new project to track your work." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.fuelpm.com/app/projects/create" />
                <meta property="og:title" content="Create a New Project | FuelPM" />
                <meta
                    property="og:description"
                    content="Create a new project to track your work."
                />
                <link rel="icon" href="/Fuel-Favicon.svg" />
            </Head>
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto dark:bg-stone-700 dark:text-white flex flex-col p-2">
                <div className="flex flex-row justify-between items-center pb-2 border-b border-solid border-orange-600">
                    <span className="text-2xl font-mono">Project Details:</span>
                    <Link href="/app/projects"><button>Cancel</button></Link>
                </div>
                <div className="flex flex-col pt-3">
                    <label htmlFor="project_name">Name</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="rounded border border-solid border-orange-600 bg-transparent h-8"
                        type="text"
                        name="name"
                        id="project_name" />
                </div>
                <div className="flex flex-col pt-3">
                    <label htmlFor="project_description">Description</label>
                    <textarea 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="rounded border border-solid border-orange-600 bg-transparent h-8"
                        name="description"
                        id="project_description"></textarea>
                </div>
                <div className="flex flex-row items-end pt-3">
                    <div className="flex flex-col flex-auto">
                        <label htmlFor="project_name">Non-terminal Statuses</label>
                        <input
                            ref={nonTerminalInput}
                            className="rounded border border-solid border-orange-600 bg-transparent h-8 mr-3"
                            onKeyPress={(e) => handleNonTerminalEnter(e)}
                            type="text"
                            name="name"
                            id="project_non_terminal_input" />
                    </div>
                    <button onClick={() => addNonTerminal()} className="rounded bg-transparent border border-solid border-orange-600 w-8 h-8">&#43;</button>
                </div>
                <div className="fuel-chips-container flex flex-row flex-wrap justify-start items-center">
                    {nonTerminalStates && (
                        <>
                            {
                                nonTerminalStates.map(item =>
                                    <div key={item.label} id={item.label+'_nonterminal_status'} className="inline-block flex flex-row justify-start items-center min-w-[75px] rounded bg-stone-300 dark:bg-stone-500 mr-4 mt-3">
                                        <input className="h-[25px] w-[20px] bg-transparent" type="color" defaultValue={item.color} />
                                        <label htmlFor={item.label+'_nonterminal_status'} className="text-black dark:text-white flex-auto flex flex-row justify-center items-center">{item.label}</label>
                                        <button onClick={() => removeNonTerminal(item.label)} className="h-4 w-4 text-base flex flex-row justify-center items-center ml-2 border-none text-white">X</button>
                                    </div>
                                )
                            }
                        </>
                    )}
                </div>
                <div className="flex flex-row items-end pt-3">
                    <div className="flex flex-col flex-auto">
                        <label htmlFor="project_name">Terminal Statuses</label>
                        <input
                            ref={terminalInput}
                            className="rounded border border-solid border-orange-600 bg-transparent h-8 mr-3"
                            onKeyPress={(e) => handleTerminalEnter(e)}
                            type="text"
                            name="name"
                            id="project_terminal_input" />
                    </div>
                    <button onClick={() => addTerminal()} className="rounded bg-transparent border border-solid border-orange-600 w-8 h-8">&#43;</button>
                </div>
                <div className="fuel-chips-container flex flex-row flex-wrap justify-start items-center">
                    {terminalStates && (
                        <>
                        {
                            terminalStates.map(item =>
                                <div key={item.label} id={item.label+'_terminal_status'} className="inline-block flex flex-row justify-start items-center min-w-[75px] rounded bg-stone-300 dark:bg-stone-500 mr-4 mt-3">
                                    <input className="h-[25px] w-[20px] bg-transparent" type="color" defaultValue={item.color} />
                                    <label htmlFor={item.label+'_terminal_status'} className="text-black dark:text-white flex-auto">{item.label}</label>
                                    <button onClick={() => removeTerminal(item.label)} className="h-4 w-4 text-base flex flex-row justify-center items-center ml-2 border-none text-white">X</button>
                                </div>
                            )
                        }
                    </>
                    )}
                </div>
            </div>
            <div className="dark:bg-stone-700 p-2 flex flex-row items-center justify-between border-t border-solid border-orange-600">
                <button onClick={() => reset()} className="text-xl p-2 border border-solid border-stone-300 text-black dark:text-white rounded">Reset</button>
                <button onClick={() => save()} className="text-xl p-2 border border-solid border-orange-600 text-black dark:text-white rounded">Save</button>
            </div>
        </div>
    );
}