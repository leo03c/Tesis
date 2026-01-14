'use client';

import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '@/contexts/UserContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </UserProvider>
    </SessionProvider>
  );
}