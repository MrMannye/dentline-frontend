import Web3 from "web3";
import contractData from "../../../build/contracts/ClinicaDental.json"; // Ruta al ABI del contrato

const CONTRACT_ADDRESS = "0x67E82c6717c1e526659680d62179173E7467bE20"; // Dirección del contrato    
const abi = contractData.abi; // ABI del contrato

// Instancia de Web3
const getWeb3 = () => {
	if (typeof window.ethereum !== "undefined") {
		return new Web3(window.ethereum);
	} else {
		throw new Error("MetaMask no está instalado. Por favor, instálalo para usar esta aplicación.");
	}
};

// Función para crear una cita
export const crearCita = async (datosCita) => {
	let { idPaciente, nombrePaciente, profesionPaciente, edadPaciente, tipoSangre, alergias,
		nombreDentista, telefonoDentista, fecha, motivo, costoTotal, observaciones } = datosCita;
	try {
		const web3 = getWeb3();
		const contrato = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

		// Obtener la cuenta conectada
		const accounts = await web3.eth.getAccounts();
		if (accounts.length === 0) {
			throw new Error("No hay cuentas conectadas. Por favor, inicia sesión con MetaMask.");
		}

		// Llamada a la función 'agregarCita' con el idPaciente
		const tx = await contrato.methods
			.agregarCita(
				idPaciente,           // El ID del paciente
				nombrePaciente,
				profesionPaciente,
				edadPaciente,
				tipoSangre,
				alergias, // Asegúrate de que 'alergias' sea un arreglo
				nombreDentista,
				telefonoDentista,
				new Date(fecha).getTime() / 1000, // Convierte la fecha a timestamp
				motivo,
				costoTotal.toString(),
				observaciones
			)
			.send({ from: accounts[0] });

		console.log("Cita creada exitosamente:", tx);
		return tx; // Retornar la transacción para su manejo en el frontend
	} catch (error) {
		console.error("Error al crear la cita:", error);
		throw error;
	}
};

export const obtenerCitas = async (idPaciente) => {
	try {
		const web3 = getWeb3();
		const contrato = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

		// Obtener la cuenta conectada
		const accounts = await web3.eth.getAccounts();
		if (accounts.length === 0) {
			throw new Error("No hay cuentas conectadas. Por favor, inicia sesión con MetaMask.");
		}

		// Llamar a la función 'getCitas' para obtener todas las citas
		const citas = await contrato.methods.getCitasDePacienteSinFiltrar(idPaciente).call({ from: accounts[0], gas: 3000000 });

		return citas;
	} catch (error) {
		console.error("Error al obtener las citas:", error);
		throw error;
	}
}


// Función para obtener las citas de un paciente por su ID
export const obtenerCitasPorPaciente = async (idPaciente) => {
	try {
		const web3 = getWeb3();
		const contrato = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

		// Obtener la cuenta conectada
		const accounts = await web3.eth.getAccounts();
		if (accounts.length === 0) {
			throw new Error("No hay cuentas conectadas. Por favor, inicia sesión con MetaMask.");
		}
		// Llamar a la función 'getCitasDePaciente' para obtener las citas filtradas por dentista
		console.log(accounts[0]);
		const citas = await contrato.methods.getCitasDePaciente(idPaciente).call({ from: accounts[0], gas: 3000000 });
		console.log(citas);

		// Formatear las citas para facilitar el uso en el frontend
		const citasFormateadas = citas.map((cita) => ({
			idPaciente: Number(cita.idPaciente), // Convertir a Number
			nombrePaciente: cita.nombrePaciente,
			profesionPaciente: cita.profesionPaciente,
			edadPaciente: Number(cita.edadPaciente), // Convertir a Number
			tipoSangre: cita.tipoSangre,
			alergias: cita.alergias,
			nombreDentista: cita.nombreDentista,
			telefonoDentista: cita.telefonoDentista,
			fecha: new Date(Number(cita.fecha) * 1000).toLocaleString(), // Convertir timestamp (BigInt) a Number y luego a fecha
			motivo: cita.motivo,
			costoTotal: Number(cita.costoTotal), // Convertir de BigInt (Wei) a ETH
			observaciones: cita.observaciones,
		}));

		return citasFormateadas;
	} catch (error) {
		console.error("Error al obtener las citas del paciente:", error);
		throw error;
	}
};
