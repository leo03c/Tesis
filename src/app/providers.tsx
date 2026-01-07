'use client';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import React from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export default function Providers({ children, session }: { children: React.ReactNode; session?: Session | null }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </UserProvider>
    </SessionProvider>
  );
}