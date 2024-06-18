'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from 'react';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [authorized, setAuthorized] = useState(false);


  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html >
  );
}
