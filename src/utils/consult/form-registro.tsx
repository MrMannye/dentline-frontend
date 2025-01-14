export const consultaInputs = [
	{
		name: "Peso",
		register: "peso",
		value: "",
		visible: true,
		required: true,
		validation: {
			required: "El peso es obligatorio.",
			pattern: {
				value: /^[0-9]+(\.[0-9]{1,2})?$/,
				message: "El peso debe ser un número válido (por ejemplo: 70 o 70.5).",
			},
			min: { value: 15, message: "El peso debe ser mayor o igual a 15 kg." },
			max: { value: 200, message: "El peso no puede superar los 200 kg." },
		},
	},
	{
		name: "Alergias",
		register: "alergias",
		value: "",
		visible: true,
		required: true,
		validation: {
			required: "Las alergias son obligatorias.",
			maxLength: { value: 255, message: "No debe superar los 255 caracteres." },
		},
	},
	{
		name: "Tipo de Sangre",
		register: "tipo_sangre",
		value: "",
		visible: true,
		required: true,
		validation: {
			required: "El tipo de sangre es obligatorio.",
			pattern: {
				value: /^(A|B|AB|O)[+-]$/,
				message: "Debe ser un tipo de sangre válido (por ejemplo: A+, O-, etc.).",
			},
		},
	},
	{
		name: "Pulso",
		register: "pulso",
		value: "",
		visible: true,
		required: true,
		validation: {
			required: "El pulso es obligatorio.",
			pattern: {
				value: /^[0-9]+$/,
				message: "El pulso debe ser un número entero.",
			},
			min: { value: 30, message: "El pulso debe ser mayor o igual a 30 bpm." },
			max: { value: 200, message: "El pulso no debe superar los 200 bpm." },
		},
	},
	{
		name: "Presión",
		register: "presion",
		value: "",
		visible: true,
		required: true,
		validation: {
			required: "La presión es obligatoria.",
			pattern: {
				value: /^\d{2,3}\/\d{2,3}$/,
				message: "Debe tener formato válido (ejemplo: 120/80).",
			},
		},
	},
	{
		name: "Antecedentes médicos",
		register: "antecedentes_medicos",
		value: "",
		visible: true,
		required: true,
		validation: {
			required: "Los antecedentes médicos son obligatorios.",
			maxLength: { value: 500, message: "No debe superar los 500 caracteres." },
		},
	},
];
