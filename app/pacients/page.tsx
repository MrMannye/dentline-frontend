'use client'

import React from 'react'
import { Pacientes } from '../../src/utils/Mock';
import Link from 'next/link';

import Avatar from '../../src/utils/Avatar';
import { Zoom, Fab } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useTheme } from '@mui/material/styles';

export default function Pacients() {

    const theme = useTheme();

    const listArray: Array<String> = [];
    const addtoArray = (letter: string): string => {
        if (!listArray.includes(letter)) {
            listArray.push(letter);
            return letter;
        } else {
            return "";
        }
    }

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    return (
        <div className='px-4 space-y-4 w-full flex-1'>
            {Pacientes.map((paciente) => {
                return (
                    <div key={paciente.id} className="flex items-center space-x-4">
                        <span className='text-3xl font-normal text-acent-color w-5'>{addtoArray(paciente.nombre.charAt(0))}</span>
                        <Link href={`/pacients/${paciente.nombre}`} className="flex items-center space-x-4">
                            <Avatar image={paciente.img} />
                            <span className='text-base'>{paciente.nombre}</span>
                        </Link>
                    </div>
                )
            })}
            <div className='fixed right-7 bottom-32'>
                <Fab aria-label="add" size='large' color='primary'>
                    <PersonAddIcon className='text-white' />
                </Fab>
            </div>
        </div>
    )   
}
