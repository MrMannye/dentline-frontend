import React from 'react'
import Avatar from '../../../utils/Avatar'


import Link from 'next/link'

function CardDate(props: { nombre_paciente: string, ocupation: string, date: string, id_cita: number }) {
	return (
		<Link href={`/pacients/payment/${props.nombre_paciente}_${props.id_cita}`}>
			<div className='flex justify-around items-center h-[72px] rounded-xl bg-primary-100 mb-4'>
				<Avatar image={"/img/home_image.png"} />
				<div className='flex flex-col items-center text-gray-600'>
					<span className='font-bold text-base'>{props.nombre_paciente}</span>
					<span className='text-base font-normal'>{props.ocupation}</span>
				</div>
				<h3 className='text-xl font-bold text-gray-600'>{props.date}</h3>
			</div>
		</Link>
	)
}

export default CardDate