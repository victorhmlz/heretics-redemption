'use client';

import styled, { keyframes } from 'styled-components';

const slideLeft = keyframes`
  0% {
    transform: translateX(30%); 
  }
  100% {
    transform: translateX(-180%); 
  }
`;

const slideRight = keyframes`
  0% {
    transform: translateX(-30%); 
  }
  100% {
    transform: translateX(185%); 
  }
`;

const slideRightBack = keyframes`
  0% {
    transform: translateX(200%); 
  }
  100% {
    transform: translateX(-30%); 
  }
`;

const slideLeftBack = keyframes`
  0% {
    transform: translateX(-195%); 
  }
  100% {
    transform: translateX(30%);
  }
`;

const flickerIn = keyframes`
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0;
  }
  10.1% {
    opacity: 1;
  }
  10.2% {
    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  20.1% {
    opacity: 1;
  }
  20.6% {
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  30.1% {
    opacity: 1;
  }
  30.5% {
    opacity: 1;
  }
  30.6% {
    opacity: 0;
  }
  45% {
    opacity: 0;
  }
  45.1% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  55% {
    opacity: 1;
  }
  55.1% {
    opacity: 0;
  }
  57% {
    opacity: 0;
  }
  57.1% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  60.1% {
    opacity: 0;
  }
  65% {
    opacity: 0;
  }
  65.1% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  75.1% {
    opacity: 0;
  }
  77% {
    opacity: 0;
  }
  77.1% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  85.1% {
    opacity: 0;
  }
  86% {
    opacity: 0;
  }
  86.1% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
`;

const HologramButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;
  width: 100%; 
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 1200px) and (max-width: 1400px) {
    width: 50%;
  }
  @media (min-width: 992px) and (max-width: 1199px) {
    width: 60%;
  }
  @media (min-width: 768px) and (max-width: 991px) {
    width: 70%;
  }
  @media (min-width: 480px) and (max-width: 767px) {
    width: 100%;
  }
  @media (max-width: 479px) {
    width: 100%;
  }

  &:hover .left-icon {
    animation: ${slideLeft} 0.5s forwards;
  }

  &:hover .right-icon {
    animation: ${slideRight} 0.5s forwards;
  }

  &:hover .back-icon {
    animation: ${flickerIn} 0.5s forwards;
    visibility: visible;
    opacity: 0.9;
  }

  &:hover .mint-icon {
    visibility: hidden;
    opacity: 0;
  }

  &:hover .mintlegionary-icon {
    animation: ${flickerIn} 0.5s forwards;
    visibility: visible;
    opacity: 1;
  }

  &:not(:hover) .mint-icon {
    animation: ${flickerIn} 0.5s forwards;
    visibility: visible;
    opacity: 1;
  }

  &:not(:hover) .left-icon {
    animation: ${slideLeftBack} 0.5s forwards;
  }

  &:not(:hover) .right-icon {
    animation: ${slideRightBack} 0.5s forwards;
  }
  
`;

const LeftIcon = styled.img.attrs({
    src: "/Assets/Buttons/left.png"
  })`
    position: absolute;
    left: 25%;
    width: 14%;
    height: auto;
    z-index: 2;
  `;
  
  const RightIcon = styled.img.attrs({
    src: "/Assets/Buttons/right.png"
  })`
    position: absolute;
    right: 25%;
    width: 14%;
    height: auto;
    z-index: 2; 
  `;
  
  const BackIcon = styled.img.attrs({
      src: "/Assets/Buttons/back.png"
    })`
      position: absolute;
      width: 100%;
      height: auto;
      z-index: 1; 
      visibility: hidden; 
      opacity: 0;
    `;

    const MintIcon = styled.img.attrs({
        src: "/Assets/Words/claim.png"
      })`
        position: absolute;
        width: 100%;
        height: auto;
        z-index: 1; 
        visibility: visible; 
        opacity: 1;
      `;

      const MintLegionaryIcon = styled.img.attrs({
        src: "/Assets/Words/claimreward.png"
      })`
        position: absolute;
        width: 105%;
        height: auto;
        z-index: 1;
        visibility: hidden;
        opacity: 0;
      `;
  
    const ClaimButton_ = ({ onClick }) => {
        return (
            <HologramButton onClick={onClick}>
            <BackIcon className="back-icon" />
            <LeftIcon className="left-icon" />
            <RightIcon className="right-icon" />
            <MintIcon className="mint-icon" />
            <MintLegionaryIcon className="mintlegionary-icon" />
            </HologramButton>
        );
    };

export default ClaimButton_;