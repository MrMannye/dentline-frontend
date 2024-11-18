'use client'

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/navigation';

export default function ConsultDialog(props: { description: string, title: string, setDentalDisable: any, setSaveData: any }) {
    const [open, setOpen] = React.useState(true);
    const router = useRouter();

    const handleClose = () => {
        props.setDentalDisable(false);
        props.setSaveData(true);
        setOpen(false);
    };

    const handleAccept = () => {
        props.setDentalDisable(false);
        props.setSaveData(true);
        router.push("/date");
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleAccept} autoFocus>
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
}