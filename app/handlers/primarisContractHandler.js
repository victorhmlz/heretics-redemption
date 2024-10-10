import { ethers } from 'ethers';
import { formatUnits } from 'ethers'
import axios from 'axios';
import PrimarisAbi from '@/app/abi/primarisAbi.json'; 

const primarisTokenAddress = process.env.NEXT_PUBLIC_PRIMARIS_TOKEN_ADDRESS;

// GET PRIMARIS BALANCE ******************************************************************

export const getPrimarisBalance = async (publicKey, provider) => {
    try {
        // Validar la dirección del contrato
        if (!primarisTokenAddress) {
            throw new Error('Contract address is not defined');
        } else if (!provider) {
            throw new Error('Provider is not detected');
        } else if (!publicKey) {
            throw new Error('Public Key is not detected');
        }
        // Instancia del contrato Primaris
        const contract = new ethers.Contract(primarisTokenAddress, PrimarisAbi, provider);

        // Obtener balance
        const balance = await contract.balanceOf(publicKey);
        const balanceInPrimaris = formatUnits(balance, 18); // Usa formatUnits desde ethers
        return balanceInPrimaris;
    } catch (error) {
        console.error('Error al obtener el balance:', error);
        throw new Error('No se pudo obtener el balance.');
    }
};

// ESTIMATE GAS TO SEND PRIMARIS TOKEN ********************************************************************************

export const estimateGas = async (telegramUserName, recipient, amount) => {
    try {
        const response = await axios.post('http://localhost:5000/api/transaction/gasPrimaris', {
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

export const sendTransaction = async (telegramUserName, recipient, amount) => {
    try {
        const response = await axios.post('http://localhost:5000/api/transaction/sendPrimaris', {
            telegramUserName,
            recipientAddress: recipient,
            amount
        });

        const { success, txHash } = response.data;

        // Devuelve un objeto con el estado de la transacción
        return {
            success,
            txHash
        };
    } catch (error) {
        console.error('Error al enviar la transacción:', error);
        throw new Error('Error al enviar la transacción. Por favor, intenta de nuevo.');
    }
};
