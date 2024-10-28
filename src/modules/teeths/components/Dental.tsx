/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { Teeth } from '../utils/Teeth';
import { useRouter } from 'next/navigation';

export default function Dental() {
	const [selectedTeeth, setSelectedTeeth] = useState<string[]>([]);
	const router = useRouter();
	const [saveDataTeeth, setSaveDataTeeth] = useState<boolean>(false);
	const handleSelectTooth = (tooth: string): void => {
		if (selectedTeeth.includes(tooth)) setSelectedTeeth(selectedTeeth.filter(toothF => toothF !== tooth));
		else setSelectedTeeth([...selectedTeeth, tooth]);
		console.log(selectedTeeth);
	}
	const isSelected = (tooth: string) => {
		return selectedTeeth.includes(tooth) ? true : false
	}

	const saveData = () => {
		setSaveDataTeeth(true);
		setTimeout(() => {
			router.push("/consult/treatments")
		}, 5000)
	}

	return (
		<div className="w-full relative flex flex-col items-center flex-1 bg-[#323F4B] ">
			{/* <h1 className='text-white px-4 pt-4'>Seleccionar</h1> */}
			{saveDataTeeth &&
				<div className='absolute top-0 left-0 w-full grid place-content-center h-full bg-primary-color bg-opacity-90 z-40'>
					<img src="/logo.svg" className='animate-pulse -mt-32' alt="Logo Principal" />
				</div>
			}
			<div className="relative p-4 w-full ml-2 mt-10 lg:mt-0 lg:ml-7">
				{/* <div className=''> */}
				<p className="adult-title title">Adulto</p>
				<p className="child-title title">Niño</p>
				{/* DIENTES ADULTO */}
				{Teeth[0].teeth.map(tooth => {
					return (
						<div key={tooth.number} className={`${!tooth.visible && "hidden"}`}>
							<p className={`num-teeth-${tooth.number} num-teeth ${isSelected(tooth.number.toString()) ? '!text-acent-color' : 'text-black'} `}>{tooth.number}</p>
							<img onClick={() => handleSelectTooth(tooth.number.toString())} src={`/img/sheet/p${tooth.number}.svg`} className={`D-${tooth.number} filter saturate-100`} alt={`D-${tooth.number}`} />
						</div>
					)
				})}
				{/* DIENTES NIÑO */}
				{Teeth[1].teeth.map(tooth => {
					return (
						<div key={tooth.number} className={`${!tooth.visible && "hidden"}`}>
							<p className={`num-teeth-${tooth.number} ${isSelected(tooth.number.toString()) ? '!text-acent-color' : 'text-black'} num-teeth`}>{tooth.number}</p>
							<img onClick={() => handleSelectTooth(tooth.number.toString())} src={`/img/sheet/p${tooth.number}.svg`} className={`D-${tooth.number}`} alt="dent_18" />
						</div>
					)
				})}
				{/* </div> */}
			</div>
			<input type="button" onClick={() => saveData()} value={"GUARDAR"} className="h-12 mt-[520px] mx-4 self-center w-11/12 rounded-xl text-secundary-normal bg-primary-pressed shadow-xl text-center disabled:bg-primary-disable" />
		</div>
	)
}