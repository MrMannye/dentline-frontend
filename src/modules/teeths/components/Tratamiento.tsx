import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Tratamientos } from '../utils/InputsTratamiento'
import React, { useState } from 'react'
import ConsultDialog from '../../../utils/ConsultDialog';

export default function Tratamiento() {
  
  const [openModal, setOpenModal] = useState(false);
  const [dentalDisable, setDentalDisable] = useState(true);
  const [saveData, setSaveData] = useState(true);
  const description = "Hacer cita ¿Estás seguro de que quieres agendar la cita?";

  
  return (
    <div className='flex-1 w-full p-4'>
      { openModal && <ConsultDialog setDentalDisable={setDentalDisable} setSaveData={setSaveData} description={description} title={"Hacer cita"}/>}
      <h1 className='text-acent-color tracking-wide font-semibold text-lg'>Piezas dentales y tratamientos</h1>
      <div className='space-y-3 mt-6'>
        {[1, 2, 3].map((tooth) => {
          return (
            <div key={tooth} className='flex items-center'>
              <h3 className='text-xl p-2 font-semibold rounded-l-lg text-white bg-primary-500'>15</h3>
              <FormControl size='small' fullWidth style={{ padding: 0, margin: 0 }}>
                <InputLabel id="tratamiento">Selecciona Tratamiento</InputLabel>
                <Select
                  labelId="tratamiento"
                  id="demo-simple-select"
                  // value={age}
                  label="Tratamiento"
                  className='p-[2px] rounded-none rounded-r-lg'
                // onChange={handleChange}
                >
                  {
                    Tratamientos.map(tratamiento => {
                      return (
                        <MenuItem key={tratamiento.id} value={tratamiento.tratamiento}>{tratamiento.tratamiento}</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>
            </div>
          )
        })}
        
      </div>
      <TextField
          id="standard-multiline-static"
          multiline
          className='w-full mt-16'
          rows={8}
          defaultValue="Ingrese observaciones"
          variant="outlined"
        />
            <input type="button" onClick={() => setOpenModal(!openModal)} value={"GUARDAR"} className="h-12 w-full mt-8 self-center rounded-xl text-secundary-normal bg-primary-pressed shadow-xl text-center disabled:bg-primary-disable" />  

    </div>
  )
}
