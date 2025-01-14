'use client'

import { useState, useEffect } from 'react';
import { Avatar, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material';
import { useRouter } from 'next/navigation';

import { consultaInputs } from '../../../src/utils/consult/form-registro';
import { useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
// import ConsultDialog from '../../../src/utils/ConsultDialog';
import { usePatient } from '@/src/modules/patients/context/PatientContext';

interface VitalSignsForm {
	peso: string;
	alergias: string;
	tipo_sangre: string;
	pulso: string;
	presion: string;
	antecedentes_medicos: string;
}

export default function Consult() {
	const router = useRouter();
	const { register, reset, formState: { errors }, handleSubmit, watch } = useForm<VitalSignsForm>();
	const [saveData, setSaveData] = useState(true);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [dentalDisable, setDentalDisable] = useState(true);
	// const [openModal, setOpenModal] = useState(false);
	const { patient } = usePatient();

	const [initialValues, setInitialValues] = useState<VitalSignsForm>({
		peso: "",
		alergias: "",
		tipo_sangre: "",
		pulso: "",
		presion: "",
		antecedentes_medicos: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/vitalSigns/${patient?.id_paciente}`);
			const { data } = await response.json();
			const pacientDataSV = data[0];
			if (pacientDataSV) {
				const values: VitalSignsForm = {
					peso: pacientDataSV.peso || "",
					alergias: pacientDataSV.alergias || "",
					tipo_sangre: pacientDataSV.tipo_sangre || "",
					pulso: pacientDataSV.pulso || "",
					presion: pacientDataSV.presion || "",
					antecedentes_medicos: pacientDataSV.antecedentes_medicos || "",
				};
				reset(values);
				setInitialValues(values);
			}
		};
		fetchData();
	}, [patient, reset]);

	const handleSaveData = async (formData: VitalSignsForm) => {
		console.log("Formulario válido, datos enviados:", formData);
		await fetch(`${process.env.NEXT_PUBLIC_API}/pacients/updateVitalSigns`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...formData,
				id_paciente: patient?.id_paciente,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setInitialValues(formData);
			})
			.catch((error) => console.log(error));
		setSaveData(true);
	};

	const formValues = watch();

	useEffect(() => {
		console.log('prueba');
		const allFieldsFilled = Object.values(formValues).every((value) => {
			// Convertir a string si es necesario y verificar que no esté vacío
			return typeof value === "string" ? value.trim() !== "" : value !== undefined && value !== null;
		});

		const valuesChanged = Object.keys(formValues).some(
			(key) => formValues[key as keyof VitalSignsForm] !== initialValues[key as keyof VitalSignsForm]
		);

		if (allFieldsFilled && valuesChanged) {
			setSaveData(false);
		} else {
			setSaveData(true);
		}
	}, [formValues, initialValues]);


	return (
		<div className="w-full flex-1">
			<div className="bg-secundary-color h-16 mb-12 flex items-center px-4 space-x-2">
				<Avatar className="mt-10" sx={{ width: 82, height: 82 }} src={"/img/home_image.png"} alt="User Image" />
				<h2 className="text-xl text-primary-color">{patient?.nombre_paciente}</h2>
			</div>
			<div className="px-4 flex flex-col items-start">
				<h3 className="text-xl font-bold text-acent-color">Signos Vitales</h3>
				<form className="w-full" onSubmit={handleSubmit(handleSaveData)}>
					{consultaInputs.map((input) => (
						<FormControl key={input.name} sx={{ marginY: 0.8, marginX: 1 }} className="w-full" variant="standard">
							<InputLabel shrink htmlFor={`standard-adornment-${input.name}`}>{input.name}</InputLabel>
							<Input
								id={`standard-adornment-${input.name}`}
								type="text"
								{...register(input.register as keyof VitalSignsForm, input.validation)}
								endAdornment={
									<InputAdornment position="end">
										<IconButton aria-label="Editable Input">
											<EditIcon />
										</IconButton>
									</InputAdornment>
								}
							/>
							{errors[input.register as keyof VitalSignsForm] && (
								<span className="text-red-500 text-sm">{errors[input.register as keyof VitalSignsForm]?.message}</span>
							)}
						</FormControl>
					))}

					<div className="flex flex-col items-center mt-2 space-y-5 w-full">
						<button type="submit" disabled={saveData} className="h-12 w-full rounded-xl text-secundary-normal bg-primary-pressed shadow-xl text-center disabled:bg-primary-disable">
							GUARDAR
						</button>
						<button type="button" onClick={() => router.push("/consult/sheet")} className="h-12 w-full rounded-xl border border-1 border-primary-pressed bg-secundary-normal text-primary-pressed text-center disabled:border-0 disabled:bg-white disabled:text-primary-disable">
							INGRESAR FICHA DENTAL
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
