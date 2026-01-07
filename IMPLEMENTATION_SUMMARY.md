# Optimización del NavBar y Sistema de Favoritos

## Cambios Implementados

Este PR implementa las tres características principales solicitadas:

1. **NavBar optimizado con información del usuario**: Muestra el nombre o email del usuario cuando está autenticado
2. **Contexto de usuario para configuración**: Los datos del usuario están disponibles en todos los componentes
3. **Sistema de favoritos funcional**: Los usuarios pueden marcar/desmarcar juegos favoritos con iconos de corazón que cambian de color

---

## 1. Sistema de Contextos para Gestión de Estado

Se han creado dos contextos principales para compartir el estado de usuario y favoritos en toda la aplicación:

### UserContext (`src/contexts/UserContext.tsx`)
- Proporciona información del usuario autenticado a todos los componentes
- Expone:
  - `user`: Objeto con datos del usuario (name, email, image, id)
  - `isLoading`: Estado de carga de la sesión
  - `isAuthenticated`: Booleano indicando si el usuario está autenticado
- Se integra con NextAuth para obtener la sesión del usuario

### FavoritesContext (`src/contexts/FavoritesContext.tsx`)
- Gestiona el estado de los juegos favoritos del usuario
- Expone:
  - `favorites`: Set con los IDs de juegos favoritos
  - `toggleFavorite(gameId)`: Función para marcar/desmarcar favoritos
  - `isFavorite(gameId)`: Función para verificar si un juego es favorito
  - `isLoading`: Estado de carga de favoritos
- Se conecta automáticamente con el backend mediante `favoritesService`
- Sincroniza favoritos cuando el usuario inicia sesión
- Incluye manejo de errores y mensajes amigables

---

## 2. Actualización del NavBar

**Archivo**: `src/Components/navBar/Navbar.tsx`

**Cambios**:
- Ahora utiliza `useUser()` en lugar de `useSession()` directamente
- Muestra el nombre del usuario o email cuando está autenticado
- Muestra "INVITADO" cuando no hay sesión activa
- Mejora en la claridad del código

**Ejemplo visual**:
```
Autenticado:    [👤] Juan Pérez     [Cerrar sesión]
No autenticado: [👤] INVITADO       [Log in]
```

---

## 3. Actualización de Configuración

**Archivo**: `src/Components/configuracion/ConfiguracionApp.tsx`

**Cambios**:
- Utiliza datos reales del usuario desde `useUser()`
- Muestra el avatar con la inicial del nombre/email del usuario
- Muestra mensaje especial si el usuario no está autenticado
- Los campos de entrada se rellenan con los datos reales del usuario
- **Botón de login funcional** cuando el usuario no está autenticado

---

## 4. Sistema de Favoritos en Componentes

Se ha integrado la funcionalidad de favoritos en los siguientes componentes:

### TiendaApp (`src/Components/tienda/TiendaApp.tsx`)
- Iconos de corazón que cambian de color según el estado de favorito
- Click en el corazón toggle el estado de favorito
- Usa `coraB.svg` (gris) y `coraR.svg` (rojo)
- IDs de juegos definidos en constantes

### Carrusel (`src/Components/home/Carrusel.tsx`)
- Botón de favorito en la tarjeta principal
- Usa `heart-gray.svg` y `heart-red.svg`
- Interactivo con efecto hover y animación de escala

### FavoritosApp (`src/Components/favoritos/FavoritosApp.tsx`)
- Muestra solo los juegos marcados como favoritos
- Filtrado dinámico basado en el contexto de favoritos
- **Optimizado con useMemo** para evitar recálculos innecesarios
- Botón para remover de favoritos (aparece en hover)
- Mensaje de estado vacío cuando no hay favoritos

### JuegosGratis (`src/Components/juegosgratis/JuegosGratis.tsx`)
- Integración completa con el sistema de favoritos
- Iconos interactivos de corazón con IDs de constantes

---

## 5. Constantes de IDs de Juegos

**Archivo**: `src/constants/gameIds.ts`

Se creó un archivo de constantes para centralizar los IDs de juegos y mejorar la mantenibilidad:

```typescript
export const GAME_IDS = {
  LEAGUE_OF_LEGENDS: 1,
  GOD_OF_WAR: 2,
  CYBERPUNK_2077: 3,
  // ... más juegos
} as const;
```

**Beneficios**:
- Elimina "números mágicos" en el código
- Fácil de actualizar cuando se integre con el backend real
- Type-safe con TypeScript
- Auto-completado en el IDE

---

## 6. Actualización de Providers

**Archivo**: `src/app/providers.tsx`

**Cambios**:
- Envuelve la aplicación con `UserProvider` y `FavoritesProvider`
- Orden correcto de providers:
  1. SessionProvider (NextAuth)
  2. UserProvider (datos de usuario)
  3. FavoritesProvider (requiere autenticación)

---

## Flujo de Datos

### Autenticación
```
Login (Google/Credentials) 
  → NextAuth Session 
  → UserContext 
  → Todos los componentes
```

### Favoritos
```
Usuario autenticado 
  → FavoritesContext carga favoritos del backend
  → Componentes pueden toggle favoritos
  → Cambios se sincronizan con el backend
  → UI se actualiza automáticamente
```

---

## IDs de Juegos Usados

Para propósitos de demostración, se asignaron IDs consistentes:

- **Tienda**:
  - 1: League of Legends
  - 2: God of War
  - 3: Cyberpunk 2077
  - 4: Control
  - 5: Hogwarts Legacy
  - 6: Elden Ring

- **Juegos Gratis**:
  - 7: Cat Quest II
  - 8: Cat Quest III
  - 9: Cat Quest IV
  - 10: Arcadegeddon
  - 11: River City Girls

---

## Uso de los Hooks

### En cualquier componente:

```tsx
import { useUser } from '@/contexts/UserContext';
import { useFavorites } from '@/contexts/FavoritesContext';

function MiComponente() {
  const { user, isAuthenticated } = useUser();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  return (
    <div>
      {isAuthenticated && <p>Hola, {user.name}!</p>}
      <button onClick={() => toggleFavorite(gameId)}>
        {isFavorite(gameId) ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
```

---

## Beneficios

1. **Centralización**: Un solo lugar para gestionar el estado del usuario y favoritos
2. **Rendimiento**: 
   - Los favoritos se cargan una vez y se reutilizan
   - Uso de `useMemo` para optimizar re-renders
3. **Consistencia**: Todos los componentes muestran la misma información
4. **Sincronización**: Cambios en favoritos se reflejan inmediatamente en toda la app
5. **Mantenibilidad**: 
   - Código más limpio y fácil de mantener
   - Constantes centralizadas para IDs
   - Separación clara de responsabilidades
6. **Experiencia de usuario**:
   - Feedback visual inmediato al marcar favoritos
   - Información de usuario siempre visible
   - Manejo elegante de estados no autenticados

---

## Notas Técnicas

- Los contextos están marcados como `'use client'` para funcionar en el cliente
- FavoritesContext maneja automáticamente la carga inicial de favoritos
- Los cambios se persisten en el backend vía `favoritesService`
- El sistema es compatible con autenticación de Google y credenciales
- Incluye TODOs para implementación futura de notificaciones toast
- Performance optimizado con React hooks (useMemo, useEffect)

---

## Mejoras Futuras Sugeridas

1. Implementar sistema de notificaciones toast para errores
2. Añadir animaciones de transición en cambios de favoritos
3. Caché local de favoritos para offline-first
4. Paginación real conectada al backend
5. Sincronización en tiempo real con WebSockets
