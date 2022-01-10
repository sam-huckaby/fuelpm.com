import React, { useState, useRef } from "react";
import { useRouter } from 'next/router';

import { supabase } from "../../../utils/supabaseClient";
import { supabaseCaptureSSRCookie } from '../../../utils/helpers';

import AuthGuard from '../../../components/auth/authGuard.component';
import FloatingHeader from '../../../components/common/floatingHeader.component';

export default function CreateTask(props) {
    // The router to move the user to the newly created tasks's detail page
    const router = useRouter();

    // State values
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [state, setState] = useState(null);

    // References
    const nameInput = useRef('');
    const descriptionInput = useRef('');
    const stateSelect = useRef('');

    function handleNonTerminalEnter(e) {
        if (e.key === 'Enter') {
            addNonTerminal();
        }
    }

    async function save() {
        console.log({
            name,
            description,
            state
        });

        const { data, error } = await supabase
            .from('tasks')
            .insert([
                {
                    name,
                    project_id: props.projectId,
                    description,
                    state_id: state
                }
            ]);

        if (error) throw error;

        console.log(data);

        // Send the user on to the detail page of their new project
        // router.push(`/app/p/${data[0].name}`);
    }

    function reset() {
        // Set form back to defaults
        nameInput.current.value = '';
        descriptionInput.current.value = '';
        nonTerminalInput.current.value = '';
        terminalInput.current.value = '';
    }

    return (
        <div className="flex flex-col min-h-screen">
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto dark:bg-zinc-700 dark:text-white flex flex-col p-2">
                <div className="text-2xl font-mono flex flex-row items-center pb-2 border-b border-solid border-orange-600">Task Details:</div>
                <div className="flex flex-col pt-3">
                    <label htmlFor="project_name">Name</label>
                    <input
                        ref={nameInput}
                        onChange={e => setName(e.target.value)}
                        className="rounded border border-solid border-orange-600 bg-transparent h-8"
                        type="text"
                        name="name"
                        id="project_name" />
                </div>
                <div className="flex flex-col pt-3">
                    <label htmlFor="project_description">Description</label>
                    <textarea 
                        ref={descriptionInput}
                        onChange={e => setDescription(e.target.value)}
                        className="rounded border border-solid border-orange-600 bg-transparent h-8"
                        name="description"
                        rows="3"
                        id="project_description"></textarea>
                </div>
                <div className="flex flex-row items-end pt-3">
                    <div className="flex flex-col flex-auto">
                        <label htmlFor="project_name">Starting State</label>
                        <select
                            onChange={e => setState(e.target.value)}
                            className="rounded border border-solid border-orange-600 bg-transparent h-8">
                            {
                                props.availableStates &&
                                props.availableStates.map((cur) => 
                                    <option key={cur.label+'_'+cur.terminal} value={cur.id}>{cur.label}</option>
                                )
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className="dark:bg-zinc-700 p-2 flex flex-row items-center justify-between border-t border-solid border-orange-600">
                <button onClick={() => reset()} className="text-xl p-2 border border-solid border-zinc-300 text-black dark:text-white rounded">Reset</button>
                <button onClick={() => save()} className="text-xl p-2 border border-solid border-orange-600 text-black dark:text-white rounded">Save</button>
            </div>
        </div>
    );
}

export async function getServerSideProps({ req, query}) {
    // This code is run on the server, so it does not have access to the browser memory session
    // In order to get anything back, we need to scrape the user's JWT and apply it to this call
    supabase.auth.session = supabaseCaptureSSRCookie(req);

    // Grab all the projects
    let { data: projects, error } = await supabase
        .from('projects')
        .select('id, states!states_project_id_fkey(*)')
        .eq('id', query.project_id);
        
    if (error) throw error;

    console.log(projects);

    return {
        props: {
            availableStates: [...projects[0].states],
            projectId: query.project_id,
        },
    }
}