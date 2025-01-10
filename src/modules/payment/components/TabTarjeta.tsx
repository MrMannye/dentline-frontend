import Image from 'next/image';
import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';

const TabTarjeta: React.FC<{ abonado: number }> = ({ abonado }) => {
	const [qrCode, setQrCode] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		const generateCoDiQR = async () => {
			try {
				// 1. Autenticación para obtener TSEC
				const authResponse = await fetch(
					'https://apisempresariales.bbva.mx/apisemppr/TechArchitecture/mx/grantingTicket/V02',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							authentication: {
								userID: '00000148', // Número de contrato
								consumerID: '10000080',
								authenticationData: [
									{ idAuthenticationData: 'password', authenticationData: 'MI_CLAVE_DIGITAL' },
								],
							},
						}),
					}
				);

				if (!authResponse.ok) throw new Error('Error al autenticar con BBVA');

				const tsec = authResponse.headers.get('tsec');
				if (!tsec) throw new Error('No se recibió TSEC');

				// 2. Generación del QR CoDi
				const qrResponse = await fetch('https://apisempresariales.bbva.mx/apisemppr/createQR/V01/', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${tsec}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						contract: { number: '01686356' },
						account: { number: '012914002016863562' },
						concept: 'PAGO CONSULTA DENTAL',
						reference: '1234567',
						limitOperationDate: new Date().toISOString(),
						transferAmount: { amount: abonado.toFixed(2) },
						feepayerType: '1',
						interbankPaymentType: '20',
					}),
				});

				if (!qrResponse.ok) throw new Error('Error al generar el QR CoDi');

				const qrData = await qrResponse.json();
				const qrBase64 = qrData.qrCode;
				setQrCode(`data:image/png;base64,${qrBase64}`);
			} catch (error) {
				console.error('Error al generar QR CoDi:', error);
				setErrorMessage('Error al generar QR con BBVA. Abriendo alternativa con link profundo.');

				// Generar QR con un deep link
				const bbvaDeepLink = `https://mgm.bbva.mx/WA3b/acwmprva`;
				const qrFallback = await QRCode.toDataURL(bbvaDeepLink);
				setQrCode(qrFallback);
			}
		};

		generateCoDiQR();
	}, [abonado]);

	return (
		<div className="flex flex-col items-center justify-center">
			{errorMessage && <p className="text-red-600 text-sm mb-2">{errorMessage}</p>}
			{qrCode ? <Image src={qrCode} alt="QR Code CoDi" width={200} height={200} /> : <p>Generando QR...</p>}
		</div>
	);
};

export default TabTarjeta;