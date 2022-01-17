import React, { useState, useEffect } from "react";

export default function Dropdown(props) {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {}, []);

    return (
        <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 border-solid border border-stone-400 rounded">{props.title}</button>
            <div onClick={() => setMenuOpen(false)} className={((menuOpen)? 'fixed' : 'hidden') + ` top-0 right-0 bottom-0 left-0 bg-stone-600/50 z-[10]`}></div>
            <div className={((menuOpen)? 'absolute' : 'hidden') + ` right-0 py-2 mt-2 bg-white rounded-md shadow-xl w-44 z-[11]`}>
                {
                    props.items &&
                    props.items.map((cur, index) => 
                        <a key={index} onClick={() => { cur.onClick(); setMenuOpen(false); }} className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-400 ` + cur.classes}>
                            {cur.label}
                        </a>
                    )
                }
            </div>
        </div>
    );
}