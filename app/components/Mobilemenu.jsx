'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importa el router de 'next/navigation'

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Usar el router directamente

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') { // Comprobamos si estamos en cliente
      localStorage.removeItem('token'); // Eliminamos el token
      router.push('/login'); // Redirigimos al login
    }
  };

  return (
    <MenuContainer>
      <MenuToggle onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </MenuToggle>
      {isOpen && (
        <MenuList>
          <a href="https://t.me/+rLN7KAvG6703OWM0" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>
            <MenuItem>Telegram Announcements</MenuItem>
          </a>
          <a href="https://t.me/+ZakO8sVSCCY3ODJk" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>
            <MenuItem>Telegram Community</MenuItem>
          </a>
          <a href="https://discord.gg/3y4y268Hwk" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>
            <MenuItem>Discord Channel</MenuItem>
          </a>
          <a href="https://x.com/metaversalwar" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>
            <MenuItem>X</MenuItem>
          </a>
          <a href="https://metaversalwar.com" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>
            <MenuItem>Main Game (Testnet)</MenuItem>
          </a>
          <MenuItem onClick={handleLogout}>
            Logout
          </MenuItem>
        </MenuList>
      )}
    </MenuContainer>
  );
};

export default MobileMenu;
// Styled Components

const MenuContainer = styled.div`
  display: none;
  justify-content: right;
  align-items: center;
  @media (min-width: 768px) and (max-width: 991px) {
      display: flex;
      width: 30%;
      height: auto;
      padding-right: 40px;
  }
  @media (min-width: 480px) and (max-width: 769px) {
      display: flex;
      width: 30%;
      height: auto;
  }

  @media (max-width: 479px) {
      display: flex;
      width: 40%;
      height: auto;
  }
`;

const MenuToggle = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  width: 50%;
  height: 30px;
  span {
    display: block;
    width: 80%;
    height: 2px;
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 1px 2px rgba(141, 81, 207, 1);
    margin-bottom: 5px;
  }
  span:last-child {
    margin-bottom: 0;
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #333;
  position: absolute;
  z-index: 50;
  top: 100%;
  right: 0;
  width: 99vw;
  border-radius: 5px;
  overflow: hidden;
`;

const MenuItem = styled.li`
  display: block;
  padding: 15px;
  color: #fff;
  text-decoration: none;
  background-color: #333;
  border-bottom: 1px solid #444;
  &:hover {
    background-color: #444;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

