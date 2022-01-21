import React, { useState, useEffect } from "react";
import * as Tooltip from '@radix-ui/react-tooltip';

export default function HelpText(props) {
    
    return (
        <Tooltip.Provider>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <span className="text-stone-400">{ props.text }</span>
                </Tooltip.Trigger>
                <Tooltip.Content className="rounded bg-white border border-solid border-black py-[10px] px-[15px] shadow-lg max-w-[300px]">
                    <Tooltip.Arrow />
                    <span>{ props.description }</span>
                </Tooltip.Content>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}