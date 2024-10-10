import React, { useState, useEffect } from 'react';
import { getPrimarisBalance, sendTransaction, estimateGas } from '@/app/handlers/primarisContractHandler';
import { sendTransactionPol, estimateGasPol } from '@/app/handlers/polContractHandler';
import { useWeb3 } from '@/app/context/web3Context';
import styled from 'styled-components';
import GetKeyTab from './getKeyTab';

const ModalBackground = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #0b0d10;
  display: flex;
  flex-direction: column;  
  align-items: center; 
  gap: 3px;  // Espacio entre los elementos
  color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  height: 520px;
`;

const UserName = styled.div`
  font-size: 25px;
  color: rgba(141, 81, 207, 1);
  margin-top: 10px;
`;

const Address = styled.div`
  font-size: 14px;
  color: rgba(225,225,225,0.7);
`;

const CloseButton = styled.button`
  background-color: none;
  position: absolute;
  right: -5px;
  top: -15px;
  color: rgba(225,225,225,0.5);
  border: none;
  padding: 2px;
  cursor: pointer;
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

const CopyButton = styled.button`
  margin-left: 8px;
  width: 25px;
  height: auto;
  background-color: none;
  border-radius: 2px;
  padding: 5px 5px;
  cursor: pointer;
`;

const Balance = styled.div`
  font-size: 30px;
  color: rgba(225,225,225,0.5);
  height: 45px;
  position: relative;
    coin{
      color: rgba(141, 81, 207, 1)
    }
`;

const ChangeButton = styled.button`
  position: relative;
  width: 25px;
  height: auto;
  background-color: none;
  padding-left: 5px;
  cursor: pointer;
`;

const ButtonsContainer = styled.div`
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  width: 60%; 
  background-color: transparent; 
  padding: 5px; 
`;

const OptionsButton = styled.button`
  width: 40px; 
  height: auto;
  background-color: transparent; 
  cursor: pointer;
  border: none; 
  outline: none; 
`;

const TransactionsContainer = styled.div`
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;;
    flex-direction: column;
    margin-top: 30px;  
    border-left: 1px solid rgba(225,225,225,0.2);
    border-right: 1px solid rgba(225,225,225,0.2);
    border-radius: 10px;
`;

const PrivateKeyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  color: rgba(225, 225, 225, 0.9);
  
`;

const SendTokensForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  color: rgba(225, 225, 225, 0.9);

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: #8D51CF;
  }

  input {
    width: 100%;
    padding: 5px;
    margin: 5px 0;
    border-radius: 5px;
    border: 1px solid #8D51CF;
    background-color: transparent;
    color: white;
    font-size: 12px;
  }

  input::placeholder {
    color: rgba(225, 225, 225, 0.5);
  }

  button {
    background-color: #8D51CF;
    border: none;
    padding: 5px 5px;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    font-size: 12px;
    margin-top: 10px;
    width: 100%;
  }

  button:hover {
    background-color: rgba(141, 81, 207, 0.8);
  }
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 5px;
`;

const MaxButton = styled.button`
  background-color: #8D51CF;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
`;

const GasEstimator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  color: rgba(225, 225, 225, 0.9);
  h3 {
    font-size: 20px;
    margin-bottom: 7px;
    color: #8D51CF;
  }
  div {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  p {
    font-size: 14px;
    color: (225,225,225,0.8);
    span{
    color: #8D51CF; 
    }
  }
  button {
    background-color: #8D51CF;
    border: none;
    padding: 5px 5px;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    font-size: 12px;
    margin-top: 10px;
    width: 100%;
  }
  button:hover {
    background-color: rgba(141, 81, 207, 0.8);
  }
`;

// UTILS ******************************************************************

const formatPublicKey = (publicKey) => {
if (!publicKey) return '';
const firstPart = publicKey.substring(0, 5);
const lastPart = publicKey.substring(publicKey.length - 6);
return `${firstPart}...${lastPart}`;
};


const Modal = ({ show, handleClose, telegramUserName, publicKey, balance }) => {
  const { provider } = useWeb3();
    
  // Modal states
  const [copySuccess, setCopySuccess] = useState('');
  const [showCoin, setShowCoin] = useState(false);
  const [primarisBalance, setPrimarisBalance] = useState(0.000);
  const [action, setAction] = useState(0);
  const [amount, setAmount] = useState(0.000);
  const [destination, setDestination] = useState('');

  // Sending tokens states
  const [estimatedGas, setEstimatedGas] = useState(null);
  const [totalGasCost, setTotalGasCost] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [receivedHash, setReceivedHash] = useState (" ");

  // RETRIEVE PRIMARIS BALANCE ******************************************************

  useEffect(() => {
    const fetchPrimarisBalance = async () => {
        if (provider && provider != null && publicKey && publicKey != null) {
            try {
                const balanceInPrimaris = await getPrimarisBalance(publicKey, provider);
                setPrimarisBalance(balanceInPrimaris);
            } catch (error) {
                console.error('Error al obtener el balance:', error);
            }
        }
    };

    fetchPrimarisBalance();
  }, [provider, publicKey]);

  // TRANSACTIONS PRIMARIS ***********************************************************************************************

  const handleEstimateGas = async () => {
    if (!telegramUserName || !destination || !amount) {
        alert('Por favor, asegúrate de que todos los campos estén completos.');
        return;
    }

    try {
        setLoading(true);
        const { estimatedGas, totalGasCost } = await estimateGas(telegramUserName, destination, amount);
        setEstimatedGas(estimatedGas);
        setTotalGasCost(totalGasCost);
        console.warn("PRUEBAAA: " +  estimatedGas + totalGasCost);
        setShowConfirmation(true); // Muestra el modal de confirmación
    } catch (error) {
        console.error('Error al estimar el gas:', error);
        alert('Hubo un error al estimar el gas. Por favor, intenta de nuevo.');
    } finally {
        setLoading(false);
    }
  };

  const handleConfirmTransaction = async () => {
    try {
        setLoading(true);
        const { success, txHash } = await sendTransaction(telegramUserName, destination, amount);
        setTransactionStatus(success);
        setShowConfirmation(false);
        setReceivedHash(txHash);
    } catch (error) {
        console.error('Error al enviar la transacción:', error);
        alert('Hubo un error al enviar la transacción. Por favor, intenta de nuevo.');
    } finally {
        setLoading(false);
    }
  };

  // TRANSACTION POL **********************************************************

  const handleEstimateGasPol = async () => {
    if (!telegramUserName || !destination || !amount) {
        alert('Por favor, asegúrate de que todos los campos estén completos.');
        return;
    }

    try {
        setLoading(true);
        const { estimatedGas, totalGasCost } = await estimateGasPol(telegramUserName, destination, amount);
        setEstimatedGas(estimatedGas);
        setTotalGasCost(totalGasCost);
        console.warn("PRUEBAAA: " +  estimatedGas + totalGasCost);
        setShowConfirmation(true); // Muestra el modal de confirmación
    } catch (error) {
        console.error('Error al estimar el gas:', error);
        alert('Hubo un error al estimar el gas. Por favor, intenta de nuevo.');
    } finally {
        setLoading(false);
    }
  };

  const handleConfirmTransactionPol = async () => {
    try {
        setLoading(true);
        const { success, txHash } = await sendTransactionPol(telegramUserName, destination, amount);
        setTransactionStatus({ success, txHash });
        setShowConfirmation(false); // Cierra el modal de confirmación
    } catch (error) {
        console.error('Error al enviar la transacción:', error);
        alert('Hubo un error al enviar la transacción. Por favor, intenta de nuevo.');
    } finally {
        setLoading(false);
    }
  };

  // UTILS *******************************************************************************

  const handleCancel = () => {
    setShowConfirmation(false);
    setAction(1);
    setEstimatedGas(null);
    setTotalGasCost(null);
  };

  const handleSendTokens = () => {
    console.log("EL VALOR DE SHOW COIN ESSSSSSS: " + showCoin);
    if (!showCoin){
      handleEstimateGas();
    } else if (showCoin){
      handleEstimateGasPol();
    }
    setAction(3);
  };

  const handleMaxAmount = () => {
    if (showCoin) {
      setAmount(balance);
    } else {
      setAmount(primarisBalance);
    }
  };

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

  function formatBalance(number) {
    const value = Number(number);
    return value.toFixed(6).replace(/(\.0+|0+)$/, '');
  }

  const changeToken = () => {
      setShowCoin((prevState) => !prevState);
      setAction(1);
  };

  // BUTTONS ACTIONS ****************************************************************************************

  const setSendScreen = () => {
      setAction(1);
  };

  const setKeyScreen = () => {
      setAction(2);
  };

  const setScanPublicKey = (publicKey) => {
      window.location.href = `https://polygonscan.com/address/${publicKey}`;
  };

  const resetStates = () => {
    setAction(0);
    setAmount(0.000);
    setDestination('');
    setEstimatedGas(null);
    setTotalGasCost(null);
    setShowConfirmation(false);
    setLoading(false);
    setTransactionStatus(null);
  };

  const closeModal = () => {
    handleClose();
    resetStates();
  };
  
  if (!show) return null;

  return (
    <ModalBackground onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <TitleImgContainer>
            <TitleImg src={"/Assets/Images/metaversalwall.png"} alt="LogoWallet" />
            <CloseButton onClick={closeModal}>x</CloseButton>
        </TitleImgContainer>
        
        <UserName>{telegramUserName}</UserName>
        <Address>{formatPublicKey(publicKey)}
            <CopyButton onClick={copyToClipboard}>
                {copySuccess ? (
                <img src={"/Assets/Buttons/checkIcon.png"} alt="Check Icon" />
                ) : (
                <img src={"/Assets/Buttons/copyIcon.png"} alt="Copy Icon" />
                )}
            </CopyButton>
        </Address>

        <Balance>
            {showCoin ? (
                formatBalance(balance) + " POL"
                ) : (
                formatBalance(primarisBalance) + " PRIMARIS"
            )} 
            <ChangeButton onClick={changeToken}><img src={"/Assets/Buttons/swapicon.png"} alt="Change Icon" /></ChangeButton>
        </Balance>
        
        <ButtonsContainer>
            <OptionsButton onClick={setSendScreen}><img src={"/Assets/Buttons/sendicon.png"} alt="Send" /></OptionsButton>
            <OptionsButton onClick={setKeyScreen}><img src={"/Assets/Buttons/keyicon.png"} alt="Private Key" /></OptionsButton>
            <OptionsButton onClick={() => setScanPublicKey(publicKey)}><img src={"/Assets/Buttons/scanicon.png"} alt="Scan" /></OptionsButton>
        </ButtonsContainer>

        <TransactionsContainer>
          {action === 0 && (
            <p></p>
          )}

          {action === 1 && (
            <SendTokensForm>
              <h3>Send {showCoin ? ' POL' : ' PRIMARIS'}</h3>
              <input 
                type="text" 
                placeholder="destination address" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)} 
              />
              <AmountContainer>
                <input 
                  type="number" 
                  placeholder="amount" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)} 
                />
                <span>{showCoin ? 'POL' : 'PRIMARIS'}</span>
                <MaxButton onClick={handleMaxAmount}>max</MaxButton>
              </AmountContainer>
              <button onClick={handleSendTokens}>send</button>
            </SendTokensForm>
          )}

          {action === 2 && (
            <PrivateKeyContainer>
              <GetKeyTab telegramUserName={telegramUserName} action={action}/>
            </PrivateKeyContainer>
          )}

          {showConfirmation && action === 3 && (
          <GasEstimator>
            <h3>Sign Request</h3>
            <div>
            <p>Sending <span>{showCoin ? 'POL' : 'PRIMARIS'}</span> to <span>{formatPublicKey(destination)}</span></p>
            <p>Estimated gas: <span>{estimatedGas}</span> wei</p>
            <p>Fee to pay: <span>{totalGasCost}</span> POL</p>
            </div>
            <button onClick={() => showCoin ? handleConfirmTransactionPol() : handleConfirmTransaction()} disabled={loading}>
              {loading ? 'Sending...' : 'Confirm'}
            </button>
            <button onClick={handleCancel} disabled={loading}>Cancel</button>
          </GasEstimator>
        )}

          {transactionStatus && (
            <div>
                {transactionStatus ? (
                    <p>Your tokens has been send!</p>
                ) : (
                    <p>Send error</p>
                )}
            </div>
        )}
        </TransactionsContainer>
      </ModalContent>
    </ModalBackground>
  );
};


export default Modal;
