import React, { useState, useRef } from "react";

import AuthGuard from '../../../components/auth/authGuard.component';
import FloatingHeader from '../../../components/common/floatingHeader.component';

export default function CreateProject() {
    // State values
    const [name, setName] = useState("");
    const [deadline, setDeadline] = useState(new Date());
    const [nonTerminals, setNonTerminals] = useState([]);
    const [terminals, setTerminals] = useState([]);

    // References
    const nonTerminalInput = useRef(null);
    const terminalInput = useRef(null);

    function handleNonTerminalEnter(e) {
        if (e.key === 'Enter') {
            addNonTerminal();
        }
    }
    
    function addNonTerminal() {
        // Add new status, but prevent duplicates
        setNonTerminals([...nonTerminals.filter((cur) => (cur.label !== nonTerminalInput.current.value)), {label:nonTerminalInput.current.value, color:'#CCCCCC', terminal:false}]);
        nonTerminalInput.current.value = '';
    }

    function removeNonTerminal(label) {
        setNonTerminals([...nonTerminals.filter((cur) => (cur.label !== label))]);
    }

    function handleTerminalEnter(e) {
        if (e.key === 'Enter') {
            addTerminal();
        }
    }

    function addTerminal() {
        // Add new status, but prevent duplicates
        setTerminals([...terminals.filter((cur) => (cur.label !== terminalInput.current.value)), {label:terminalInput.current.value, color:'#CCCCCC', terminal:true}]);
        terminalInput.current.value = '';
    }

    function removeTerminal(label) {
        setTerminals([...terminals.filter((cur) => (cur.label !== label))]);
    }

    function save() {
        console.log(name);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto dark:bg-zinc-700 dark:text-white flex flex-col p-2">
                <div className="text-2xl font-mono flex flex-row items-center pb-2 border-b border-solid border-orange-600">Project Details:</div>
                <div className="flex flex-col pt-3">
                    <label htmlFor="project_name">Name</label>
                    <input
                        onChange={e => setName(e.target.value)}
                        className="rounded border border-solid border-orange-600 bg-transparent h-8"
                        type="text"
                        name="name"
                        id="project_name" />
                </div>
                <div className="flex flex-col pt-3">
                    <label htmlFor="project_deadline">Deadline</label>
                    <input
                        onChange={e => setDeadline(e.target.value)}
                        className="rounded border border-solid border-orange-600 bg-transparent h-8"
                        type="date"
                        name="deadline"
                        id="project_deadline" />
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
                    {nonTerminals && (
                        <>
                            {
                                nonTerminals.map(item =>
                                    <div key={item.label} id={item.label+'_nonterminal_status'} className="inline-block flex flex-row justify-start items-center min-w-[75px] rounded bg-zinc-500 mr-4 mt-3">
                                        <input className="h-[25px] w-[20px] bg-transparent" type="color" defaultValue={item.color} />
                                        <label htmlFor={item.label+'_nonterminal_status'} className="text-white flex-auto flex flex-row justify-center items-center">{item.label}</label>
                                        <button onClick={() => removeNonTerminal(item.label)} className="h-4 w-4 text-base flex flex-row justify-center items-center ml-2">X</button>
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
                    {terminals && (
                        <>
                        {
                            terminals.map(item =>
                                <div key={item.label} id={item.label+'_terminal_status'} className="inline-block flex flex-row justify-start items-center min-w-[75px] rounded bg-zinc-500 mr-4 mt-3">
                                    <input className="h-[25px] w-[20px] bg-transparent" type="color" defaultValue={item.color} />
                                    <label htmlFor={item.label+'_terminal_status'} className="text-white flex-auto">{item.label}</label>
                                    <button onClick={() => removeTerminal(item.label)} className="h-4 w-4 text-base flex flex-row justify-center items-center">X</button>
                                </div>
                            )
                        }
                    </>
                    )}
                </div>
            </div>
            <div className="dark:bg-zinc-700 p-2 flex flex-row items-center justify-between border-t border-solid border-orange-600">
                <button className="text-xl p-2 border border-solid border-zinc-300 text-black dark:text-white rounded">Reset</button>
                <button onClick={() => save()} className="text-xl p-2 border border-solid border-orange-600 text-black dark:text-white rounded">Save</button>
            </div>
        </div>
    );
}