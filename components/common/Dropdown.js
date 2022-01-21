import React, { useState } from "react";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

export default function Dropdown(props) {
    const [alertOpen, setAlertOpen] = useState(false);
    const [confirmDetails, setConfirmDetails] = useState({});

    function useConfirm(menuItem) {
        menuItem.confirm.action = () => {
            menuItem.onClick();
            setAlertOpen(false);
        }
        setConfirmDetails(menuItem.confirm);

        // Open the confirmation dialog
        setAlertOpen(true);
    }

    // A proper menu item is formatted as follows
    // {
    //     label: 'Menu Item Text',
    //     onClick: methodToCallOnItemClick,
    //     classes: 'additional-classes to-apply',
    //     confirm: {
    //         title: 'Title of the confirmation dialog',
    //         description: 'Confirmation dialog explanatory text',
    //         danger: true, <- Makes the action button red
    //         proceed: 'Text for the action button',
    //         cancel: 'Text for the cancel button'
    //     }
    // }

    return (
        <>
            <AlertDialog.Root open={alertOpen}>
                <AlertDialog.Overlay className="fixed z-10 top-0 right-0 w-full h-full bg-black/25" />
                <AlertDialog.Content className="fixed z-50 top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] rounded p-4 bg-white dark:bg-stone-700 w-[90vw] max-w-[500px] shadow-lg ">
                    <AlertDialog.Title className="font-bold pb-2">{ confirmDetails.title }</AlertDialog.Title>
                    <AlertDialog.Description>{ confirmDetails.description }</AlertDialog.Description>
                    <div className="flex flex-row justify-end mt-2">
                        <AlertDialog.Cancel asChild>
                            <button onClick={() => setAlertOpen(false)}>{ confirmDetails.cancel || 'Cancel' }</button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <button className={((confirmDetails.danger)? 'text-red-800': '') + ` font-bold ml-2 dark:bg-stone-200`} onClick={confirmDetails.action}>{ confirmDetails.proceed || 'Proceed' }</button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Root>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    {
                        (props.type === 'settings')?
                            <button className="p-2 border-solid border border-stone-400 rounded-full w-8 h-8 flex flex-row justify-center items-center">&#8943;</button> :
                            <button className="p-2 border-solid border border-stone-400 rounded">{props.title}</button>
                    }
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="right-0 py-2 mt-2 bg-white dark:bg-stone-700 rounded-md shadow-2xl w-44 border border-solid border-stone-700 dark:border-black">
                    {
                        props.items &&
                        props.items.map((cur, index) => 
                            (cur.separator)?
                                <DropdownMenu.Separator key={index} className="h-[1px] bg-stone-400 my-4 mx-2" /> :
                                <DropdownMenu.Item key={index} onClick={() => { (cur.confirm)? useConfirm(cur) : ((cur.onClick)? cur.onClick() : () => {}) }} className={`px-4 py-2 cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-600 ` + cur.classes}>
                                    {cur.label}
                                </DropdownMenu.Item>
                        )
                    }
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </>
    );
}