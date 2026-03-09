# Formula E Memory Game - Event Edition 🏎️⚡

Experiencia web premium diseñada para activaciones físicas (iPad/Kiosk) en los eventos oficiales de la Formula E (Kids Zone). Optimizado para el **2026 CUPRA Raval Madrid E-Prix**.

## 🚀 Inicio Rápido

1. **Instalar dependencias**: `npm install`
2. **Ejecutar en desarrollo**: `npm run dev`
3. **Build para producción**: `npm run build`

## 📁 Estructura del Proyecto

*   `src/config/gameConfig.ts`: **Centro de Mandos**. Aquí se cambia el nombre del evento, logos, colores y tiempos de juego.
*   `src/data/gameData.ts`: Base de datos de pilotos y escuderías.
*   `src/data/assets.ts`: Helpers para resolución de rutas de imágenes.
*   `src/hooks/`: Lógica central (Temporizador, Juego de Memoria, Idle Timeout).
*   `src/components/`: Interfaz visual (Grid, Cards, HUD, Modales).

## 🛠️ Guía de Modificación

### Cómo cambiar el Branding (Evento/Patrocinador)
Dirígete a `src/config/gameConfig.ts` y actualiza el objeto `GAME_CONFIG.event`:
- `name`: Nombre que aparecerá en HUD e Inicio.
- `title`: Título principal.
- `assets.logoFE`: Ruta al logo de Formula E.
- `assets.logoEvent`: Ruta al logo del patrocinador (ej. Cupra).

### Cómo actualizar Pilotos o Equipos
Edita `src/data/gameData.ts`:
- Añade o modifica escuderías en `mockTeams`.
- Añade pilotos en `mockDrivers`. 
- **Muy Importante**: Las imágenes deben guardarse en `/public/assets/drivers/` con el nombre exacto definido en el campo `image` del mock (ej: `oliver-rowland.png`).

### Ajustes de Gameplay
En `src/config/gameConfig.ts` puedes ajustar los milisegundos de:
- `mismatchDelay`: Cuánto tiempo se ven las cartas si fallas.
- `idleTimeoutSeconds`: Segundos de inactividad antes de volver al inicio (Attract Mode).

## 📱 Optimización iPad
El juego está bloqueado en **modo horizontal** mediante CSS y no permite scroll. El grid de **5x4 (20 cartas)** está calculado para aprovechar al máximo la pantalla del iPad sin desbordar.

## 🛡️ Robustez para Eventos
- **Preloading**: El sistema prevé la carga de todas las imágenes críticas antes de permitir el inicio.
- **Anti-spam**: Los clics repetidos están bloqueados durante las transiciones para evitar desajustes de estado.
- **Idle Mode**: El juego se reinicia automáticamente si un usuario lo deja a medias y nadie interactúa durante el tiempo configurado.

---
*Desarrollado para Formula E Event Activation.*
