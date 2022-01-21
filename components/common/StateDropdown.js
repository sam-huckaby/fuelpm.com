import React, { useState, useEffect } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { textColorChoice } from "../../utils/helpers";

// Props should include:
// props.taskState - the state currently assigned to the task
// props.projectStates - the states that are available in the current project
// props.allowTerminal - whether or not this task has the ability to move into a terminal state
// props.updater - function to update the parent
export default function StateDropdown(props) {
    const [current, setCurrent] = useState({});

    // A proper state object is formatted as follows
    // {
    //     id: 1234, <- Unique identifier for a state
    //     project_id: 5678, <- Identifies which project the state belongs to
    //     label: 'To Do', <- Text label for this state
    //     color: '#FF00BB', <- Color associated with this state
    //     terminal: false, <- whether this state is the "end of the line" for a task
    // }

    useEffect(() => {
        setCurrent(props.taskState);
    }, []);

    function updateState(state) {
        // Do not allow terminal states to be selected when they are disabled
        if (!props.allowTerminal && state.terminal) {
            return false;
        }

        setCurrent(state);
        props.updater(state.id);
    }

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button style={{backgroundColor: current.color, color: textColorChoice(current.color)}} className="p-2 border-solid border border-stone-400 rounded flex flex-row items-center">{ current.label } <span className="ml-2 inline-block w-2 h-2 rotate-45 border-r border-b border-black border-solid">&nbsp;</span></button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="right-0 py-2 mt-2 bg-white rounded-md shadow-2xl w-44 border border-solid border-stone-700">
                    {
                        props.projectStates &&
                        props.projectStates.map((cur, index) => 
                            <DropdownMenu.Item
                                key={cur.id}
                                onClick={() => updateState(cur)}
                                disabled={(!props.allowTerminal && cur.terminal)}
                                style={{backgroundColor: cur.color, color: textColorChoice(cur.color)}}
                                className={((!props.allowTerminal && cur.terminal)? 'hidden' : 'block') + ` px-4 py-2 cursor-pointer hover:bg-stone-200`}>
                                {cur.label}
                            </DropdownMenu.Item>
                        )
                    }
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </>
    );
}