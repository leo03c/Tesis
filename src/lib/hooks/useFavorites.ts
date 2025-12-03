"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Favorite } from '@/types/api';
import { getFavorites, addToFavorites, removeFromFavorites } from '../api/favorites';

interface UseFavoritesResult {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
  addFavorite: (gameId: number) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  isFavorite: (gameId: number) => boolean;
  refetch: () => Promise<void>;
}

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getFavorites();
      setFavorites(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los favoritos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = async (gameId: number) => {
    try {
      const newFavorite = await addToFavorites(gameId);
      setFavorites(prev => [...prev, newFavorite]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al añadir a favoritos');
      throw err;
    }
  };

  const removeFavorite = async (id: number) => {
    try {
      await removeFromFavorites(id);
      setFavorites(prev => prev.filter(fav => fav.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar de favoritos');
      throw err;
    }
  };

  const isFavorite = (gameId: number): boolean => {
    return favorites.some(fav => fav.game.id === gameId);
  };

  return { 
    favorites, 
    isLoading, 
    error, 
    addFavorite, 
    removeFavorite, 
    isFavorite,
    refetch: fetchFavorites 
  };
}
