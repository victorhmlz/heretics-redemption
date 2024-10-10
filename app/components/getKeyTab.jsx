import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { decryptPrivateKey } from '../config/service';

const KeyTab = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 10px;
  width: 100%;
  height: 200px;
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

  button:hover {
    background-color: rgba(141, 81, 207, 0.8);
  }

  div{
    color: rgba(225, 225, 225, 0.5);
    width: 80%;
    height: 100px;
    box-sizing: border-box; 
    padding: 5px;
    overflow: auto;
    word-wrap: break-word;
  }
`;

const CopyButton = styled.button`
    margin-left: 8px;
    width: 25px;
    height: 25px;
    background-color: none;
    border-radius: 2px;
    padding: 5px 5px;
    cursor: pointer;
`;

const MainButton = styled.button`
    background-color: #8D51CF;
    aling-self: bottom;
    border: none;
    padding: 5px 5px;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    font-size: 12px;
    margin-top: 10px;
    width: 100%;
`;

const GetKeyTab = ({ telegramUserName, action }) => {
  const [encryptedKey_, setEncryptedKey_] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [action_, setAction_] = useState(0);
  const [copySuccess, setCopySuccess] = useState('');

  const getKeyHandler = async () => {

    try {

        const response = await axios.post('https://airdrop-primaris-server.vercel.app/api/wallet/getKey', {
            telegramUserName,
            password
        });

        const { success, encryptedKey } = response.data;

        if (success) {
            setEncryptedKey_(encryptedKey);
            setAction_(1);
            setError(null);
        } else {
            setError('Error getting the private key');
        }
    } catch (error) {
        console.error("Error server conection", error);
        setError('Error server');
    }
};

const decryptionProcess = () => {
    if (encryptedKey_) {
        try {
            const decryptedKey = decryptPrivateKey(encryptedKey_);
            setPrivateKey(decryptedKey);
            setShowPrivateKey(true); 
            setAction_(2);
        } catch (error) {
            console.error('Error decrypting:', error);
            setError('Error desencriptando clave privada.');
        }
    }
};

const copyToClipboard = () => {
    if (privateKey) {
        navigator.clipboard.writeText(privateKey)
        .then(() => {
            setCopySuccess('¡Copied!');
            setTimeout(() => setCopySuccess(''), 2000); 
        })
        .catch(err => {
            setCopySuccess('Error');
        });
    }
};

useEffect(() => {
    return () => {
        setPrivateKey(null);
        setEncryptedKey_(null);
        setPassword('');
        setShowPrivateKey(false);
        setAction_(0);
    };
}, []);

return (
    <KeyTab>
        {action_ === 0 && (
            <>
                <h3>Get Private Key</h3>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <MainButton onClick={getKeyHandler}>Validate</MainButton>
            </>
        )}

        {action_ === 1 && (
            <>
                <h3>Keep your private key safe, or your funds may be at risk. Do you want to continue?</h3>
                <MainButton onClick={decryptionProcess}>Reveal Key</MainButton>
            </>
        )}

        {action_ === 2 && (
            <>
                <h3>Your Private Key</h3>
                <div>
                    {showPrivateKey ? privateKey : '************************'}
                </div>
                <CopyButton onClick={copyToClipboard}>
                        {copySuccess ? (
                        <img src={"/Assets/Buttons/checkIcon.png"} alt="Check Icon" />
                        ) : (
                        <img src={"/Assets/Buttons/copyIcon.png"} alt="Copy Icon" />
                        )}
                </CopyButton>
                <MainButton onClick={() => setShowPrivateKey(!showPrivateKey)}>
                    {showPrivateKey ? 'Hide' : 'Show'}
                </MainButton>
            </>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
    </KeyTab>
);
};

export default GetKeyTab;