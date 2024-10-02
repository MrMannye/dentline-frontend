import { useState } from 'react'
import { Avatar } from '@mui/material'
import ConsultDialog from '../../../utils/ConsultDialog';

export default function TabSummary(props: { setSection: any }) {

  const [date, setDate] = useState(new Date());
  const [saveData, setSaveData] = useState(true);
  const [dentalDisable, setDentalDisable] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const description = "Hacer cita ¿Estás seguro de que quieres agendar la cita?";
  const servicios = [
    {
      id: 4,
      name: "Coronas",
      value: false,
      price: "1,500.00",
      disabled: false,
    },
    {
      id: 5,
      name: "Endodoncia",
      value: false,
      price: "2,500.00",
      disabled: false,
    },
    {
      id: 6,
      name: "Servicio preventivo",
      value: false,
      price: "1,000.00",
      disabled: false,
    }
  ]

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { 
    e.preventDefault()
    setOpenModal(!openModal)
  }

  return (
    <div className='w-full flex flex-col'>
      { openModal && <ConsultDialog setDentalDisable={setDentalDisable} setSaveData={setSaveData} description={description} title={"Hacer cita"}/>}
      <div className='bg-primary-100 h-16 mb-12 flex items-center px-4 space-x-2'>
        <Avatar className='mt-10' sx={{ width: 82, height: 82 }} src={"/img/home_image.png"} alt="User Image" />
        <h2 className='text-2xl text-primary-800'>{"Bailey Richards"}</h2>
      </div>
      <div className='flex px-4 justify-between'>
        <div className='flex flex-col items-start'>
          <h3 className='text-acent-color text-xl font-bold mb-3'>Resumen</h3>
          <span className='text-xs text-gray-400 font-semibold'>FECHA</span>
          <h3 className='text-xl text-gray-600 font-bold'>{date.getDay() + ". Enero"}</h3>
          <span className='text-xs mt-1 text-gray-400 font-semibold'>HORA</span>
          <h3 className='text-xl text-gray-600 font-bold'>{"13:00 - 14:00"}</h3>
        </div>
        <div className='w-[179px] h-[60px] bg-primary-100 rounded-xl mt-2 flex flex-col items-center text-xs p-2 text-gray-400 font-extrabold'>
          <span className='tracking-wider'>COSTO FINAL</span>
          <span className='text-base font-bold'>$8,500.00 - $9,000.00</span>
        </div>
      </div>
      <div className='px-4 mt-9'>
        <span className='text-xs text-gray-400 tracking-wide'>SERVICIOS</span>
        {servicios.map((service) => {
          return (
            <div key={service.id} className="w-[280px] bg-primary-100 tracking-wider p-2 rounded-lg mb-4 flex items-center justify-between text-base">
              <span className='font-bold'>{service.name}</span>
              <span>${service.price}</span>
            </div>
          )
        })}
      </div>
      <button onClick={(e) => handleSubmit(e)} className="h-12 mt-[53px] mx-4 rounded-xl bg-primary-pressed text-white shadow-xl text-center disabled:border-0 disabled:bg-[#FFCD9F] disabled:text-white" >AGENDAR</button>
    </div>
  )
}
