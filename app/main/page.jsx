'use client'

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { useAppKitProvider, useAppKitAccount } from '@reown/appkit/react';
import { ethers } from 'ethers';
import axios from 'axios';
import styled from "styled-components";
import AirdropAbi from '@/app/abi/airdropAbi.json';
import PrimarisAbi from '@/app/abi/primarisAbi.json';
import Navbar from '@/app/components/Navbar';
import ClaimButton_ from '@/app/components/ClaimButton';
import ProtectedRoute from '@/app/components/ProtectedRoute';


export default function Main() {

  // STATE VARIABLES

  const [telegramUserName, setTelegramUserName] = useState(null); 
  const currentAccount = useAccount();
  const { walletProvider } = useAppKitProvider();
  
  const [web3, setWeb3] = useState(null);
  const [account_, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState('0');
  
  const [questData, setQuestData] = useState(null);
  const [error, setError] = useState(null);
  
  const [ownedReferralTicket, setOwnedReferralTicket] = useState("Referral Code");
  const [telegramId, setTelegramId] = useState("0");
  const [heriticsConverted, setHeriticsConverted] = useState('Loading');
  const [followTelegram, setFollowTelegram] = useState(false);
  const [joinTelegramGroup, setJoinTelegramGroup] = useState(false);
  const [joinDiscordChannel, setJoinDiscordChannel] = useState(false);
  const [airdropClaimed, setAirdropClaimed] = useState('0');
  const [questsCompleted, setQuestsCompleted] = useState(false);

  // CLIENT STATUS *****************************************************************

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTelegramUserName = localStorage.getItem('telegramUserName');
      setTelegramUserName(storedTelegramUserName);
    }
  }, []);

  // WEB 3 INSTANCE *****************************************************************

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new ethers.BrowserProvider(window.ethereum);
        setWeb3(web3Instance);

        try {
          const accounts = await web3Instance.send("eth_requestAccounts", []);
          setAccount(accounts[0]);
        } catch (error) {
          console.error('User denied account access');
        }
      } else {
        console.error('No Ethereum interface detected');
      }
    };

    loadWeb3();
  }, []);

  // RETRIEVE PRIMARIS BALANCE

  const result = useBalance({
    address: currentAccount.address,
    token: process.env.NEXT_PUBLIC_PRIMARIS_TOKEN_ADDRESS, 
  })

  useEffect(() => {
    if (result?.data) {
      setTokenBalance(ethers.formatUnits(result.data.value, 18));
    }
  }, [result?.data]);


  // GET QUEST STATUS FROM BACKEND

  const fetchQuestStatus = async () => {
    try {
      const response = await axios.get(`https://airdrop-primaris-server.vercel.app/api/getUser/getUser/${telegramUserName}`);
      setTelegramId(response.data.telegramUserId);
      setFollowTelegram(response.data.followTelegram);
      setOwnedReferralTicket(response.data.ownedReferralTicket);
      setHeriticsConverted(response.data.heriticsConverted);
      setJoinTelegramGroup(response.data.joinTelegramGroup);
      setJoinDiscordChannel(response.data.joinDiscordChannel);
      setAirdropClaimed(response.data.airdropClaimed);
      setQuestsCompleted(response.data.questsCompleted);
      setQuestData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // EXECUTE QUESTSTATUS 

  useEffect(() => {
    if (telegramUserName) {
      fetchQuestStatus();
    }
  }, [telegramUserName]);
  
  // CLAIMREWARD FUNCTION ******************************************************************
  
  const airdropAddress = process.env.NEXT_PUBLIC_AIRDROP_ADDRESS;
  const telegramId_ = Number(telegramId);
  const airdropAbi = AirdropAbi;
  const heriticsConverted_ = Number(heriticsConverted);

// Llamada para firmar la transacción
const { writeContractAsync, data: transactionHash, loading: isLoading, error: error_ } = useWriteContract({
  address: airdropAddress,
  abi: airdropAbi,
  functionName: 'claimTokens',
  args: [
    telegramId_,
    followTelegram,
    joinTelegramGroup,
    joinDiscordChannel,
    heriticsConverted_,
    questsCompleted
  ],
  mode: 'prepared', // Mantén el modo 'prepared' si necesitas la firma antes de enviar
});

const claimReward = async (e) => {
  e.preventDefault();
  console.log('Button clicked, claimReward function called');
  try {
    if (!walletProvider) {
      console.error("No wallet provider detected");
      return;
    }

    // Asegúrate de que el proveedor está activo antes de firmar
    const transaction = await writeContractAsync();
    console.log('Transacción enviada: ', transaction);
  } catch (error) {
    console.error('Error en la firma de la transacción:', error);
  }
};


// Esperar a que la transacción sea confirmada
const { isLoading: isPending, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
  hash: transactionHash,
  loading: isLoading
});

  return (
    <ProtectedRoute>
      <PageBackground>
        <Navbar />
        <HomeContent 
          questData={questData} 
          tokenBalance={tokenBalance} 
          telegramUserName={telegramUserName}
          ownedReferralTicket={ownedReferralTicket}
          heriticsConverted={heriticsConverted}
          followTelegram={followTelegram}
          joinTelegramGroup={joinTelegramGroup}
          joinDiscordChannel={joinDiscordChannel}
          airdropClaimed={airdropClaimed}
          questsCompleted={questsCompleted} 
          onClaimReward={claimReward}  
          isPending={isPending}
          hash={transactionHash}
          isConfirming={isPending}
          isConfirmed={isConfirmed}
          error={error_}
        />
      </PageBackground>
    </ProtectedRoute>
  );
}

function HomeContent({ 
  tokenBalance, 
  telegramUserName,
  ownedReferralTicket,
  heriticsConverted,
  followTelegram,
  joinTelegramGroup,
  joinDiscordChannel,
  airdropClaimed,
  questsCompleted,
  onClaimReward,
  isPending,
  hash,
  isConfirming,
  isConfirmed,
  error
}) {
  const [copySuccess, setCopySuccess] = useState('');

  const calculateAditionalReward = (heriticsConverted) => {
    let rewardPercentage = 0;

    if (heriticsConverted >= 10) {
        rewardPercentage = 100; // +100%
    } else if (heriticsConverted >= 8) {
        rewardPercentage = 75;  // +75%
    } else if (heriticsConverted >= 6) {
        rewardPercentage = 50;  // +50%
    } else if (heriticsConverted >= 4) {
        rewardPercentage = 25;  // +25%
    } else {
        rewardPercentage = 0;   // No bonus
    }

    return rewardPercentage;
  };

  const aditionalRewardPercentage = calculateAditionalReward(heriticsConverted);

  const copyToClipboard = () => {
    if (ownedReferralTicket) {
      navigator.clipboard.writeText(ownedReferralTicket)
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
    <OmnilexContainer>
      <TitleImgContainer>
        <TitleImg src={"/Assets/Words/heretics.png"} alt="Omnilex" />
      </TitleImgContainer>
      <Userdata>
        <Username>{telegramUserName}</Username>
        <Balance>$PRIMARIS Balance: {tokenBalance}</Balance>
        <Balance>Claimed Times: {airdropClaimed}</Balance>
        <Balance>Aditional Reward {aditionalRewardPercentage + '%'}</Balance>
        <ReferalCode>Referral Code: {ownedReferralTicket ? ownedReferralTicket : 'Loading...'}
          <CopyButton onClick={copyToClipboard}>
            {copySuccess ? copySuccess : 'Copy'}
          </CopyButton>
        </ReferalCode>
      </Userdata>
      <OmnilexImgContainer>
        <OmnilexImg src={"/Assets/Images/airdrop.png"} alt="Omnilex" />
      </OmnilexImgContainer>
      
          
      <ClaimForm>
        <ClaimButtonCont>
        <ClaimButton_ 
          onClick={onClaimReward} 
          disabled={isPending} 
          type="button" 
        />
        </ClaimButtonCont>
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>} 
        {isConfirmed && <div>Reward claimed!</div>} 
        {error && <div>Error: {error?.shortMessage}</div>}
      </ClaimForm>
      <RewardInfoContainer>
        <RewardInfoPanel src={"/Assets/Images/QUEST.png"} alt="reward" $completed={questsCompleted}/>
        <QuestInfo>
          <Quest>Telegram Announcements: {followTelegram ? 'Complete ✅' : 'Not Complete 🔴'}</Quest>
          <Quest>Telegram Group: {joinTelegramGroup ? 'Complete ✅' : 'Not Complete 🔴'}</Quest>
          <Quest>Discord Channel: {joinDiscordChannel ? 'Complete ✅' : 'Not Complete 🔴'}</Quest>
          <Quest>Heretics Converted: {heriticsConverted >= 2 ? '('+heriticsConverted+') Complete ✅' : '('+heriticsConverted+') Not Complete 🔴'}</Quest>
          <Quest>Quest Complete: {questsCompleted ? 'Complete ✅' : 'Not Complete 🔴'}</Quest>
        </QuestInfo>
      </RewardInfoContainer>
    </OmnilexContainer>
  );
}

const ClaimForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 200px;
  
`;

// Estilos actualizados

const Userdata = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 20px;
  color: white;
`;

// Estilo para el nombre de usuario
const Username = styled.div`
  font-size: 24px; /* Tamaño más grande para el nombre de usuario */
  font-weight: bold;
  color: #8D51CF;
  margin-bottom: 8px;
`;

// Estilo para el balance de $PRIMARIS
const Balance = styled.div`
  font-size: 18px; /* Tamaño más pequeño para el balance */
  color: #cccccc; /* Color más tenue */
`;

const ReferalCode = styled.div`
  font-size: 16px; /* Tamaño más pequeño para el balance */
  color: #8D51CF;
  display: inline-block;
`;

const CopyButton = styled.button`
  margin-left: 8px;
  font-size: 10px;
  background-color: rgba(0,0,0,0);
  border: 1px solid #8D51CF;
  border-radius: 2px;
  color: #8D51CF;
  padding: 5px 5px;
  cursor: pointer;
`;

const PageBackground = styled.div`
    background-color: #000000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Cambiado de center a flex-start para que el contenido comience después del navbar */
    width: 100%;
    min-height: 100vh;

    @media (max-width: 991px) {

    }  
`;

const OmnilexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%; /* Cambiado a 100% para evitar desbordamientos */
  height: auto; /* Ajustamos para que crezca en lugar de tener una altura fija */
  padding: 20px; 
  box-sizing: border-box; 
  position: relative;

  @media (max-width: 479px) {
    width: 100%;
  }
`;

const TitleImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* Asegura que ocupe todo el ancho disponible */
  height: auto; /* Hacemos que crezca automáticamente */
  padding: 0;
  position: relative;

  @media (max-width: 479px) {
    width: 100%; /* Para móviles, que ocupe el 100% del ancho */
  }
`;


const TitleImg = styled.img`
    max-width: 80%;  
    height: auto%;
    position: relative; 
`;

const OmnilexImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* Asegura que ocupe todo el ancho disponible */
  height: auto; /* Hacemos que crezca automáticamente */
  padding: 0;
  position: relative;

  @media (max-width: 479px) {
    width: 100%; /* Para móviles, que ocupe el 100% del ancho */
  }
`;


const OmnilexImg = styled.img`
    max-width: 100%;  
    max-height: 100%;
    position: relative; 
`;

// REWARD INFO STYLES *****************************************************

const RewardInfoContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  height: auto;

  @media (min-width: 1200px) and (max-width: 1400px) {
    width: 30%;
    bottom: 1%;
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    width: 30%;
  }

  @media (min-width: 768px) and (max-width: 991px) {
    width: 35%;
  }

  @media (min-width: 480px) and (max-width: 767px) {
    width: 50%;
    bottom: 5%;
  }

  @media (max-width: 479px) {
    width: 100%;
    bottom: 0%;
  }
`;

const RewardInfoPanel = styled.img`
  width: 100%;
  height: auto;
  opacity: ${props => (props.completed ? 1 : 0.5)};
  transition: opacity 0.3s ease-in-out;
  position: relative;
  z-index: 1;
`;

// Contenedor de la información de las quests
const QuestInfo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 90%;
  height: 100%;
  padding-left: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  color: white;
  z-index: 2; /* Superponer sobre la imagen */
`;

// Se ajustan los estilos para los textos de las quests
const Quest = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
  margin-left: 5px;
`;

const ClaimButtonCont = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 60%;
  left: 20%;
  display: flex;
  cursor: pointer;
  @media (min-width: 1200px) and (max-width: 1400px) {
    width: 30%;
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    width: 25%;
    bottom: 0%;
  }

  @media (min-width: 768px) and (max-width: 991px) {
    width: 30%;
    bottom: 2%;
  }

  @media (min-width: 480px) and (max-width: 767px) {
    width: 30%;
  }

  @media (max-width: 479px) {
    
  }
`;
