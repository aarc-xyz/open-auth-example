"use client"

import '@aarc-xyz/auth-widget/dist/style.css';
import { AarcEthersSigner } from "@aarc-xyz/ethers-v6-signer";
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
    const [authData, setAuthData] = useState<any>();
    const [originChain, setOriginChain] = useState<number>(0);
    const [destChain, setDestChain] = useState<number>(0);
    const hookSafe = useSafeCreate();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || '';
    let signer: AarcEthersSigner;

    useEffect(() => {
        const setupSigner = async () => {
            const userSessionKey = localStorage.getItem('sessionKey');
            const userdata = localStorage.getItem('authData');
            if (userSessionKey && userdata) {
                setSessionKey(userSessionKey)
                setAuthData(JSON.parse(userdata));
                const network = await provider.getNetwork();
                setDestChain(Number(network.chainId));
                signer = new AarcEthersSigner(rpcUrl,
                    {
                        apiKeyId: process.env.NEXT_PUBLIC_AARC_API_KEY || '',
                        wallet_address: authData?.address,
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

    const regenerateSafe = async (e: any) => {
        console.log("getting data to regenrate safe");
        const response = await hookSafe.regenerateSafe(signer, originChain, destChain, existingSafeAddress);
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
                <h1>Regenerate wallet</h1>
                <br></br>
                <form onSubmit={regenerateSafe}>
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
                    <button type="submit" style={{ padding: '0.5rem 1rem' }}>Regenerate safe</button>
                </form>
            </div>
        </>
    )
}