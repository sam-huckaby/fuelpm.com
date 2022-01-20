import React from "react";
import * as AlertDialog from '@radix-ui/react-alert-dialog';

export default function Alert(props) {
    return (
        <AlertDialog.Root>
            <AlertDialog.Portal>
                <AlertDialog.Overlay />
                <AlertDialog.Content>
                    <AlertDialog.Title>HELP</AlertDialog.Title>
                    <AlertDialog.Description>SOME DESCRIPTION</AlertDialog.Description>
                    <AlertDialog.Cancel asChild>
                        <button>CANCEL</button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChlid>
                        <button>ACTION</button>
                    </AlertDialog.Action>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}