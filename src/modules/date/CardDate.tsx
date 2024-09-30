import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import Link from 'next/link'

export default function CardDate() {
  return (
      <Link href={`pacients/payment/${"Miguel Aguilera"}`} className='rounded-xl flex flex-col'>
        <span className='bg-acent-color text-white text-center rounded-t-xl tracking-wide'>Miguel Aguilera</span>
          <div className='text-xs mx-4 my-2 flex flex-col space-y-[3px]'>
            <h3 className='font-bold text-gray-700'>Costo: <span className='font-normal text-gray-400'>$2500.00</span></h3>
              <h3 className='font-bold text-gray-700'>Fecha: <span className='font-normal text-gray-400'>12 de enero de 2022</span></h3>
                Por lo menos la mitad de la superficie del diente está destruida por la caries, y la pulpa 
                puede estar afectada.
            </div>
              <div className='bg-primary-200 w-full flex items-center justify-around rounded-b-xl p-1'>
                <CalendarMonthIcon className='text-primary-color mx-3 text-base'/>
                <DeleteIcon className='text-primary-color mx-3 text-base'/>
              </div>
      </Link>
  )
}
