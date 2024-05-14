"use client"

import { Provider, useAuthWidget, useWallet } from "@aarc-dev/auth-widget";
import { useEffect, useState } from "react";
import '@aarc-dev/auth-widget/dist/style.css';
import { CHAIN_ID } from "./constants";

export default function Home() {
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [tokenValue, setTokenValue] = useState('');

  const { openAuthWidget } = useAuthWidget();
  const sendTransaction = useWallet();

  useEffect(() => {
    console.log('Auth widget mounted');
    const sessionKey = localStorage.getItem('sessionKey');
    if (sessionKey) {
      setSessionKey(sessionKey)
    } else {
      openAuthWidget();
      setSessionKey(localStorage.getItem('sessionKey'));
    }
    return () => {
      console.log('Auth widget unmounted')
    }
  }
    , [])

  const handleSubmit = async(e: any) => {
    e.preventDefault();
    console.log('Sending transaction...');
    console.log('Receiver Address:', receiverAddress);
    console.log('Token Value:', tokenValue);
    // Here you can handle sending the transaction
    if (sessionKey) {
      const txn = await sendTransaction(
        {
          to: receiverAddress,
          value: tokenValue
        },
        CHAIN_ID,
        '<Aarc_api_key>'
      )
      console.log("Transaction ", txn);
    } else {
      openAuthWidget();
    }
  };

  return (
    <>
      {sessionKey && <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <div style={{ width: '400px', padding: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: '#fff' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Send Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="receiverAddress">Receiver Address:</label>
              <input
                style={{ marginLeft: "5px", borderRadius: "5px", border: "black 1px solid" }}
                type="text"
                id="receiverAddress"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="tokenValue">Token Value:</label>
              <input
                style={{ marginLeft: "5px", borderRadius: "5px", border: "black 1px solid" }}
                type="number"
                id="tokenValue"
                value={tokenValue}
                onChange={(e) => setTokenValue(e.target.value)}
                required
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>Send Transaction</button>
            </div>
          </form>
        </div>
      </div>}
    </>
  )
}
