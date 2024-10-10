'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import axios from 'axios';

const LoginForm = () => { 
  const [telegramUserName, setTelegramUserName] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const navigateTo = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Hacer la solicitud POST al backend con Axios
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        telegramUserName,
        password
      });

      console.log('Respuesta del backend:', response.data);
      
      if (response.data.success) {
        setResponseMessage(response.data.message || 'Login Success');
        alert('Welcome Commandant!');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('telegramUserName', response.data.telegramUserName);
        navigateTo.push('/main');
      } else {
        setResponseMessage(response.data.message || 'Error in login');
        setResponseMessage('Error in login, try again.');
      }

    } catch (error) {
        console.error('Error durante el login:', error.response ? error.response.data : error.message);
  
        // Si error.response existe, obtenemos el mensaje de error, sino proporcionamos uno genérico
        const errorMessage = error.response && error.response.data && error.response.data.message 
          ? error.response.data.message 
          : 'Error al iniciar sesión. Verifica tus credenciales.';
  
        // Actualizamos el mensaje de respuesta con el error
        setResponseMessage(errorMessage);
  
        // Llamamos a la función onError si está presente, pasando el mensaje de error
        setResponseMessage(errorMessage);
    }
  };
  
  return (
    <Modal>
      <Logo src={"/Assets/Images/PRIMARISMETAVERSALWARLOGO0.png"} alt="Primaris | Metaversalwar" />
      <TitleImg src={"/Assets/Words/heretics.png"} alt="Omnilex" />
      <FormContainer onSubmit={handleSubmit}>
        <FormField>
          <label>Telegram Username:</label>
          <input
            type="text"
            value={telegramUserName}
            onChange={(e) => setTelegramUserName(e.target.value)}
            required
          />
        </FormField>
        <FormField>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormField>
        <LoginButton type="submit">Login</LoginButton>
      </FormContainer>

      <ResponseMessage>{responseMessage}</ResponseMessage>

      <Link href="/register">
        <RegisterButton>Create an account.</RegisterButton>
      </Link>
    </Modal>
  );
};

export default LoginForm;

// Styled Components

const Modal = styled.div`
  background-color: #0c0d10;
  box-shadow: 0 5px 80px rgba(141, 81, 207, 0.8);
  color: rgba(255,255,255,0.8);
  padding: 20px;
  width: 300px; 
  height: 95vh; 
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center; 
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  border-radius: 10px;
  z-index: 1000; 
`;

const TitleImg = styled.img`
  max-width: 90%;  
  height: auto%;
  position: relative; 
`;

const Logo = styled.img`
  position: fixed;
  bottom: 5%;
  width: 80%;
  opacity: 40%;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espacio entre los campos */
  width: 100%;
  padding-top: 40px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 5px; /* Espacio entre el label y el input */
    color: rgba(141, 81, 207, 1);
    font-size: 14px;
  }

  input {
    padding: 8px;
    border-radius: 5px;
    border: 1px solid rgba(141, 81, 207, 1);
    background-color: #2c2c2c;
    color: #ffffff;
    width: 100%;
    font-size: 16px;
  }
`;

const LoginButton = styled.button`
  grid-column: 1 / span 2;
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  background: rgba(141, 81, 207, 1);
  color: #ffffff;
  cursor: pointer;
  border: none;
  font-size: 16px;
  width: 100%;

  &:hover {
    background-color: #a952ff;
  }
`;

const RegisterButton = styled.button`
  margin-top: 15px;
  background-color: transparent;
  border: none;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  font-size: 16px;
  text-decoration: underline;

  &:hover {
    color: #ffffff;
  }
`;

const ResponseMessage = styled.p`
  margin-top: 20px;
  color: #ff6464;
`;

