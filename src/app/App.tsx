"use client"

import { useAuthWidget, useWallet } from "@aarc-xyz/auth-widget";
import '@aarc-xyz/auth-widget/dist/style.css';
import { useEffect, useState } from "react";
import { CHAIN_ID } from "./constants";
import Wallets from '@aarc-xyz/wallet-auth';
import { Provider } from '@aarc-xyz/auth-widget';
import dynamic from 'next/dynamic'
const DynamicComponentWithNoSSR = dynamic(
    () => import('@aarc-xyz/wallet-auth'),
    { ssr: false }
)

export default function App() {
    const [data, setData] = useState(null);
    const config = {
        Wallet: function Wallet(props: any) {
            if (typeof window !== "undefined")
                return <DynamicComponentWithNoSSR {...props} />
            else
                return null;
        },
        appearance: {
            logoUrl: "https://dashboard.aarc.xyz/assets/AuthScreenLogo-CNfNjJ82.svg",
            themeColor: "#2D2D2D",
            darkMode: false,
            textColor: "white",
        },
        callbacks: {
            onSuccess: (data: any) => {
                // console.log("Success ", data.data.key);
                // window.location.reload();
                console.log(data, "onSuccess")
                setData(data)
                // openAuthWidget();

            },
            onError: (data: any) => {
                console.log("onError", data)
            },
            onClose: (data: any) => {
                console.log("onClose", data)
            },
            onOpen: (data: any) => {
                console.log("onOpen", data)
            }
        },
        authMethods: ['email', 'wallet'],
        socialAuth: ['google'],
        aarc_api_key: process.env.NEXT_PUBLIC_AARC_API_KEY,
        chainId: 11155111,
    }

    return (
        <div>
            <Provider config={config}>
                {data ? <div
                    style={{
                        width: "60%",
                        margin: "auto",
                    }}
                >{JSON.stringify(data)}</div> : <Home />}
            </Provider>
        </div>
    )

}

function Home() {
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

    const handleSubmit = async (e: any) => {
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
                        <div style={{ marginBottom: '1rem', color: "black" }}>
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
                        <div style={{ marginBottom: '1rem', color: "black" }}>
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
