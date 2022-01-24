import React, { useState, useEffect } from "react";
import * as Tooltip from '@radix-ui/react-tooltip';

export default function HelpText(props) {
    const [open, setOpen] = useState(false);
    
    return (
        <Tooltip.Provider>
            <Tooltip.Root modal={true} open={open}>
                <Tooltip.Trigger asChild>
                    <button onClick={() => setOpen(true)} className="rounded-full border border-solid border-stone-400 w-8 h-8 text-xl flex flex-row justify-center items-center text-stone-400">&#63;</button>
                </Tooltip.Trigger>
                <Tooltip.Content className="rounded bg-white border border-solid border-black py-[10px] px-[15px] shadow-lg max-w-[300px]">
                    <Tooltip.Arrow />
                    <p>{ props.description }</p>
                    <div className="flex flex-row justify-end">
                        <button onClick={() => {setOpen(false)}}>Okay</button>
                    </div>
                </Tooltip.Content>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}