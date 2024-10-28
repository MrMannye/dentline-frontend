interface DatePacientRecap{
	motivo: string,
  costo_total: number,
  fecha_cita: string,
  abono: number,
  observaciones: string
}

function cambiarFormatoFecha(fecha:  string){
  const [año, mes, dia] = fecha.split('-');
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const mesNombre = nombresMeses[parseInt(mes, 10) - 1];

  return `${dia} de ${mesNombre} del ${año}`;
}

function CardPayment({motivo, costo_total, fecha_cita, abono,  observaciones}: DatePacientRecap) {
	return (
		<div className='rounded-xl flex flex-col m-4 mt-8 border'>
			<span className='bg-acent-color text-white text-center rounded-t-xl'>{cambiarFormatoFecha(String(fecha_cita?.split("T",1)[0]))} - {fecha_cita?.split("T",2)[1].split("",5)} horas</span>
			<div className='text-xs mx-4 my-2 text-gray-400 flex flex-col'>
				<h2 className='uppercase font-bold text-gray-700 mb-1'>Procedimientos:</h2>
				{motivo?.split("_").map((procedimiento) => {
					return <span key={procedimiento}>{procedimiento}</span>
				})}
			</div>
			<hr />
			<div className='text-xs mx-4 my-2 flex flex-col space-y-[3px] p-2'>
				<h3 className='font-bold text-gray-700'>Costo: <span className='font-normal text-gray-400'>${costo_total}</span></h3>
				<h3 className='font-bold text-gray-700'>Abonado: <span className='font-normal text-gray-400'>${abono}</span></h3>
				<h3 className='font-bold text-gray-700'>Fecha: <span className='font-normal text-gray-400'>{fecha_cita?.split("T",1)}</span></h3>
				<h3 className='font-bold text-gray-700'>Notas: <span className='font-normal text-gray-400'>
					{observaciones}
				</span>
				</h3>
			</div>
		</div>
	)
}

export default CardPayment