# Esquema de Base de Datos - Sistema de Gestión de Videojuegos

**Fecha de Creación:** 2026-01-07  
**Versión:** 1.0  
**Autor:** leo03c

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Diagrama de Relaciones](#diagrama-de-relaciones)
3. [Tablas del Sistema](#tablas-del-sistema)
4. [Relaciones entre Tablas](#relaciones-entre-tablas)
5. [Índices y Optimizaciones](#índices-y-optimizaciones)
6. [Script SQL Completo](#script-sql-completo)

---

## Introducción

Este documento describe el esquema completo de la base de datos para el sistema de gestión de videojuegos. El sistema está diseñado para gestionar usuarios, videojuegos, categorías, compras, reseñas, listas de deseos, y más funcionalidades propias de una plataforma de distribución digital de videojuegos.

### Características Principales:
- Gestión de usuarios y perfiles
- Catálogo de videojuegos con múltiples categorías
- Sistema de compras y biblioteca personal
- Sistema de reseñas y valoraciones
- Lista de deseos y carrito de compras
- Sistema de seguidores
- Noticias y notificaciones
- Soporte técnico (ayuda)
- Comentarios en solicitudes de ayuda

---

## Diagrama de Relaciones

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌─────────────┐ ┌─────────────┐
│  Seguidor   │ │  Libreria   │
└─────────────┘ └──────┬──────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Compras   │ │ Lista_Deseos│ │   Carrito   │
└─────────────┘ └─────────────┘ └─────────────┘
       │
       ▼
┌─────────────┐
│    Juego    │◄──────┐
└──────┬──────┘       │
       │              │
       ├──────────────┤
       │              │
       ▼              │
┌─────────────┐       │
│Juego_Categoria─────┤
└─────────────┘       │
       │              │
       ▼              │
┌─────────────┐       │
│  Categoria  │       │
└─────────────┘       │
                      │
┌─────────────┐       │
│  Reseñas    │───────┤
└─────────────┘       │
       │              │
       ▼              │
┌─────────────┐       │
│  Me_Gusta   │       │
└─────────────┘       │
                      │
┌─────────────┐       │
│ Plataforma  │───────┘
└─────────────┘
```

---

## Tablas del Sistema

### 1. Usuario

**Descripción:** Almacena la información de los usuarios registrados en el sistema.

**Atributos:**
- `id_usuario` (INT, PK, AUTO_INCREMENT): Identificador único del usuario
- `nombre` (VARCHAR(100), NOT NULL): Nombre del usuario
- `apellido` (VARCHAR(100), NOT NULL): Apellido del usuario
- `email` (VARCHAR(150), UNIQUE, NOT NULL): Correo electrónico único
- `contraseña` (VARCHAR(255), NOT NULL): Contraseña encriptada
- `fecha_registro` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Fecha de registro
- `fecha_nacimiento` (DATE): Fecha de nacimiento del usuario
- `pais` (VARCHAR(100)): País de residencia
- `foto_perfil` (VARCHAR(255)): URL de la foto de perfil
- `biografia` (TEXT): Descripción personal del usuario
- `nivel_usuario` (ENUM('basico', 'premium', 'admin'), DEFAULT 'basico'): Tipo de cuenta

**SQL CREATE TABLE:**
```sql
CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_nacimiento DATE,
    pais VARCHAR(100),
    foto_perfil VARCHAR(255),
    biografia TEXT,
    nivel_usuario ENUM('basico', 'premium', 'admin') DEFAULT 'basico',
    INDEX idx_email (email),
    INDEX idx_nivel_usuario (nivel_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2. Juego

**Descripción:** Contiene la información detallada de los videojuegos disponibles en la plataforma.

**Atributos:**
- `id_juego` (INT, PK, AUTO_INCREMENT): Identificador único del juego
- `titulo` (VARCHAR(200), NOT NULL): Título del videojuego
- `descripcion` (TEXT): Descripción detallada del juego
- `desarrollador` (VARCHAR(150)): Nombre del desarrollador
- `publisher` (VARCHAR(150)): Nombre del publicador
- `fecha_lanzamiento` (DATE): Fecha de lanzamiento
- `precio` (DECIMAL(10,2), NOT NULL): Precio del juego
- `descuento` (DECIMAL(5,2), DEFAULT 0.00): Porcentaje de descuento
- `imagen_portada` (VARCHAR(255)): URL de la imagen de portada
- `trailer_url` (VARCHAR(255)): URL del trailer
- `requisitos_minimos` (TEXT): Requisitos mínimos del sistema
- `requisitos_recomendados` (TEXT): Requisitos recomendados
- `clasificacion_edad` (VARCHAR(10)): Clasificación por edad (PEGI, ESRB)
- `idiomas_disponibles` (TEXT): Lista de idiomas soportados
- `tamaño_descarga` (VARCHAR(50)): Tamaño del archivo de descarga

**SQL CREATE TABLE:**
```sql
CREATE TABLE Juego (
    id_juego INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    desarrollador VARCHAR(150),
    publisher VARCHAR(150),
    fecha_lanzamiento DATE,
    precio DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0.00,
    imagen_portada VARCHAR(255),
    trailer_url VARCHAR(255),
    requisitos_minimos TEXT,
    requisitos_recomendados TEXT,
    clasificacion_edad VARCHAR(10),
    idiomas_disponibles TEXT,
    tamaño_descarga VARCHAR(50),
    INDEX idx_titulo (titulo),
    INDEX idx_precio (precio),
    INDEX idx_fecha_lanzamiento (fecha_lanzamiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 3. Categoria

**Descripción:** Define las categorías o géneros de videojuegos.

**Atributos:**
- `id_categoria` (INT, PK, AUTO_INCREMENT): Identificador único de la categoría
- `nombre` (VARCHAR(100), UNIQUE, NOT NULL): Nombre de la categoría
- `descripcion` (TEXT): Descripción de la categoría
- `icono` (VARCHAR(255)): URL del icono de la categoría

**SQL CREATE TABLE:**
```sql
CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    icono VARCHAR(255),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 4. Catalogo

**Descripción:** Representa una vista o colección especial de juegos (destacados, ofertas, etc.).

**Atributos:**
- `id_catalogo` (INT, PK, AUTO_INCREMENT): Identificador único del catálogo
- `nombre` (VARCHAR(150), NOT NULL): Nombre del catálogo
- `descripcion` (TEXT): Descripción del catálogo
- `tipo` (ENUM('destacados', 'ofertas', 'nuevos', 'populares'), NOT NULL): Tipo de catálogo
- `fecha_inicio` (DATE): Fecha de inicio de vigencia
- `fecha_fin` (DATE): Fecha de fin de vigencia
- `activo` (BOOLEAN, DEFAULT TRUE): Estado del catálogo

**SQL CREATE TABLE:**
```sql
CREATE TABLE Catalogo (
    id_catalogo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo ENUM('destacados', 'ofertas', 'nuevos', 'populares') NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 5. Libreria

**Descripción:** Registra los juegos que posee cada usuario.

**Atributos:**
- `id_libreria` (INT, PK, AUTO_INCREMENT): Identificador único
- `id_usuario` (INT, FK, NOT NULL): Referencia al usuario
- `id_juego` (INT, FK, NOT NULL): Referencia al juego
- `fecha_adquisicion` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Fecha de adquisición
- `tiempo_jugado` (INT, DEFAULT 0): Tiempo jugado en minutos
- `ultima_vez_jugado` (DATETIME): Última vez que se jugó
- `favorito` (BOOLEAN, DEFAULT FALSE): Marcado como favorito

**SQL CREATE TABLE:**
```sql
CREATE TABLE Libreria (
    id_libreria INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_juego INT NOT NULL,
    fecha_adquisicion DATETIME DEFAULT CURRENT_TIMESTAMP,
    tiempo_jugado INT DEFAULT 0,
    ultima_vez_jugado DATETIME,
    favorito BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_juego (id_usuario, id_juego),
    INDEX idx_usuario (id_usuario),
    INDEX idx_juego (id_juego)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 6. Seguidor

**Descripción:** Gestiona las relaciones de seguimiento entre usuarios.

**Atributos:**
- `id_seguidor` (INT, PK, AUTO_INCREMENT): Identificador único
- `id_usuario_seguidor` (INT, FK, NOT NULL): Usuario que sigue
- `id_usuario_seguido` (INT, FK, NOT NULL): Usuario seguido
- `fecha_seguimiento` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Fecha del seguimiento

**SQL CREATE TABLE:**
```sql
CREATE TABLE Seguidor (
    id_seguidor INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_seguidor INT NOT NULL,
    id_usuario_seguido INT NOT NULL,
    fecha_seguimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario_seguidor) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_seguido) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (id_usuario_seguidor, id_usuario_seguido),
    INDEX idx_seguidor (id_usuario_seguidor),
    INDEX idx_seguido (id_usuario_seguido),
    CHECK (id_usuario_seguidor != id_usuario_seguido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 7. Noticias

**Descripción:** Almacena noticias y actualizaciones sobre juegos o la plataforma.

**Atributos:**
- `id_noticia` (INT, PK, AUTO_INCREMENT): Identificador único
- `titulo` (VARCHAR(200), NOT NULL): Título de la noticia
- `contenido` (TEXT, NOT NULL): Contenido de la noticia
- `id_juego` (INT, FK): Referencia al juego relacionado (opcional)
- `imagen` (VARCHAR(255)): URL de la imagen
- `fecha_publicacion` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Fecha de publicación
- `autor` (VARCHAR(100)): Nombre del autor
- `categoria_noticia` (ENUM('actualizacion', 'lanzamiento', 'evento', 'general')): Tipo de noticia

**SQL CREATE TABLE:**
```sql
CREATE TABLE Noticias (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    id_juego INT,
    imagen VARCHAR(255),
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    autor VARCHAR(100),
    categoria_noticia ENUM('actualizacion', 'lanzamiento', 'evento', 'general'),
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE SET NULL,
    INDEX idx_fecha_publicacion (fecha_publicacion),
    INDEX idx_categoria (categoria_noticia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 8. Compras

**Descripción:** Registra las transacciones de compra de juegos.

**Atributos:**
- `id_compra` (INT, PK, AUTO_INCREMENT): Identificador único
- `id_usuario` (INT, FK, NOT NULL): Referencia al usuario
- `id_juego` (INT, FK, NOT NULL): Referencia al juego
- `fecha_compra` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Fecha de la compra
- `precio_pagado` (DECIMAL(10,2), NOT NULL): Precio pagado
- `metodo_pago` (ENUM('tarjeta', 'paypal', 'transferencia', 'otro')): Método de pago
- `estado` (ENUM('completada', 'pendiente', 'cancelada', 'reembolsada'), DEFAULT 'completada'): Estado
- `codigo_transaccion` (VARCHAR(100), UNIQUE): Código de transacción

**SQL CREATE TABLE:**
```sql
CREATE TABLE Compras (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_juego INT NOT NULL,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    precio_pagado DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('tarjeta', 'paypal', 'transferencia', 'otro'),
    estado ENUM('completada', 'pendiente', 'cancelada', 'reembolsada') DEFAULT 'completada',
    codigo_transaccion VARCHAR(100) UNIQUE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_fecha_compra (fecha_compra),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 9. Ayuda

**Descripción:** Gestiona las solicitudes de soporte técnico de los usuarios.

**Atributos:**
- `id_ayuda` (INT, PK, AUTO_INCREMENT): Identificador único
- `id_usuario` (INT, FK, NOT NULL): Usuario que solicita ayuda
- `asunto` (VARCHAR(200), NOT NULL): Asunto de la solicitud
- `descripcion` (TEXT, NOT NULL): Descripción del problema
- `estado` (ENUM('abierta', 'en_proceso', 'resuelta', 'cerrada'), DEFAULT 'abierta'): Estado
- `prioridad` (ENUM('baja', 'media', 'alta', 'urgente'), DEFAULT 'media'): Prioridad
- `fecha_creacion` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Fecha de creación
- `fecha_actualizacion` (DATETIME ON UPDATE CURRENT_TIMESTAMP): Última actualización
- `id_juego` (INT, FK): Juego relacionado (opcional)

**SQL CREATE TABLE:**
```sql
CREATE TABLE Ayuda (
    id_ayuda INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('abierta', 'en_proceso', 'resuelta', 'cerrada') DEFAULT 'abierta',
    prioridad ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    id_juego INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE SET NULL,
    INDEX idx_usuario (id_usuario),
    INDEX idx_estado (estado),
    INDEX idx_prioridad (prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 10. Juego_Categoria

**Descripción:** Tabla de relación muchos-a-muchos entre Juego y Categoria.

**Atributos:**
- `id_juego_categoria` (INT, PK, AUTO_INCREMENT): Identificador único
- `id_juego` (INT, FK, NOT NULL): Referencia al juego
- `id_categoria` (INT, FK, NOT NULL): Referencia a la categoría

**SQL CREATE TABLE:**
```sql
CREATE TABLE Juego_Categoria (
    id_juego_categoria INT AUTO_INCREMENT PRIMARY KEY,
    id_juego INT NOT NULL,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria) ON DELETE CASCADE,
    UNIQUE KEY unique_juego_categoria (id_juego, id_categoria),
    INDEX idx_juego (id_juego),
    INDEX idx_categoria (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 11. Lista_Deseos

**Descripción:** Almacena los juegos que los usuarios desean adquirir.

**Atributos:**
- `id_lista_deseos` (INT, PK, AUTO_INCREMENT): Identificador único
- `id_usuario` (INT, FK, NOT NULL): Referencia al usuario
- `id_juego` (INT, FK, NOT NULL): Referencia al juego
- `fecha_agregado` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Fecha de agregado
- `prioridad` (ENUM('baja', 'media', 'alta'), DEFAULT 'media'): Prioridad de adquisición
- `notificar_oferta` (BOOLEAN, DEFAULT TRUE): Notificar cuando esté en oferta

**SQL CREATE TABLE:**
```sql
CREATE TABLE Lista_Deseos (
    id_lista_deseos INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_juego INT NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
    notificar_oferta BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_juego (id_usuario, id_juego),
    INDEX idx_usuario (id_usuario),
    INDEX idx_juego (id_juego)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 12. Me_Gusta

**Descripción:** Registra los "me gusta" de usuarios a reseñas.

**Atributos:**
- `id_me_gusta` (INT, PK, AUTO_INCREMENT): Identificador único
- `id_usuario` (INT, FK, NOT NULL): Usuario que da "me gusta"
- `id_reseña` (INT, FK, NOT NULL): Reseña que recibe el "me gusta"
- `fecha_me_gusta` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Fecha del "me gusta"
- `tipo` (ENUM('positivo', 'negativo'), DEFAULT 'positivo'): Tipo de reacción

**SQL CREATE TABLE:**
```sql
CREATE TABLE Me_Gusta (
    id_me_gusta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_reseña INT NOT NULL,
    fecha_me_gusta DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('positivo', 'negativo') DEFAULT 'positivo',
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_reseña) REFERENCES Reseñas(id_reseña) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_reseña (id_usuario, id_reseña),
    INDEX idx_usuario (id_usuario),
    INDEX idx_reseña (id_reseña)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 13. Reseñas

**Descripción:** Almacena las reseñas y valoraciones de juegos por los usuarios.

**Atributos:**
- `id_reseña` (INT, PK, AUTO_INCREMENT): Identificador único
- `id_usuario` (INT, FK, NOT NULL): Usuario que escribe la reseña
- `id_juego` (INT, FK, NOT NULL): Juego reseñado
- `calificacion` (INT, NOT NULL): Calificación (1-10 o 1-5)
- `titulo` (VARCHAR(200)): Título de la reseña
- `comentario` (TEXT): Texto de la reseña
- `fecha_publicacion` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Fecha de publicación
- `fecha_actualizacion` (DATETIME ON UPDATE CURRENT_TIMESTAMP): Última actualización
- `horas_jugadas` (INT): Horas jugadas al momento de la reseña
- `recomendado` (BOOLEAN): Recomienda el juego

**SQL CREATE TABLE:**
```sql
CREATE TABLE Reseñas (
    id_reseña INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_juego INT NOT NULL,
    calificacion INT NOT NULL,
    titulo VARCHAR(200),
    comentario TEXT,
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    horas_jugadas INT,
    recomendado BOOLEAN,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_juego (id_usuario, id_juego),
    INDEX idx_juego (id_juego),
    INDEX idx_calificacion (calificacion),
    CHECK (calificacion >= 1 AND calificacion <= 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 14. Carrito

**Descripción:** Gestiona el carrito de compras temporal de los usuarios.

**Atributos:**
- `id_carrito` (INT, PK, AUTO_INCREMENT): Identificador único
- `id_usuario` (INT, FK, NOT NULL): Referencia al usuario
- `id_juego` (INT, FK, NOT NULL): Referencia al juego
- `fecha_agregado` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Fecha de agregado
- `precio_momento` (DECIMAL(10,2)): Precio al momento de agregar

**SQL CREATE TABLE:**
```sql
CREATE TABLE Carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_juego INT NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    precio_momento DECIMAL(10,2),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_juego (id_usuario, id_juego),
    INDEX idx_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 15. Plataforma

**Descripción:** Define las plataformas en las que están disponibles los juegos (PC, PlayStation, Xbox, etc.).

**Atributos:**
- `id_plataforma` (INT, PK, AUTO_INCREMENT): Identificador único
- `nombre` (VARCHAR(100), UNIQUE, NOT NULL): Nombre de la plataforma
- `fabricante` (VARCHAR(100)): Fabricante de la plataforma
- `descripcion` (TEXT): Descripción de la plataforma
- `icono` (VARCHAR(255)): URL del icono

**SQL CREATE TABLE:**
```sql
CREATE TABLE Plataforma (
    id_plataforma INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    fabricante VARCHAR(100),
    descripcion TEXT,
    icono VARCHAR(255),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 16. Comentarios_Ayuda

**Descripción:** Almacena los comentarios y respuestas en tickets de soporte.

**Atributos:**
- `id_comentario` (INT, PK, AUTO_INCREMENT): Identificador único
- `id_ayuda` (INT, FK, NOT NULL): Referencia al ticket de ayuda
- `id_usuario` (INT, FK, NOT NULL): Usuario que comenta
- `comentario` (TEXT, NOT NULL): Texto del comentario
- `fecha_comentario` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Fecha del comentario
- `es_respuesta_oficial` (BOOLEAN, DEFAULT FALSE): Marca si es respuesta del soporte

**SQL CREATE TABLE:**
```sql
CREATE TABLE Comentarios_Ayuda (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_ayuda INT NOT NULL,
    id_usuario INT NOT NULL,
    comentario TEXT NOT NULL,
    fecha_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
    es_respuesta_oficial BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_ayuda) REFERENCES Ayuda(id_ayuda) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    INDEX idx_ayuda (id_ayuda),
    INDEX idx_fecha (fecha_comentario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 17. Notificaciones

**Descripción:** Sistema de notificaciones para los usuarios.

**Atributos:**
- `id_notificacion` (INT, PK, AUTO_INCREMENT): Identificador único
- `id_usuario` (INT, FK, NOT NULL): Usuario destinatario
- `tipo` (ENUM('compra', 'oferta', 'seguidor', 'reseña', 'sistema', 'ayuda'), NOT NULL): Tipo
- `titulo` (VARCHAR(200), NOT NULL): Título de la notificación
- `mensaje` (TEXT): Mensaje de la notificación
- `fecha_creacion` (DATETIME, DEFAULT CURRENT_TIMESTAMP): Fecha de creación
- `leida` (BOOLEAN, DEFAULT FALSE): Estado de lectura
- `url_referencia` (VARCHAR(255)): URL relacionada

**SQL CREATE TABLE:**
```sql
CREATE TABLE Notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo ENUM('compra', 'oferta', 'seguidor', 'reseña', 'sistema', 'ayuda') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE,
    url_referencia VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_leida (leida),
    INDEX idx_fecha_creacion (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Relaciones entre Tablas

### Relaciones Principales:

1. **Usuario - Libreria - Juego**
   - Un usuario puede tener múltiples juegos en su biblioteca (1:N)
   - Un juego puede estar en múltiples bibliotecas (1:N)
   - Relación M:N implementada a través de Libreria

2. **Usuario - Seguidor - Usuario**
   - Relación auto-referencial M:N
   - Un usuario puede seguir a muchos usuarios
   - Un usuario puede ser seguido por muchos usuarios

3. **Usuario - Compras - Juego**
   - Un usuario puede realizar múltiples compras (1:N)
   - Un juego puede ser comprado por múltiples usuarios (1:N)
   - Relación M:N con atributos adicionales

4. **Juego - Juego_Categoria - Categoria**
   - Un juego puede pertenecer a múltiples categorías (M:N)
   - Una categoría puede contener múltiples juegos (M:N)

5. **Usuario - Reseñas - Juego**
   - Un usuario puede escribir múltiples reseñas (1:N)
   - Un juego puede tener múltiples reseñas (1:N)
   - Un usuario solo puede reseñar un juego una vez (UNIQUE constraint)

6. **Usuario - Me_Gusta - Reseñas**
   - Un usuario puede dar "me gusta" a múltiples reseñas (1:N)
   - Una reseña puede recibir múltiples "me gusta" (1:N)

7. **Usuario - Ayuda - Comentarios_Ayuda**
   - Un ticket de ayuda puede tener múltiples comentarios (1:N)
   - Un usuario puede crear múltiples tickets (1:N)

8. **Usuario - Notificaciones**
   - Un usuario puede recibir múltiples notificaciones (1:N)

9. **Usuario - Lista_Deseos - Juego**
   - Un usuario puede tener múltiples juegos en su lista de deseos (1:N)
   - Un juego puede estar en múltiples listas de deseos (1:N)

10. **Usuario - Carrito - Juego**
    - Un usuario puede tener múltiples juegos en su carrito (1:N)
    - Un juego puede estar en múltiples carritos (1:N)

---

## Índices y Optimizaciones

### Estrategia de Indexación:

1. **Índices Primarios:** Todas las tablas tienen una clave primaria auto-incremental
2. **Índices Únicos:** 
   - Email en Usuario
   - Combinaciones usuario-juego en Libreria, Lista_Deseos, Carrito, Reseñas
   - Combinaciones en relaciones M:N

3. **Índices de Búsqueda:**
   - Campos de búsqueda frecuente (título, email, nombre)
   - Claves foráneas para optimizar JOINs
   - Campos de filtrado (estado, fecha, tipo)

4. **Consideraciones de Rendimiento:**
   - Uso de ENGINE=InnoDB para soporte de transacciones
   - Charset utf8mb4 para soporte completo de Unicode
   - Índices compuestos en consultas frecuentes

---

## Script SQL Completo

```sql
-- ============================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS
-- Sistema de Gestión de Videojuegos
-- Versión: 1.0
-- Fecha: 2026-01-07
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS sistema_videojuegos
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_unicode_ci;

USE sistema_videojuegos;

-- Deshabilitar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- TABLA: Usuario
-- ============================================
CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_nacimiento DATE,
    pais VARCHAR(100),
    foto_perfil VARCHAR(255),
    biografia TEXT,
    nivel_usuario ENUM('basico', 'premium', 'admin') DEFAULT 'basico',
    INDEX idx_email (email),
    INDEX idx_nivel_usuario (nivel_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Juego
-- ============================================
CREATE TABLE Juego (
    id_juego INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    desarrollador VARCHAR(150),
    publisher VARCHAR(150),
    fecha_lanzamiento DATE,
    precio DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0.00,
    imagen_portada VARCHAR(255),
    trailer_url VARCHAR(255),
    requisitos_minimos TEXT,
    requisitos_recomendados TEXT,
    clasificacion_edad VARCHAR(10),
    idiomas_disponibles TEXT,
    tamaño_descarga VARCHAR(50),
    INDEX idx_titulo (titulo),
    INDEX idx_precio (precio),
    INDEX idx_fecha_lanzamiento (fecha_lanzamiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Categoria
-- ============================================
CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    icono VARCHAR(255),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Catalogo
-- ============================================
CREATE TABLE Catalogo (
    id_catalogo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo ENUM('destacados', 'ofertas', 'nuevos', 'populares') NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Plataforma
-- ============================================
CREATE TABLE Plataforma (
    id_plataforma INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    fabricante VARCHAR(100),
    descripcion TEXT,
    icono VARCHAR(255),
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Libreria
-- ============================================
CREATE TABLE Libreria (
    id_libreria INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_juego INT NOT NULL,
    fecha_adquisicion DATETIME DEFAULT CURRENT_TIMESTAMP,
    tiempo_jugado INT DEFAULT 0,
    ultima_vez_jugado DATETIME,
    favorito BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_juego (id_usuario, id_juego),
    INDEX idx_usuario (id_usuario),
    INDEX idx_juego (id_juego)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Seguidor
-- ============================================
CREATE TABLE Seguidor (
    id_seguidor INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_seguidor INT NOT NULL,
    id_usuario_seguido INT NOT NULL,
    fecha_seguimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario_seguidor) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_seguido) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (id_usuario_seguidor, id_usuario_seguido),
    INDEX idx_seguidor (id_usuario_seguidor),
    INDEX idx_seguido (id_usuario_seguido),
    CHECK (id_usuario_seguidor != id_usuario_seguido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Noticias
-- ============================================
CREATE TABLE Noticias (
    id_noticia INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    id_juego INT,
    imagen VARCHAR(255),
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    autor VARCHAR(100),
    categoria_noticia ENUM('actualizacion', 'lanzamiento', 'evento', 'general'),
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE SET NULL,
    INDEX idx_fecha_publicacion (fecha_publicacion),
    INDEX idx_categoria (categoria_noticia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Compras
-- ============================================
CREATE TABLE Compras (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_juego INT NOT NULL,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    precio_pagado DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('tarjeta', 'paypal', 'transferencia', 'otro'),
    estado ENUM('completada', 'pendiente', 'cancelada', 'reembolsada') DEFAULT 'completada',
    codigo_transaccion VARCHAR(100) UNIQUE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_fecha_compra (fecha_compra),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Ayuda
-- ============================================
CREATE TABLE Ayuda (
    id_ayuda INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('abierta', 'en_proceso', 'resuelta', 'cerrada') DEFAULT 'abierta',
    prioridad ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    id_juego INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE SET NULL,
    INDEX idx_usuario (id_usuario),
    INDEX idx_estado (estado),
    INDEX idx_prioridad (prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Juego_Categoria
-- ============================================
CREATE TABLE Juego_Categoria (
    id_juego_categoria INT AUTO_INCREMENT PRIMARY KEY,
    id_juego INT NOT NULL,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria) ON DELETE CASCADE,
    UNIQUE KEY unique_juego_categoria (id_juego, id_categoria),
    INDEX idx_juego (id_juego),
    INDEX idx_categoria (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Lista_Deseos
-- ============================================
CREATE TABLE Lista_Deseos (
    id_lista_deseos INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_juego INT NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
    notificar_oferta BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_juego (id_usuario, id_juego),
    INDEX idx_usuario (id_usuario),
    INDEX idx_juego (id_juego)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Reseñas
-- ============================================
CREATE TABLE Reseñas (
    id_reseña INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_juego INT NOT NULL,
    calificacion INT NOT NULL,
    titulo VARCHAR(200),
    comentario TEXT,
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP,
    horas_jugadas INT,
    recomendado BOOLEAN,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_juego (id_usuario, id_juego),
    INDEX idx_juego (id_juego),
    INDEX idx_calificacion (calificacion),
    CHECK (calificacion >= 1 AND calificacion <= 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Me_Gusta
-- ============================================
CREATE TABLE Me_Gusta (
    id_me_gusta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_reseña INT NOT NULL,
    fecha_me_gusta DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('positivo', 'negativo') DEFAULT 'positivo',
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_reseña) REFERENCES Reseñas(id_reseña) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_reseña (id_usuario, id_reseña),
    INDEX idx_usuario (id_usuario),
    INDEX idx_reseña (id_reseña)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Carrito
-- ============================================
CREATE TABLE Carrito (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_juego INT NOT NULL,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    precio_momento DECIMAL(10,2),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_juego) REFERENCES Juego(id_juego) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_juego (id_usuario, id_juego),
    INDEX idx_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Comentarios_Ayuda
-- ============================================
CREATE TABLE Comentarios_Ayuda (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_ayuda INT NOT NULL,
    id_usuario INT NOT NULL,
    comentario TEXT NOT NULL,
    fecha_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
    es_respuesta_oficial BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_ayuda) REFERENCES Ayuda(id_ayuda) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    INDEX idx_ayuda (id_ayuda),
    INDEX idx_fecha (fecha_comentario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Notificaciones
-- ============================================
CREATE TABLE Notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo ENUM('compra', 'oferta', 'seguidor', 'reseña', 'sistema', 'ayuda') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE,
    url_referencia VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_leida (leida),
    INDEX idx_fecha_creacion (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rehabilitar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
```

---

## Notas Adicionales

### Convenciones de Nomenclatura:
- **Tablas:** PascalCase en singular o descripción funcional
- **Columnas:** snake_case
- **Claves Primarias:** id_[nombre_tabla]
- **Claves Foráneas:** id_[tabla_referenciada]
- **Índices:** idx_[columna] o idx_[descripción]

### Consideraciones de Seguridad:
1. Las contraseñas deben almacenarse encriptadas (bcrypt, Argon2)
2. Implementar validaciones a nivel de aplicación
3. Usar prepared statements para prevenir SQL injection
4. Implementar roles y permisos a nivel de base de datos

### Escalabilidad:
1. Considerar particionamiento de tablas grandes (Compras, Notificaciones)
2. Implementar caché para consultas frecuentes
3. Monitorear y optimizar consultas lentas
4. Considerar réplicas de lectura para alta concurrencia

### Mantenimiento:
1. Realizar backups regulares
2. Monitorear el crecimiento de tablas
3. Revisar y optimizar índices periódicamente
4. Implementar archivado de datos históricos

---

**Documento generado el:** 2026-01-07  
**Versión del esquema:** 1.0  
**Última actualización:** 2026-01-07 15:57:24 UTC
