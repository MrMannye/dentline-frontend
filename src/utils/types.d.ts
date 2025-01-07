export interface DataPacient {
	username: string;
}

interface HistorialCita {
	alergias: string;           // Alergias del paciente
	costoTotal: number;         // Costo total de la cita (en número)
	edadPaciente: number;       // Edad del paciente
	fecha: string;              // Fecha de la cita (puede ser un timestamp o un string legible)
	idPaciente: number;         // ID del paciente (entero)
	motivo: string;             // Motivo de la cita
	nombreDentista: string;     // Nombre del dentista asignado
	nombrePaciente: string;     // Nombre del paciente
	observaciones: string;      // Observaciones de la cita
	profesionPaciente: string;  // Profesión del paciente
	telefonoDentista: string;   // Teléfono de contacto del dentista
	tipoSangre: string;         // Tipo de sangre del paciente
}
