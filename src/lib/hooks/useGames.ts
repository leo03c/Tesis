"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Game, GameFilters, Tag } from '@/types/api';
import { getGames, getGameById, searchGames, getTags, getFeaturedGames, getFreeGames } from '../api/games';

interface UseGamesResult {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseGameResult {
  game: Game | null;
  isLoading: boolean;
  error: string | null;
}

interface UseTagsResult {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
}

// Hook for fetching games list with filters
export function useGames(filters?: GameFilters): UseGamesResult {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getGames(filters);
      setGames(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los juegos');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return { games, isLoading, error, refetch: fetchGames };
}

// Hook for fetching a single game
export function useGame(id: number): UseGameResult {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getGameById(id);
        setGame(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el juego');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  return { game, isLoading, error };
}

// Hook for searching games
export function useGameSearch(query: string): UseGamesResult {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (!query.trim()) {
      setGames([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await searchGames(query);
      setGames(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar juegos');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    search();
  }, [search]);

  return { games, isLoading, error, refetch: search };
}

// Hook for fetching tags
export function useTags(): UseTagsResult {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getTags();
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las categorías');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, isLoading, error };
}

// Hook for featured games
export function useFeaturedGames(): UseGamesResult {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getFeaturedGames();
      setGames(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar juegos destacados');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return { games, isLoading, error, refetch: fetchGames };
}

// Hook for free games
export function useFreeGames(): UseGamesResult {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getFreeGames();
      setGames(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar juegos gratis');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return { games, isLoading, error, refetch: fetchGames };
}
