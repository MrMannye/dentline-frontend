import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Chip, Divider } from '@mui/material';

import TabTarjeta from './components/TabTarjeta'
import TabEfectivo from './components/TabEfectivo';
import TabMetamask from './components/TabMetamask';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useWallet } from '../auth/context/WalletContext';
import { crearCita } from '../contracts/contrato';

const PAGO_TOTAL = 'Se realizó el pago completo';
const PAGO_PARCIAL = 'Se realizó el pago parcial';
const ABONO_EXCEDIDO = 'El abono no puede exceder el costo total';


const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CustomizedDialogs(params: any) {

	const [value, setValue] = useState(0);
	const [message, setMessage] = useState('')
	const [openAlert, setOpenAlert] = useState(false);
	const router = useRouter();
	const { dentist } = useWallet()

	const handleChange = (event: React.SyntheticEvent, tabIndex: number) => {
		setValue(tabIndex);
	};
	const handleCloseAbono = () => {
		const historial = {
			idPaciente: params.id_paciente,
			nombrePaciente: params.nombre,
			profesionPaciente: params.profesion,
			edadPaciente: params.edad,
			tipoSangre: params.tipo_sangre,
			alergias: params.alergias,
			nombreDentista: dentist?.nombre || "",
			telefonoDentista: dentist?.telefono || "",
			fecha: params.fecha_cita,  // Asegúrate de que sea un número entero, probablemente el timestamp
			motivo: params.motivo,
			costoTotal: params.costo_total,  // Esto parece ser un valor numérico (puede ser un monto en alguna moneda o unidad)
			observaciones: params.observaciones,
		}
		if (message === PAGO_TOTAL) {
			crearCita(historial)
			router.push('/dates')
		}
		if (message === PAGO_PARCIAL) {
			crearCita(historial)
			params.setOpen(false)
		}
		if (message === ABONO_EXCEDIDO) params.setOpen(false)
		setOpenAlert(false)
	};
	const handleClose = () => {
		params.setOpen(false);
	}
	const handleAbono = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault()
		setOpenAlert(true)
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API}/dates/updateAbono`, {
				method: "PUT", // Método HTTP
				headers: {
					"Content-Type": "application/json", // Especifica que estás enviando JSON
				},
				body: JSON.stringify({
					id_cita: params.idCita, // ID de la cita
					abono: params.abonado, // Nuevo valor del abono
				}),
			});

			if (!response.ok) {
				throw new Error("Error al actualizar el abono");
			}

			const { data } = await response.json();
			if (data.message.isAbonoEqualCosto) setMessage(PAGO_TOTAL);
			else setMessage(PAGO_PARCIAL);
		} catch (error) {
			console.error("Error:", error);
			if (error instanceof Error) {
				setMessage(ABONO_EXCEDIDO);
			} else {
				alert("Ocurrió un error");
			}
		}
	}

	return (
		<Dialog
			onClose={handleClose}
			maxWidth='xs'
			aria-labelledby="customized-dialog-title"
			open={params.open}
		>
			<DialogTitle className='flex justify-between items-center' id="customized-dialog-title">
				Metodo de Pago
				<IconButton
					aria-label="close"
					onClick={handleClose}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="secondary tabs example"
				>
					<Tab label="Efectivo" />
					<Tab label="Tarjeta" />
					<Tab label="Metamask" />
				</Tabs>
				<div className='p-2 flex flex-col items-center'>
					{value === 0 && <TabEfectivo />}
					{value === 1 && <TabTarjeta abonado={params.abonado} />}
					{value === 2 && <TabMetamask />}
					<span>Dentista: {dentist?.nombre}</span>
					<span>Paciente: Francisco Arturo</span>
					<strong>Pago: ${params.abonado} MXN</strong>
				</div>
			</DialogContent>
			<DialogActions className='p-4'>
				<Button autoFocus onClick={(e) => handleAbono(e)}>
					Abonar
				</Button>
			</DialogActions>
			<Dialog
				open={openAlert}
				fullScreen
				TransitionComponent={Transition}
				keepMounted
				onClose={handleCloseAbono}
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle className='!font-bold text-center bg-green-400'>{message}</DialogTitle>
				<DialogContent className='mt-2'>
					<div className='text-center'>
						<p className=''>{message} de la cita {params.idCita}</p>
						<p className=''> Se ha realizado el pago de ${params.abonado} MXN </p>
					</div>

					<Divider className='!my-4'>
						<Chip label="Dentista" size="small" />
					</Divider>
					<p><strong>Dentista: </strong>{dentist?.nombre}</p>
					<p><strong>Especilizacion: </strong>{dentist?.especializacion}</p>
					<p><strong>Cuenta: </strong>{dentist?.cuenta_clabe}</p>
					<Divider className='!my-4'>
						<Chip label="Paciente" size="small" />
					</Divider>
					<p><strong>Paciente: </strong>{params?.nombre}</p>
					<p><strong>Total: </strong>{params?.costo_total}</p>
					<p><strong>Abono: </strong>{params?.abono}</p>
					<p><strong>Abonado: </strong>{params?.abonado}</p>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseAbono}>Continuar</Button>
				</DialogActions>
			</Dialog>
		</Dialog>
	);
}
