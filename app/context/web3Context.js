"use client";

import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Crear el contexto de Web3
const Web3Context = createContext();

// Proveedor de Web3 que puede ser usado por cualquier componente
export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const infuraProjectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
        const infuraProvider = new ethers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${infuraProjectId}`);
        setProvider(infuraProvider);
        console.log("Proveedor Web3 conectado con Infura");
      } catch (error) {
        console.error("Error al inicializar Web3:", error); 
      }
    };

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={{ provider }}>
      {children}
    </Web3Context.Provider>
  );
};

// Hook para usar el contexto de Web3
export const useWeb3 = () => React.useContext(Web3Context);

