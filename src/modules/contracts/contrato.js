import Web3 from "web3";
import contractData from "../../../build/contracts/ClinicaDental.json"; // Ruta al ABI del contrato

const CONTRACT_ADDRESS = "0xe2633c7e49dCefB842D0aCc087b11CDc21a0fc60"; // Dirección del contrato
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
	console.log("Creando cita:", datosCita);
	const { idPaciente, nombrePaciente, profesionPaciente, edadPaciente, tipoSangre, alergias,
		nombreDentista, telefonoDentista, fecha, motivo, costoTotal, observaciones } = datosCita;

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

		// Obtener la cuenta conectada
		const accounts = await web3.eth.getAccounts();
		if (accounts.length === 0) {
			throw new Error("No hay cuentas conectadas. Por favor, inicia sesión con MetaMask.");
		}
		// Llamar a la función 'getCitasDePaciente' para obtener las citas filtradas por dentista
		console.log(accounts[0]);
		const citas = await contrato.methods.getCitasDePaciente(idPaciente).call({ from: accounts[0] });


		// Formatear las citas para facilitar el uso en el frontend
		const citasFormateadas = citas.map((cita) => ({
			idPaciente: cita.idPaciente,
			nombrePaciente: cita.nombrePaciente,
			profesionPaciente: cita.profesionPaciente,
			edadPaciente: cita.edadPaciente,
			tipoSangre: cita.tipoSangre,
			alergias: cita.alergias,
			nombreDentista: cita.nombreDentista,
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
