import React, { createContext, useState, useContext } from 'react';

export interface PatientContextType {
	patient: PatientProps | null;
	setPatient: (patient: PatientProps) => void;
}

export interface PatientProps {
	id_paciente?: string;
	nombre_paciente?: string;
	profesion?: string;
	edad?: number;
	estado_civil?: string;
	fecha_nacimiento?: string; // formato: YYYY-MM-DD
	direccion?: string;
	telefono?: string;
	email?: string;
	teeths?: string[];
}


export const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [patient, setPatient] = useState<PatientProps | null>(null);

	return (
		<PatientContext.Provider value={{ patient, setPatient }}>
			{children}
		</PatientContext.Provider>
	);
};

export const usePatient = (): PatientContextType => {
	const context = useContext(PatientContext);
	if (!context) {
		throw new Error("usePatient must be used within a PatientProvider");
	}
	return context;
};

