"use client";

import { useState, useEffect, useCallback } from 'react';
import type { LibraryItem } from '@/types/api';
import { getLibrary, addToLibrary, updateLibraryItem, removeFromLibrary } from '../api/library';

interface UseLibraryResult {
  library: LibraryItem[];
  isLoading: boolean;
  error: string | null;
  totalHoursPlayed: number;
  installedCount: number;
  addGame: (gameId: number) => Promise<void>;
  removeGame: (id: number) => Promise<void>;
  updateGame: (id: number, data: Partial<LibraryItem>) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useLibrary(): UseLibraryResult {
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLibrary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getLibrary();
      setLibrary(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la librería');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const addGame = async (gameId: number) => {
    try {
      const newItem = await addToLibrary(gameId);
      setLibrary(prev => [...prev, newItem]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al añadir a la librería');
      throw err;
    }
  };

  const removeGame = async (id: number) => {
    try {
      await removeFromLibrary(id);
      setLibrary(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar de la librería');
      throw err;
    }
  };

  const updateGame = async (id: number, data: Partial<LibraryItem>) => {
    try {
      const updated = await updateLibraryItem(id, data);
      setLibrary(prev => prev.map(item => item.id === id ? updated : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el juego');
      throw err;
    }
  };

  const totalHoursPlayed = library.reduce((acc, item) => acc + (item.hours_played || 0), 0);
  const installedCount = library.filter(item => item.installed).length;

  return { 
    library, 
    isLoading, 
    error, 
    totalHoursPlayed,
    installedCount,
    addGame, 
    removeGame, 
    updateGame, 
    refetch: fetchLibrary 
  };
}
