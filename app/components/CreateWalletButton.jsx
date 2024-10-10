'use client'

import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from 'axios';
import { ethers } from 'ethers';
import Modal from './TransactionsModal';

const GenerateOrShowWalletButton = () => {

  const [telegramUserName, setTelegramUserName] = useState(null); 

  const [publicKey, setPublicKey] = useState(null); 
  const [balance, setBalance] = useState("0.000"); 
  const [loading, setLoading] = useState(false); 
  const [copySuccess, setCopySuccess] = useState('');
  const [error, setError] = useState(null); 
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTelegramUserName = localStorage.getItem('telegramUserName');
      setTelegramUserName(storedTelegramUserName);
    }
  }, []);


  // CHECKING WALLET EXISTENCE ***********************************************************

  const checkWallet = async () => {
    setLoading(true); // Iniciar carga
    setError(null); // Limpiar errores
    console.warn("CARGANDO EL USERNAMEEE " + telegramUserName);
    
    try {
      // Verificar si el usuario ya tiene una wallet en el backend
      const response = await axios.post('http://localhost:5000/api/wallet/checkWallet', {
        telegramUserName: telegramUserName, // Cambia el valor por el username adecuado
      });

      if (response.data.publicKey) {
        setPublicKey(response.data.publicKey);
        await fetchBalance(response.data.publicKey); // Obtener balance si la wallet ya existe
      } else {
        setPublicKey(null);
        console.warn("PUBLIC KEYYYYYYYYY " + response.data.publicKey)
      }
      
      setLoading(false); // Detener carga
    } catch (error) {
      console.error('Error al verificar la wallet:', error);
      setError('Error al verificar la wallet');
      setLoading(false); // Detener carga
    }
  };

  // FETCHING BALANCE ***********************************************************

  const fetchBalance = async (publicKey) => {
    try {
      const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com'); // Proveedor de Polygon
      const balanceInWei = await provider.getBalance(publicKey); // Obtener balance en wei
      const balanceInMatic = ethers.formatEther(balanceInWei); // Convertir a MATIC
      setBalance(balanceInMatic);
    } catch (error) {
      console.error('Error al obtener el balance:', error);
      setError('Error al obtener el balance');
    }
  };

  // CRATE NEW WALLET ***********************************************************

  const createWallet = async () => {
    setLoading(true);
    setError(null);
    console.warn("EL USERNAMEEEEEEEEEEEEE" + telegramUserName);

    try {
      const response = await axios.post('http://localhost:5000/api/wallet/createWallet', {
        telegramUserName: telegramUserName, 
      });

      setPublicKey(response.data.publicKey); 
      await fetchBalance(response.data.publicKey); 
      setLoading(false);
    } catch (error) {
      console.error('Error al crear la wallet:', error);
      setError('Error al crear la wallet');
      setLoading(false);
    }
  };

  // STARTING CHECKING **********************************************************

  useEffect(() => {
    if (telegramUserName) {
      checkWallet();
    }
  }, [telegramUserName]);

  // MODAL ******************************************************************

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

// UTILS ******************************************************************

const formatPublicKey = (publicKey) => {
  if (!publicKey) return '';
  const firstPart = publicKey.substring(0, 5);
  const lastPart = publicKey.substring(publicKey.length - 6);
  return `${firstPart}...${lastPart}`;
};

function formatBalance(number) {
  const value = Number(number);
  return value.toFixed(6).replace(/(\.0+|0+)$/, '');
}

const copyToClipboard = () => {
  if (publicKey) {
    navigator.clipboard.writeText(publicKey)
      .then(() => {
        setCopySuccess('¡Copied!');
        setTimeout(() => setCopySuccess(''), 2000); 
      })
      .catch(err => {
        setCopySuccess('Error');
      });
  }
};

  return (
    <div>
      {loading ? (
        <CodexButton>Waiting...</CodexButton>
      ) : publicKey ? (
        <>
        <ConnectedButton onClick={handleModalOpen}>
          <TitleImg src={"/Assets/Images/polygonIcon.png"} alt="polygon" />
          <DataContainer>
            <Address>{formatPublicKey(publicKey)}</Address>
            <Balance>{formatBalance(balance)} <pol>POL</pol></Balance>
          </DataContainer>
          <CopyButton onClick={copyToClipboard}>
            {copySuccess ? (
              <img src={"/Assets/Buttons/checkIcon.png"} alt="Check Icon" />
            ) : (
              <img src={"/Assets/Buttons/copyIcon.png"} alt="Copy Icon" />
            )}
          </CopyButton>
        </ConnectedButton>
        <Modal show={showModal} handleClose={handleModalClose} telegramUserName ={telegramUserName} publicKey={publicKey} balance={balance} />
        </>
      ) : (
        <CodexButton onClick={createWallet} disabled={loading}>
          {loading ? 'Creating Wallet...' : 'Create Wallet'}
        </CodexButton>
      )}
    </div>

  );
};
export default GenerateOrShowWalletButton;

const CodexButton = styled.button`
  border: 2px solid #242124;
  color: rgba(225,225,225,0.7);
  padding: 5px;
  margin-top: 2px;
  background-color: none; /* rgba(141, 81, 207, 1) */
  border-radius: 10px;
  width: 150px;
  height: 50px;
  box-shadow: 0px 2px 7px rgba(141, 81, 207, 1);
`;

const ConnectedButton = styled.button`
  border: 2px solid #242124;
  display: flex;
  color: rgba(225,225,225,0.7);
  padding: 5px;
  margin-top: 2px;
  background-color: none; /* rgba(141, 81, 207, 1) */
  border-radius: 10px;
  width: 200px;
  height: 50px;
  box-shadow: 0px 2px 7px rgba(141, 81, 207, 1);
`;

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;  // Disposición en columna
  align-items: flex-start;  // Alineación a la izquierda
  gap: 3px;  // Espacio entre los elementos
`;


const Address = styled.div`
  font-size: 14px;
  color: rgba(225,225,225,0.9);
  margin-left: 10px;
  height: 15px;
`;

const Balance = styled.div`
  font-size: 14px; // Tamaño de fuente ajustado para el balance
  color: rgba(225,225,225,0.5);
  margin-left: 10px;
  height: 15px;
    pol{
      color: rgba(141, 81, 207, 1)
    }
`;

const TitleImg = styled.img`
    max-width: 20%;  
    margin-left: 5px;
    opacity: 0.8;
    height: auto%;
    position: relative; 
`;

const CopyButton = styled.button`
  margin-left: 8px;
  font-size: 10px;
  background-color: none;
  border-radius: 2px;
  color: #8D51CF;
  padding: 5px 5px;
  cursor: pointer;
`;

  