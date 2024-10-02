'use client';

import React from "react";
import styled from "styled-components";
import MobileMenu from "@/app/components/Mobilemenu";

export default function Navbar() {

    return (
        <Nav>
            <SectionNameContainer>
                <SectionName>Heretic Redemption</SectionName>
            </SectionNameContainer>
            <LogoContainer>
                
                <Logo src={"/Assets/Images/LOGOPRIM.png"} alt="Primaris | Metaversalwar" />
                
            </LogoContainer>
            <ButtonContainer>
                <Button_><w3m-button /></Button_>
                <MobileMenuContainer><MobileMenu /></MobileMenuContainer>
            </ButtonContainer>
        </Nav>
    );
}

// NAVBAR *******************************************************

const Nav = styled.header`
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #0b0d10;
    padding: 2%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 11;
    box-shadow: 0px 0px 50px rgba(225, 225, 225, 0.2);
    
    height: 80px; /* Altura fija del navbar en pantallas grandes */

    @media (max-width: 991px) {
        flex-direction: column; /* Los elementos se apilan verticalmente en pantallas pequeñas */
        height: auto; /* Dejamos que el contenido determine la altura */
        padding-bottom: 1rem; /* Agregamos un margen inferior para que no se sienta apretado */
    }
`;


// LOGO *******************************************************

const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1; /* Esto permite que el logo ocupe el espacio que necesite sin un tamaño fijo */
    
    @media (max-width: 991px) {
        width: 100%;
        justify-content: center; /* Centramos el logo en pantallas más pequeñas */
    }
`;
const Logo = styled.img`
    max-width: 100%; 
    height: auto;
`;

// METAMASK BUTTON *******************************************************

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 5px;
    flex: 1; /* Esto permite que el contenedor del botón ocupe el espacio necesario */
    
    @media (max-width: 991px) {
        width: 100%;
        justify-content: center; /* Centramos los botones en pantallas más pequeñas */
    }
`;

const Button_ = styled.div`
    position: relative;
    width: 50%;
`;

// SECTION NAME *******************************************************

const SectionNameContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    flex: 1; /* Permitimos que el contenedor del nombre de sección se ajuste */
    
    @media (max-width: 991px) {
        display: none; /* Ocultamos el nombre de la sección en pantallas pequeñas */
    }
`;

const SectionName = styled.div`
    font-size: 2rem;
    margin-left: 10%;
    color: rgba(225, 225, 225, 1);
    flex: 1;
    text-align: left;
    @media (min-width: 1200px) and (max-width: 1400px) {
    
    }

    @media (min-width: 992px) and (max-width: 1199px) {
      
    }
`;

// MOBILE MENU *******************************************************

const MobileMenuContainer = styled.div`
    display: none; /* Oculto por defecto */

    /* Visible solo en pantallas pequeñas */
    @media (max-width: 991px) {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 30%; /* Ajustamos el ancho para que se vea bien */
    }
    
    @media (max-width: 479px) {
        width: 40%;
        right: 5%;
    }
`;

