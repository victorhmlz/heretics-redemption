import axios from 'axios';

// ESTIMATE GAS TO SEND PRIMARIS TOKEN ********************************************************************************

export const estimateGasPol = async (telegramUserName, recipient, amount) => {
    try {
        const response = await axios.post('https://airdrop-primaris-server.vercel.app/api/transaction/gas', {
            telegramUserName,
            recipientAddress: recipient,
            amount
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

// SENDING PRIMARIS TOKEN ********************************************************************************

export const sendTransactionPol = async (telegramUserName, recipient, amount) => {
    try {
        const response = await axios.post('https://airdrop-primaris-server.vercel.app/api/transaction/send', {
            telegramUserName,
            recipientAddress: recipient,
            amount
        });

        const { message, txHash, error } = response.data;

        // Devuelve un objeto con el estado de la transacción
        return {
            message,
            txHash
        };
    } catch (error) {
        console.error('Error al enviar la transacción:', error);
        throw new Error('Error al enviar la transacción. Por favor, intenta de nuevo.');
    }
};