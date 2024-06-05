"use client"

import '@aarc-dev/auth-widget/dist/style.css';
import { AarcEthersSigner, OpenAuthProvider } from "@aarc-dev/ethers-v6-signer";
import '@aarc-xyz/wallet-manager/dist/style.css';
import { ethers } from 'ethers';
import { useEffect, useState } from "react";
import useSafeCreate from "../../hooks/useSafeCreate";

// declare global window;
declare global {
    interface Window {
        ethereum?: any
    }
}

export default function Home() {
    const [sessionKey, setSessionKey] = useState<string>('');
    const [existingSafeAddress, setExistingSafeAddress] = useState<string>('');
    const [authData, setAuthData] = useState<any>({});
    const [originChain, setOriginChain] = useState<number>(0);
    const [destChain, setDestChain] = useState<number>(0);
    const hookSafe = useSafeCreate();

    const provider = new ethers.BrowserProvider(window.ethereum);
    let signer: AarcEthersSigner;

    useEffect(() => {
        const setupSigner = async () => {
            const userSessionKey = localStorage.getItem('sessionKey');
            const authData = localStorage.getItem('authData');
            console.log("authData and sessionKey ", authData, userSessionKey);
            if (userSessionKey && authData) {
                setSessionKey(userSessionKey)
                setAuthData(JSON.parse(authData));
                const network = await provider.getNetwork();
                setDestChain(Number(network.chainId));
                signer = new AarcEthersSigner(provider,
                    {
                        provider: OpenAuthProvider.GOOGLE,
                        session_identifier: "",
                        apiKeyId: '',
                        wallet_address: '',
                        sessionKey: sessionKey,
                        chainId: Number(network.chainId)
                    }
                );
            } else {
                alert("Mint and authenticate your pkp using Open Auth");
            }
        }
        setupSigner();
    }, []);

    const handleSubmit = async (e: any) => {
        const safe = await hookSafe.createNewSafe(signer, 137, 1);
        console.log("safe created ", safe);
    };

    const regerateSafe = async (e: any) => {
        console.log("getting data to regenrate safe");
        const response = await hookSafe.regerateSafe(signer, originChain, destChain, existingSafeAddress);
        console.log("response ", response);
    }

    return (
        <>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100vh',
                padding: '2rem',
            }} >
                <button onClick={handleSubmit}>Create new Safe</button>

                <br></br><br />
                <h1>Regenrate wallet</h1>
                <br></br>
                <form onSubmit={regerateSafe}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="originChain">Origin Chain</label>
                        <input
                            type="number"
                            id="originChain"
                            name="originChain"
                            onChange={(e: any) => { setOriginChain(e) }}
                            style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="previousWallet">Previous Safe Wallet Address</label>
                        <input
                            type="text"
                            id="previousWallet"
                            name="previousWallet"
                            value={existingSafeAddress}
                            onChange={(e: any) => { setExistingSafeAddress(e) }}
                            style={{ display: 'block', width: '100%', padding: '0.5rem' }}
                            required
                        />
                    </div>
                    <button type="submit" style={{ padding: '0.5rem 1rem' }}>Regenrate safe</button>
                </form>
            </div>
        </>
    )
}
