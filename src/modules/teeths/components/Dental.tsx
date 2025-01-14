/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { Teeth } from '../utils/Teeth';
import { useRouter } from 'next/navigation';
import { usePatient } from '../../patients/context/PatientContext';

export default function Dental() {
	const [selectedTeeth, setSelectedTeeth] = useState<string[]>([]);
	const router = useRouter();
	const { patient, setPatient } = usePatient();
	const [saveDataTeeth, setSaveDataTeeth] = useState<boolean>(false);

	const handleSelectTooth = (tooth: string): void => {
		if (selectedTeeth.includes(tooth)) {
			setSelectedTeeth(selectedTeeth.filter(toothF => toothF !== tooth));
		} else {
			setSelectedTeeth([...selectedTeeth, tooth]);
		}
	};

	const isSelected = (tooth: string) => selectedTeeth.includes(tooth);

	const saveData = () => {
		setPatient({ ...patient, teeths: selectedTeeth });
		setSaveDataTeeth(true);
		setTimeout(() => {
			router.push("/consult/treatments");
		}, 3000);
	};

	const isChild = patient?.edad !== undefined && patient.edad <= 12;

	return (
		<div className="w-full relative flex-1 flex flex-col items-center bg-gradient-to-b from-blue-900 to-blue-800">
			{saveDataTeeth && (
				<div className="absolute w-full top-0 left-0 h-full grid place-content-center bg-primary-color bg-opacity-90 z-40">
					<img src="/logo.svg" className="animate-pulse -mt-32" alt="Logo Principal" />
				</div>
			)}

			{/* Información del paciente */}
			<div className="bg-white shadow-lg rounded-lg p-4 mt-4 flex items-center space-x-6 w-full max-w-sm">
				<img
					src="/img/home_image.png"
					alt="Patient Avatar"
					className="w-16 h-16 rounded-full border-2 border-blue-500"
				/>
				<div>
					<h2 className="text-xl font-semibold text-blue-900">{patient?.nombre_paciente || "Paciente"}</h2>
					<p className="text-gray-600">Edad: {patient?.edad || "N/A"} años</p>
					<p className="text-gray-500">{isChild ? "Dentadura de niño" : "Dentadura de adulto"}</p>
				</div>
			</div>

			{/* Título */}
			<div className="p-4 w-full max-w-[400px] mt-3">
				<p className="text-center text-white font-bold text-xl uppercase mb-2">{isChild ? "Niño" : "Adulto"}</p>

				{/* Dientes adulto o niño */}
				{(isChild ? Teeth[1].teeth : Teeth[0].teeth).map(tooth => (
					<div key={tooth.number} className={`${!tooth.visible && "hidden"} flex flex-col items-center relative w-full -ml-6`}>
						<p className={`num-teeth-${tooth.number} ${isSelected(tooth.number.toString()) ? 'text-orange-500' : 'text-white'}`}>
							{tooth.number}
						</p>
						<img
							onClick={() => handleSelectTooth(tooth.number.toString())}
							src={`/img/sheet/p${tooth.number}.svg`}
							className={`D-${tooth.number} tooth ${isSelected(tooth.number.toString()) ? 'selected-tooth' : ''}`}
							alt={`D-${tooth.number}`}
						/>
					</div>
				))}
			</div>

			<button
				onClick={saveData}
				className="h-12 mt-[520px] mx-4 self-center w-11/12 rounded-xl text-secundary-normal bg-primary-pressed shadow-xl text-center disabled:bg-primary-disable"
			>
				GUARDAR
			</button>
		</div>
	);
}
