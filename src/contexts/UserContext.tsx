'use client';

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface UserContextType {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  provider?: string;
  refreshSession: (data?: { image?: string }) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();

  // Debug: Ver qué datos llegan
  React.useEffect(() => {
    console.log('UserProvider - Session:', session);
    console.log('UserProvider - Status:', status);
  }, [session, status]);

  const refreshSession = useCallback(async (data?: { image?: string }) => {
    try {
      console.log('Refreshing session...', data);
      const updated = await update(data);
      console.log('Session refreshed:', updated);
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }, [update]);

  const value: UserContextType = {
    user: session?.user || null,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    provider: session?.provider,
    refreshSession,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}