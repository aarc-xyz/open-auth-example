'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthConfig, { Provider, authMethods, socialAuth } from '@aarc-dev/auth-widget';
import Wallets from '@aarc-xyz/wallet-auth';

const inter = Inter({ subsets: ["latin"] });


const config = {
  Wallet: function Wallet(props: any) {
    return <Wallets {...props} />
  },
  appearance: {
    logoUrl: "https://dashboard.aarc.xyz/assets/AuthScreenLogo-CNfNjJ82.svg",
    themeColor: "#2D2D2D",
    darkMode: false,
  },
  callbacks: {
    onSuccess: (data: any) => {
     console.log("Success ", data);
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
  aarc_api_key: '',
  chainId: 11155111,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider config={config}>
      <body className={inter.className}>{children}</body>
      </Provider>
    </html>
  );
}
