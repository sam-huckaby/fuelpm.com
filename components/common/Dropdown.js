import React from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function Dropdown(props) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="p-2 border-solid border border-stone-400 rounded">{props.title}</button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content className="right-0 py-2 mt-2 bg-white rounded-md shadow-2xl w-44 border border-solid border-stone-700">
                {
                    props.items &&
                    props.items.map((cur, index) => 
                        <DropdownMenu.Item key={index} onClick={() => { cur.onClick() }} className={`px-4 py-2 text-sm cursor-pointer hover:bg-stone-200 ` + cur.classes}>
                            {cur.label}
                        </DropdownMenu.Item>
                    )
                }
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}