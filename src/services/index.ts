/**
 * Services Index - Export all API services
 * 
 * This module provides centralized access to all API service functions.
 * All endpoints are configured to work with the Django backend and include
 * trailing slashes as required by Django.
 */

// Base API client
export { api, API_BASE_URL, APIError } from './api';

// Auth services
export * from './authService';
export { default as authService } from './authService';

// Games services
export * from './gamesService';
export { default as gamesService } from './gamesService';

// News services
export * from './newsService';
export { default as newsService } from './newsService';

// Catalog services (developer projects)
export * from './catalogService';
export { default as catalogService } from './catalogService';

// Follow/Social services
export * from './followService';
export { default as followService } from './followService';

// Settings services
export * from './settingsService';
export { default as settingsService } from './settingsService';

// Support services (FAQ, help)
export * from './supportService';
export { default as supportService } from './supportService';

// Library services
export * from './libraryService';
export { default as libraryService } from './libraryService';

// Favorites services
export * from './favoritesService';
export { default as favoritesService } from './favoritesService';

// Cart services
export * from './cartService';
export { default as cartService } from './cartService';
