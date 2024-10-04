'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import axios from 'axios';

const RegisterForm = () => {
  const [telegramUserName, setTelegramUserName] = useState('');
  const [referralTicket, setReferralTicket] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirmar la contraseña
  const [responseMessage, setResponseMessage] = useState('');
  const navigate = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (telegramUserName.trim() === '' || 
        password.trim() === '' || 
        confirmPassword.trim() === '' ||
        referralTicket.trim() === '' ) {
        setResponseMessage('All fields are required');
        return;
      }

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setResponseMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      // Enviar solicitud POST al backend con Axios
      const response = await axios.post('https://airdrop-primaris-server.vercel.app/api/auth/register', {
        telegramUserName,
        password,
        referralTicket,
      });

      // Si el registro es exitoso
      if (response.data.success) {
        setResponseMessage('Successful registration');
        alert('Successful registration');
        navigate.push('/login');
      } else {
        setResponseMessage(response.data.message || 'Error registering');
      }
    } catch (error) {
      // Corregir el manejo del error en el bloque catch
      setResponseMessage(
        'Error registering: ' + (error.response && error.response.data.message ? error.response.data.message : 'Unknown error')
      );
    }
  };

  return (
    <Modal>
        <Logo src={"/Assets/Images/PRIMARISMETAVERSALWARLOGO0.png"} alt="Primaris | Metaversalwar" />
        <TitleImg src={"/Assets/Words/join_.png"} alt="Omnilex" />
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
        <FormField>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormField>
        <FormField>
          <label>Referral Code</label>
          <input
            type="text"
            value={referralTicket}
            onChange={(e) => setReferralTicket(e.target.value)}
            required
          />
        </FormField>
        <RegisterButton type="submit">Register</RegisterButton>
      </FormContainer>
        <Link href="/login">
            <LoginButton>Go to Sign In</LoginButton>
        </Link>
        <ResponseMessage>{responseMessage && <p>{responseMessage}</p>}</ResponseMessage>
    </Modal>
  );
};

export default RegisterForm;

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
  max-width: 70%;  
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
  gap: 10px; /* Espacio entre los campos */
  width: 100%;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 5px;
    color: rgba(141, 81, 207, 1);
    font-size: 12px;
  }

  input {
    padding: 6px;
    border-radius: 5px;
    border: 1px solid rgba(141, 81, 207, 1);
    background-color: #2c2c2c;
    color: #ffffff;
    width: 100%;
    font-size: 14px;
  }
`;

const RegisterButton = styled.button`
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

const LoginButton = styled.button`
  margin-top: 20px;
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
  
