'use client';

import { SessionProvider } from 'next-auth/react';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </SessionProvider>
  );
}