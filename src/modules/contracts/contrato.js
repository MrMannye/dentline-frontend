import Web3 from "web3";
import abi from "../../../build/contracts/ClinicaDental.json"; // Ruta al ABI del contrato

const CONTRACT_ADDRESS = "0x95337FF74CD44c2664049B915e9d6d3B2390c507"; // Dirección del contrato

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
	const { idPaciente, nombrePaciente, profesionPaciente, edadPaciente, tipoSangre, alergias,
		nombreDentista, profesionDentista, telefonoDentista, fecha, motivo, costoTotal, observaciones } = datosCita;

	try {
		const web3 = getWeb3();
		const contrato = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

		// Obtener la cuenta conectada
		const accounts = await web3.eth.getAccounts();
		if (accounts.length === 0) {
			throw new Error("No hay cuentas conectadas. Por favor, inicia sesión con MetaMask.");
		}

		// Convertir el costo total a Wei (Ethereum usa Wei como su unidad base)
		const costoTotalWei = web3.utils.toWei(costoTotal.toString(), "ether");

		// Crear la cita llamando al contrato
		const tx = await contrato.methods
			.crearCita(
				idPaciente,
				nombrePaciente,
				profesionPaciente,
				edadPaciente,
				tipoSangre,
				alergias,
				nombreDentista,
				profesionDentista,
				telefonoDentista,
				fecha, // Asegúrate de que el timestamp sea un número entero
				motivo,
				costoTotalWei,
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

// Función para obtener las citas de un paciente por su ID
export const obtenerCitasPorPaciente = async (idPaciente) => {
	try {
		const web3 = getWeb3();
		const contrato = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

		// Llamar a la función del contrato para obtener las citas
		const citas = await contrato.methods.obtenerCitasPorPaciente(idPaciente).call();

		// Formatear las citas para facilitar el uso en el frontend
		const citasFormateadas = citas.map((cita) => ({
			idPaciente: cita.idPaciente,
			nombrePaciente: cita.nombrePaciente,
			profesionPaciente: cita.profesionPaciente,
			edadPaciente: cita.edadPaciente,
			tipoSangre: cita.tipoSangre,
			alergias: cita.alergias,
			nombreDentista: cita.nombreDentista,
			profesionDentista: cita.profesionDentista,
			telefonoDentista: cita.telefonoDentista,
			fecha: new Date(cita.fecha * 1000).toLocaleString(), // Convertir timestamp a fecha legible
			motivo: cita.motivo,
			costoTotal: web3.utils.fromWei(cita.costoTotal, "ether"), // Convertir de Wei a ETH
			observaciones: cita.observaciones,
		}));

		return citasFormateadas;
	} catch (error) {
		console.error("Error al obtener las citas del paciente:", error);
		throw error;
	}
};
