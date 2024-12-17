import QRCode from 'qrcode';
import { crc16 } from 'crc';

export interface CoDiData {
	version: string;
	merchantName: string;
	merchantAccount: string;
	merchantBank: string;
	reference: string;
	amount: number;
	currency: string;
	countryCode: string;
}

function calculateCRC(data: string): string {
	const crcValue = crc16(data); // Calcula el CRC usando crc16
	return crcValue.toString(16).toUpperCase().padStart(4, '0'); // Asegura un formato hexadecimal de 4 dígitos
}

function generateCoDiQR(data: CoDiData): Promise<string> {
	// Validaciones de los campos
	if (!data.version) throw new Error("La versión es requerida.");
	if (!data.merchantName) throw new Error("El nombre del comercio es requerido.");
	if (!data.merchantAccount) throw new Error("La cuenta del comercio es requerida.");
	if (!data.merchantBank) throw new Error("El banco del comercio es requerido.");
	if (!data.reference) throw new Error("La referencia de la transacción es requerida.");
	if (data.amount <= 0) throw new Error("El monto debe ser mayor a 0.");
	if (!data.currency) throw new Error("La moneda es requerida.");
	if (!data.countryCode) throw new Error("El código de país es requerido.");

	// Estructura del mensaje CoDi sin CRC
	let codiMessage = `
    ${data.version}|${data.merchantName}|${data.merchantAccount}|${data.merchantBank}|
    ${data.reference}|${data.amount.toFixed(2)}|${data.currency}|${data.countryCode}
  `.trim();

	// Calcular el CRC
	const crcValue = calculateCRC(codiMessage);
	codiMessage += `|CRC:${crcValue}`; // Agregar CRC al mensaje

	// Generar el QR con la librería QRCode
	return QRCode.toDataURL(codiMessage, { errorCorrectionLevel: 'H' });
}

// Ejemplo de uso
async function createCoDiQR(data: CoDiData) {
	const codiData: CoDiData = {
		version: '1.0',
		merchantName: data.merchantName,
		merchantAccount: data.merchantAccount,
		merchantBank: 'BANAMEX',
		reference: data.reference,
		amount: data.amount,
		currency: 'MXN',
		countryCode: 'MX',
	};

	try {
		const qrCodeURL = await generateCoDiQR(codiData);
		console.log('QR Code generado:', qrCodeURL);
		return qrCodeURL;
	} catch (error) {
		console.error('Error generando QR CoDi:', error);
	}
}

export { generateCoDiQR, createCoDiQR };
