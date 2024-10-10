import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Componente principal
const SendTokensModal = ({ telegramUserName, sender, recipient, amount}) => {
    const [estimatedGas, setEstimatedGas] = useState(null);
    const [totalGasCost, setTotalGasCost] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleEstimateGas = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/wallet/estimateGas', {
                telegramUserName,
                recipientAddress: recipient,
                amount
            });

            setEstimatedGas(response.data.estimatedGas);
            setTotalGasCost(response.data.totalGasCostInMatic);
            setShowConfirmation(true);
            setLoading(false);
        } catch (error) {
            console.error('Error al estimar el gas:', error);
            alert('Error al estimar el gas. Por favor, intenta de nuevo.');
            setLoading(false);
        }
    };

    const handleSendTransaction = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/wallet/sendTransaction', {
                telegramUserName,
                recipientAddress: recipient,
                amount
            });

            setTransactionStatus({ success: true, txHash: response.data.txHash });
            setShowConfirmation(false);
            setLoading(false);
        } catch (error) {
            console.error('Error al enviar la transacción:', error);
            setTransactionStatus({ success: false, message: 'Error al procesar la transacción' });
            setShowConfirmation(false);
            setLoading(false);
        }
    };

    return (
        <Container>
            <h3>Enviar Tokens</h3>
            <Input 
                type="text" 
                placeholder="Dirección de destino" 
                value={recipient} 
                onChange={(e) => setRecipient(e.target.value)} 
            />
            <Input 
                type="number" 
                placeholder="Cantidad" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
            />
            <Button onClick={handleEstimateGas} disabled={loading}>
                {loading ? 'Estimando...' : 'Enviar Tokens'}
            </Button>

            {showConfirmation && (
                <Modal>
                    <h4>Confirmación de Transacción</h4>
                    <p>Enviando {amount} tokens a {recipient}</p>
                    <p>Gas Estimado: {estimatedGas} unidades</p>
                    <p>Costo total en MATIC: {totalGasCost}</p>
                    <Button onClick={handleSendTransaction}>Confirmar</Button>
                    <Button onClick={() => setShowConfirmation(false)}>Cancelar</Button>
                </Modal>
            )}

            {transactionStatus && (
                <Modal>
                    {transactionStatus.success ? (
                        <p>Transacción exitosa. Hash: {transactionStatus.txHash}</p>
                    ) : (
                        <p>Error: {transactionStatus.message}</p>
                    )}
                    <Button onClick={() => setTransactionStatus(null)}>Cerrar</Button>
                </Modal>
            )}
        </Container>
    );
};

// Estilos para el componente y los elementos
const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #1e1e2f;
    padding: 20px;
    border-radius: 8px;
    width: 100%;
`;

const Input = styled.input`
    padding: 10px;
    border-radius: 4px;
    border: none;
    outline: none;
    width: 100%;
`;

const Button = styled.button`
    padding: 10px;
    background-color: #8D51CF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #7b42b1;
    }
`;

const Modal = styled.div`
    background-color: #0b0d10;
    color: white;
    padding: 20px;
    border-radius: 8px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: 300px;
`;

export default SendTokensModal;
