import React, { useState } from "react";

import AuthGuard from '../../../components/auth/authGuard.component';
import FloatingHeader from '../../../components/common/floatingHeader.component';

export default function CreateProject() {
    const [name, setName] = useState("");

    function save() {
        console.log(name);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <AuthGuard></AuthGuard>
            <FloatingHeader></FloatingHeader>
            <div className="flex-auto dark:bg-zinc-700 text-white flex flex-col p-2">
                <div className="text-2xl text-orange-600 font-mono flex flex-row items-center pb-2 border-b border-solid border-orange-600">Project Details:</div>
                <div className="flex flex-col">
                    <label htmlFor="project_name">Name</label>
                    <input
                        onChange={e => setName(e.target.value)}
                        className="rounded border border-solid border-orange-600 bg-transparent"
                        type="text"
                        name="name"
                        id="project_name" />
                </div>
            </div>
            <div className="dark:bg-zinc-700 p-2 flex flex-row items-center justify-between border-t border-solid border-orange-600">
                <button className="text-xl p-2 border border-solid border-zinc-300 text-black dark:text-white rounded">Reset</button>
                <button onClick={() => save()} className="text-xl p-2 border border-solid border-orange-600 text-black dark:text-white rounded">Save</button>
            </div>
        </div>
    );
}