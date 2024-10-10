'use client'

import React, { useState, useEffect } from 'react';
import { getPrimarisBalance } from '@/app/handlers/primarisContractHandler';
import { useWeb3 } from '@/app/context/web3Context';
import axios from 'axios';
import styled from "styled-components";
import Navbar from '@/app/components/Navbar';
import ClaimButton_ from '@/app/components/ClaimButton';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { ClaimRequest } from '../handlers/airdropHandler';


export default function Main() {

  // STATE VARIABLES

  const { provider } = useWeb3();
  const [telegramUserName, setTelegramUserName] = useState(null); 
  
  const [publicKey, setPublicKey] = useState(null);
  const [primarisBalance, setPrimarisBalance] = useState('0');
  
  const [questData, setQuestData] = useState(null);
  const [error, setError] = useState(null);
  
  const [ownedReferralTicket, setOwnedReferralTicket] = useState("Referral Code");
  const [heriticsConverted, setHeriticsConverted] = useState('Loading');
  const [followTelegram, setFollowTelegram] = useState(false);
  const [joinTelegramGroup, setJoinTelegramGroup] = useState(false);
  const [joinDiscordChannel, setJoinDiscordChannel] = useState(false);
  const [airdropClaimed, setAirdropClaimed] = useState('0');
  const [questsCompleted, setQuestsCompleted] = useState(false);

  const [transactionStatus, setTransactionStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // CLIENT STATUS *****************************************************************

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTelegramUserName = localStorage.getItem('telegramUserName');
      setTelegramUserName(storedTelegramUserName);
  
      if (storedTelegramUserName) {
        checkWallet(storedTelegramUserName); // Llamar a checkWallet con storedTelegramUserName
      }
    }
  }, []);

  const checkWallet = async (telegramUserName) => {

    console.warn("USERNAMEEE EN PAGEEEE" + telegramUserName);
    
    try {
      const response = await axios.post('http://localhost:5000/api/wallet/checkWallet', {
        telegramUserName: telegramUserName,
      });

      if (response.data.publicKey) {
        setPublicKey(response.data.publicKey);
      } else {
        setPublicKey(null);
        console.warn("PUBLIC KEYYYYYYYYY " + response.data.publicKey)
      }
    } catch (error) {
      console.error('Error al verificar la wallet:', error);
    }
  };

  // RETRIEVE PRIMARIS BALANCE ******************************************************

  useEffect(() => {
    const fetchBalance = async () => {
        if (provider && provider != null && publicKey && publicKey != null) {
            try {
                const balanceInPrimaris = await getPrimarisBalance(publicKey, provider);
                setPrimarisBalance(balanceInPrimaris);
            } catch (error) {
                console.error('Error al obtener el balance:', error);
            }
        }
    };

    fetchBalance();
  }, [provider, publicKey]);

  // GET QUEST STATUS FROM BACKEND

  const fetchQuestStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/getUser/getUser/${telegramUserName}`);
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
  
  const handleClaim = async () => {
    setLoading(true);
    setError(null);

    try {
        const { success, message, txHash } = await ClaimRequest(telegramUserName);

        if (success) {
            setTransactionStatus(`Successful claim!`);
        } else {
            setTransactionStatus(`Failed claim: ${message}`);
        }
    } catch (error) {
        console.error('Claiming error:', error);
        setError('Claiming error, please try again.');
    } finally {
        setLoading(false);
    }
};

  return (
    <ProtectedRoute>
      <PageBackground>
        <Navbar telegramUserName={telegramUserName}/>
        <HomeContent 
          questData={questData} 
          tokenBalance={primarisBalance} 
          telegramUserName={telegramUserName}
          ownedReferralTicket={ownedReferralTicket}
          heriticsConverted={heriticsConverted}
          followTelegram={followTelegram}
          joinTelegramGroup={joinTelegramGroup}
          joinDiscordChannel={joinDiscordChannel}
          airdropClaimed={airdropClaimed}
          questsCompleted={questsCompleted} 

          handleClaim={handleClaim}
          loading={loading} 
          transactionStatus={transactionStatus}
          error={error}
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
  handleClaim,
  loading,
  transactionStatus,
  error,

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
            {copySuccess ? (
              <img src={"/Assets/Buttons/checkIcon.png"} alt="Check Icon" />
            ) : (
              <img src={"/Assets/Buttons/copyIcon.png"} alt="Copy Icon" />
            )}
          </CopyButton>
        </ReferalCode>
      </Userdata>
      <OmnilexImgContainer>
        <OmnilexImg src={"/Assets/Images/airdrop.png"} alt="Omnilex" />
      </OmnilexImgContainer>
      
          
      <ClaimContainer>
        <ClaimButtonCont>
          <ClaimButton_ onClick={handleClaim} disabled={loading}/>
        </ClaimButtonCont>
          {loading && <div>Waiting for confirmation...</div>}
          {transactionStatus && <div>{transactionStatus}</div>}
          {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      </ClaimContainer>
      <RewardInfoContainer>
        <RewardInfoPanel src={"/Assets/Images/QUEST.png"} alt="reward" completed={questsCompleted}/>
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

const ClaimContainer = styled.div`
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
  font-size: 24px; 
  font-weight: bold;
  color: #8D51CF;
  margin-bottom: 8px;
`;

// Estilo para el balance de $PRIMARIS
const Balance = styled.div`
  font-size: 18px; 
  color: #cccccc; 
`;

const ReferalCode = styled.div`
  font-size: 16px; 
  color: #8D51CF;
  display: inline-block;
`;

const CopyButton = styled.button`
  margin-left: 8px;
  font-size: 10px;
  width: 25px;
  height: auto;
  background-color: none;
  border-radius: 2px;
  padding: 5px 5px;
  cursor: pointer;
`;

const PageBackground = styled.div`
    background-color: #000000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; 
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
  width: 100%; 
  height: auto; 
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
  width: 100%; 
  height: auto; 
  padding: 0;
  position: relative;

  @media (max-width: 479px) {
    width: 100%; 
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
  width: 100%; 
  height: auto; 
  padding: 0;
  position: relative;

  @media (max-width: 479px) {
    width: 100%; 
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
  z-index: 2; 
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
