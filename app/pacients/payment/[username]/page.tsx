'use client'

import { useState } from 'react';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import Avatar from '@mui/material/Avatar';

import PaymentCard from '@/src/modules/payment/PaymentCard'
import { Input, InputAdornment, IconButton, FormControl, InputLabel } from '@mui/material';
import Button from '@mui/material/Button';
import PaymentDialog from '@/src/modules/payment/PaymentDialog';


export default function Payment({params}: {params: {username: string}}) {
  
  const [open, setOpen] = useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  return(
    <div className="flex-1 w-full">
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
      <PaymentCard/>
      <FormControl className='px-8 w-full' variant="standard">
      <InputLabel className='px-8' htmlFor="standard-adornment-password">Abonar</InputLabel>
        <Input
          id="standard-adornment-password"
          type={'number'}
          endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility">
              <button onClick={handleClickOpen} className='text-xs text-acent-color p-2 rounded-md'>Abonar</button>
            </IconButton>
          </InputAdornment>
          }
              />
    </FormControl>
    <PaymentDialog open={open} setOpen={setOpen}/>
    </div>
  )
}