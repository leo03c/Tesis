# Solución del Problema de Autenticación con Google

## Problema Original
El usuario reportó que el login y registro por Google no funcionaba cuando navegaba a cualquier pestaña que necesitaba autenticación.

## Causa Raíz del Problema

### 1. **Error en el callback JWT de NextAuth**
En el archivo `src/lib/auth.ts`, el callback `jwt` tenía una referencia a la variable `account` que no estaba en la lista de parámetros:

```typescript
// ❌ ANTES (INCORRECTO)
async jwt({ token, user }) {  // Falta 'account' aquí
  if (user) {
    if (account?.provider === 'credentials') {  // ❌ 'account' no definido
      // ...
    }
  }
}
```

### 2. **Falta de Tokens JWT para Usuarios de Google**
Cuando un usuario iniciaba sesión con Google, no se estaban obteniendo ni almacenando los tokens JWT del backend (accessToken y refreshToken), lo cual es necesario para que las peticiones autenticadas funcionen.

### 3. **Session sin accessToken**
El `accessToken` no se estaba pasando correctamente a la sesión, causando que los contextos como `FavoritesContext` y `UserContext` no pudieran realizar peticiones autenticadas al backend.

## Solución Implementada

### Cambios en `src/lib/auth.ts`:

#### 1. **Callback `jwt` corregido**
```typescript
// ✅ CORRECTO - Ahora 'account' está en los parámetros
async jwt({ token, user, account }) {
  if (user) {
    console.log('🔑 JWT callback - user login:', { provider: account?.provider, email: user.email });
    
    // Si es login por credenciales
    if (account?.provider === 'credentials') {
      console.log('🔐 Credentials login - storing tokens');
      token.accessToken = (user as any).accessToken;
      token.refreshToken = (user as any).refreshToken;
      token.id = user.id;
    }
    // Si es login por Google
    else if (account?.provider === 'google' && user.email) {
      try {
        console.log('🔍 Fetching user data from backend for Google user');
        // Consultar el backend para obtener el id del usuario por email y tokens
        const res = await fetch(`http://localhost:8000/api/auth/user-by-email/?email=${encodeURIComponent(user.email)}`);
        
        if (res.ok) {
          const data = await res.json();
          console.log('📥 User data received:', { id: data.id, hasAccess: !!data.access });
          
          token.id = data.id?.toString();
          // El backend debe devolver tokens JWT para este usuario
          token.accessToken = data.access;
          token.refreshToken = data.refresh;
          
          if (!token.accessToken) {
            console.warn('⚠️ No access token received from backend for Google user');
          }
        } else {
          console.error('❌ Failed to fetch user data:', res.status);
        }
      } catch (e) {
        console.error('❌ Error obteniendo datos de usuario Google:', e);
      }
    }
  }
  
  console.log('🎫 JWT token state:', { 
    hasId: !!token.id, 
    hasAccessToken: !!token.accessToken,
    hasRefreshToken: !!token.refreshToken 
  });
  
  return token;
}
```

#### 2. **Logging mejorado en todos los callbacks**
Se agregaron logs detallados en `signIn`, `jwt`, y `session` callbacks para facilitar el debugging:

- 🔐 SignIn callback
- 🔑 JWT callback
- 📋 Session callback
- ✅ Estado final de la sesión

#### 3. **Manejo mejorado de errores**
```typescript
// Aceptar tanto 200/201 (nuevo usuario) como 409 (usuario existente)
if (!res.ok && res.status !== 409 && res.status !== 200 && res.status !== 201) {
  const errorText = await res.text();
  console.error('❌ Error guardando usuario Google en backend:', errorText);
  return false;
}
```

## Requisitos del Backend

Para que la autenticación con Google funcione correctamente, el backend **DEBE** implementar los siguientes endpoints:

### 1. **POST `/api/auth/google-auth/`**

**Request Body:**
```json
{
  "email": "usuario@gmail.com",
  "name": "Nombre Usuario",
  "googleId": "123456789"
}
```

**Response esperada:**
- **200/201**: Usuario creado o encontrado exitosamente
- **409**: Usuario ya existe (esto es OK, se permite el login)
- **Cualquier otro error**: Bloquea el login

### 2. **GET `/api/auth/user-by-email/?email=usuario@gmail.com`**

**Response esperada (JSON):**
```json
{
  "id": 123,
  "username": "usuario",
  "email": "usuario@gmail.com",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // ⚠️ REQUERIDO
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // ⚠️ REQUERIDO
}
```

**⚠️ IMPORTANTE**: Este endpoint **DEBE** devolver los tokens JWT (`access` y `refresh`) para el usuario. Sin estos tokens, las peticiones autenticadas no funcionarán.

## Flujo de Autenticación con Google

```
1. Usuario hace click en "Iniciar sesión con Google"
   ↓
2. Google OAuth retorna usuario autenticado
   ↓
3. NextAuth callback signIn:
   - Envía datos a POST /api/auth/google-auth/
   - Backend crea/encuentra usuario
   ↓
4. NextAuth callback jwt:
   - Consulta GET /api/auth/user-by-email/
   - Backend retorna id + tokens JWT
   - Tokens se guardan en JWT token
   ↓
5. NextAuth callback session:
   - Tokens del JWT se copian a la sesión
   - Session.accessToken está disponible
   ↓
6. Usuario navega a página protegida:
   - useSession() tiene accessToken
   - FavoritesContext puede hacer peticiones autenticadas
   - UserContext puede acceder a /api/auth/me/
   ✅ Todo funciona correctamente
```

## Verificación de la Solución

Para verificar que la autenticación funciona correctamente, revisa los logs del navegador:

```
🔐 SignIn callback: { provider: 'google', email: 'usuario@gmail.com' }
📤 Enviando datos a backend google-auth
📥 Respuesta google-auth: 200
✅ Usuario Google procesado correctamente

🔑 JWT callback - user login: { provider: 'google', email: 'usuario@gmail.com' }
🔍 Fetching user data from backend for Google user
📥 User data received: { id: 123, hasAccess: true }
🎫 JWT token state: { hasId: true, hasAccessToken: true, hasRefreshToken: true }

📋 Session callback: { hasToken: true, hasUser: true, tokenId: '123', hasAccessToken: true }
✅ Session created: { userId: '123', hasAccessToken: true }
```

### ⚠️ Si ves este warning:
```
⚠️ No access token received from backend for Google user
```

**Significa que el backend NO está devolviendo los tokens JWT en `/api/auth/user-by-email/`**. 
Esto causará que las peticiones autenticadas fallen.

## Contextos que Requieren accessToken

Los siguientes contextos verifican `session?.accessToken`:

1. **FavoritesContext** (`src/contexts/FavoritesContext.tsx`)
   - Línea 24: `if (status === 'authenticated' && session?.accessToken)`
   - Línea 59: `if (status !== 'authenticated' || !session?.accessToken)`

2. **api.ts** (`src/services/api.ts`)
   - Línea 86-90: Agrega `Authorization: Bearer ${session.accessToken}` a las peticiones

Sin `accessToken` en la sesión, estas funcionalidades NO funcionarán.

## Tipos TypeScript

Los tipos ya están correctamente definidos en `types/next-auth.d.ts`:

```typescript
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
```

## Testing

Para probar la autenticación con Google:

1. Inicia sesión con Google
2. Abre las DevTools del navegador (F12)
3. Ve a la pestaña Console
4. Busca los logs con emojis (🔐, 🔑, 📋, etc.)
5. Verifica que `hasAccessToken: true` aparece en los logs
6. Navega a una página protegida (ej: `/me-gustan`, `/configuracion`)
7. Verifica que la página carga correctamente sin errores de autenticación

## Resumen de Cambios

### Frontend (NextAuth)
✅ Agregado parámetro `account` al callback `jwt`
✅ Implementado fetch de tokens JWT para usuarios de Google
✅ Agregado logging detallado para debugging
✅ Mejorado manejo de errores
✅ Tokens correctamente pasados a la sesión

### Backend (Requerido)
⚠️ Endpoint `/api/auth/google-auth/` debe crear/encontrar usuario
⚠️ Endpoint `/api/auth/user-by-email/` debe retornar tokens JWT
⚠️ Tokens `access` y `refresh` son REQUERIDOS en la respuesta

## Archivos Modificados

- ✅ `src/lib/auth.ts` - Callbacks de NextAuth corregidos y mejorados

## Próximos Pasos

1. Verificar que el backend implementa correctamente `/api/auth/user-by-email/` con tokens JWT
2. Probar login con Google en desarrollo
3. Verificar que las páginas protegidas funcionan correctamente
4. Revisar logs para confirmar que `hasAccessToken: true`

## Notas Adicionales

- El modo `debug: true` está habilitado en NextAuth para facilitar el debugging
- Los logs con emojis facilitan identificar cada etapa del flujo de autenticación
- Los type assertions `(session as any)` son necesarios debido a limitaciones de tipos de NextAuth
- La solución es compatible tanto con autenticación de Google como de credenciales
