import DeleteIcon from '@mui/icons-material/Delete';

export default function CardDate() {
  return (
      <div className='rounded-xl flex flex-col'>
        <span className='bg-acent-color text-white text-center rounded-t-xl'>{"Enero 12 de 2022 - 10:45 AM"}</span>
          <div className='text-xs mx-4 my-2 text-gray-400 flex flex-col'>
            <h2 className='uppercase font-bold text-gray-700 mb-1'>Procedimientos:</h2>
            <span>15 - Endodoncia</span>
            <span>27, 31 - Aplicacion de Amalgama</span>
          </div>
          <hr />
          <div className='text-xs mx-4 my-2 flex flex-col space-y-[3px]'>
            <h3 className='font-bold text-gray-700'>Costo: <span className='font-normal text-gray-400'>$2500.00</span></h3>
            <h3 className='font-bold text-gray-700'>Notas: <span className='font-normal text-gray-400'>
              <h3 className='font-bold text-gray-700'>Fecha: <span className='font-normal text-gray-400'>12 de enero de 2022</span></h3>
                Por lo menos la mitad de la superficie del diente está destruida por la caries, y la pulpa 
                puede estar afectada.
            </span>
            </h3>
            </div>
              <div className='bg-primary-200 w-full flex flex-row-reverse rounded-b-xl p-1'>
                <DeleteIcon className='text-primary-color mx-3 text-base'/>
              </div>
      </div>
  )
}
