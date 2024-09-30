'use client'

import React from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import Link from 'next/link';

import { Input, InputAdornment, IconButton, FormControl, InputLabel } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';

export default function Pacient({params} : {params: {username: string}}) {

  const { register, getValues, formState: { errors, isValid }, handleSubmit } = useForm();


  useEffect(() => {

  }, [])


  return (
    <div className='w-full flex flex-col flex-1'>
      <div className='flex items-center justify-around w-full bg-secundary-color text-white p-2'>
        <h3 className='text-center'>PERFIL</h3>
        <h3 className='text-center'>DATOS</h3>
        <Link className='' href={`/pacients/historial/${params.username}`}>
          <h3 className='text-center'>HISTORIAL</h3>
        </Link>
      </div>

      <div className='relative bg-primary-color flex flex-col items-center text-white py-8'>
        <Avatar alt="Image Avatar"
          src={"/img/home_image.png"}
          sx={{ width: 82, height: 82 }} />
        <h2 className="text-2xl mt-2">{params.username}</h2>
        <span className='text-sm'>Paciente desde 2012</span>

        <div className='absolute -bottom-5 flex items-center justify-around text-white bg-primary-500 p-2 space-x-5'>
          <div className='flex items-center space-x-1'>
            <LocalPhoneIcon />
            <span>+52 944-4489</span>
          </div>
          <div className='flex items-center space-x-1'>
            <EmailIcon />
            <span>miguel.ipn@gmail.com</span>
          </div>
        </div>
      </div>

      <div className='mt-8 mb-6 mx-4'>
        {[1, 2, 3, 4].map((option) => {
          return (
            <FormControl key={option} sx={{ m: 1 }} className='w-full' variant="standard">
              <InputLabel htmlFor="standard-adornment-password">Dirección</InputLabel>
              <Input
                id="standard-adornment-password"
                type={'text'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                    >
                      <EditIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          )
        })}
      </div>

      <div className='flex items-center justify-around'>
        <Link href={"/date"} className="h-12 w-44 rounded-xl border border-1 border-primary-pressed bg-secundary-normal text-primary-pressed flex items-center justify-center">CITA</Link>
        <Link href={`/consult/${params.username}`} className="h-12 w-44 rounded-xl text-secundary-normal bg-primary-pressed shadow-xl flex items-center justify-center">SIGNOS VITALES</Link>
      </div>

    </div>
  )
}
