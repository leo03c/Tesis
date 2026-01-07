/**
 * Game IDs Constants
 * 
 * These IDs should match the game IDs in the backend database.
 * For demo purposes, we're using hardcoded IDs that map to our mock data.
 * 
 * TODO: Replace with actual IDs from the backend when integrating with real API
 */

export const GAME_IDS = {
  // Featured Games (Tienda)
  LEAGUE_OF_LEGENDS: 1,
  GOD_OF_WAR: 2,
  CYBERPUNK_2077: 3,
  CONTROL: 4,
  HOGWARTS_LEGACY: 5,
  ELDEN_RING: 6,
  
  // Free Games (Juegos Gratis)
  CAT_QUEST_II: 7,
  CAT_QUEST_III: 8,
  CAT_QUEST_IV: 9,
  ARCADEGEDDON: 10,
  RIVER_CITY_GIRLS: 11,
} as const;

export type GameId = typeof GAME_IDS[keyof typeof GAME_IDS];
