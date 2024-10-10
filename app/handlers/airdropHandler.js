import axios from 'axios';

// ESTIMATE GAS TO SEND PRIMARIS TOKEN ********************************************************************************

export const estimateAirdropGas = async (telegramUserName) => {
    try {
        const response = await axios.post('https://airdrop-primaris-server.vercel.app/api/transaction/gasClaim', {
            telegramUserName
        });

        const { estimatedGas, totalGasCostInMatic } = response.data;

        // Devuelve un objeto con la información
        return {
            estimatedGas,
            totalGasCost: totalGasCostInMatic
        };
    } catch (error) {
        console.error('Error al estimar el gas:', error);
        throw new Error('Error al estimar el gas. Por favor, intenta de nuevo.');
    }
};

// CLAIMING TOKENS ********************************************************************************

export const ClaimRequest = async (telegramUserName) => {
    try {
        const response = await axios.post('https://airdrop-primaris-server.vercel.app/api/transaction/claim', {
            telegramUserName
        });

        const { success, message, txHash, error } = response.data;

        // Verifica si hay un error en la respuesta del backend
        if (!success) {
            console.error('Error al reclamar recompensa:', message || error);
            return {
                success: false,
                message: message || error || 'Error desconocido en el contrato.',
                txHash: null
            };
        }

        // Si la transacción fue exitosa, devuelve los datos
        return {
            success,
            message: message || 'Claim Successfull!!',
            txHash
        };
    } catch (error) {
        console.error('Error al enviar la transacción:', error);

        // Verifica si el error tiene un mensaje detallado
        const errorMessage = error.response?.data?.error || error.message || 'Error al enviar la transacción. Por favor, intenta de nuevo.';

        // Devuelve el error capturado
        return {
            success: false,
            message: errorMessage,
            txHash: null
        };
    }
};
