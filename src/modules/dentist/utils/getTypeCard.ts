// Función para validar el número de tarjeta usando Luhn
const isValidCardNumber = (number: string) => {
	const digits = number.split('').reverse().map((d) => parseInt(d, 10));
	const checksum = digits.reduce((sum, digit, index) => {
		if (index % 2 === 1) {
			const doubled = digit * 2;
			return sum + (doubled > 9 ? doubled - 9 : doubled);
		}
		return sum + digit;
	}, 0);
	return checksum % 10 === 0;
};

// Función para identificar el tipo de tarjeta
const getCardType = (number: string) => {
	if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) {
		return 'Visa';
	}
	if (/^5[1-5][0-9]{14}$/.test(number) || /^2(2[2-9][0-9]{2}|[3-6][0-9]{3}|7[01][0-9]{2}|720[0-9]{2})[0-9]{10}$/.test(number)) {
		return 'Mastercard';
	}
	return 'Desconocida';
};

// Función para validar y obtener el tipo de tarjeta
export default function validateCard(number: string) {
	if (!/^\d+$/.test(number)) {
		return { isValid: false, cardType: 'Inválida (contiene caracteres no numéricos)' };
	}

	const isValid = isValidCardNumber(number);
	const cardType = getCardType(number);
	return { isValid, cardType };
};