import React from 'react';
import type { Metadata } from 'next';

import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: process.env.SERVICE_NAME
  // description: '',
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/*<Header />*/}
        {children}
      </body>
    </html>
  );
}
