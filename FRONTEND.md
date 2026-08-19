# ZeroFinances - Frontend Documentation

Este documento centraliza toda la información técnica, configuración, y arquitectura del Frontend de ZeroFinances.

## 🚀 Tecnologías y Arquitectura

*   **Framework**: React Native + Expo (Desarrollo ágil con rendimiento nativo).
*   **Lenguaje**: TypeScript (Tipado estricto para mayor robustez en cálculos financieros).
*   **Estado Global**: Zustand (Gestor de estado ligero).
*   **Comunicación**: Axios + React Query (Sincronización con el Backend).
*   **Navegación**: React Navigation.

## 📁 Estructura de Carpetas

Todos los archivos importantes están en la carpeta `src/`:

```
src/
├── api/            # Configuración de Axios (client.ts) y hooks de React Query
├── components/     # Componentes UI reutilizables (Button.tsx, Input.tsx, ChatMessage.tsx)
├── hooks/          # Lógica para hardware nativo (grabación de voz, cámara, WebSockets)
├── navigation/     # Configuración principal de navegación (RootNavigator.tsx, AppTabs)
├── screens/        # Vistas principales:
│   ├── LoginScreen.tsx    # Pantalla de login (email/pass)
│   ├── ChatScreen.tsx     # Chat con Zero (IA multimodal: texto + fotos)
│   ├── CalendarScreen.tsx # Calendario con lista de transacciones
│   ├── ProfileScreen.tsx  # Perfil de usuario y configuraciones
│   └── ExcelScreen.tsx    # Herramienta de exportación a Excel
├── store/          # Estado global con Zustand:
│   ├── authStore.ts       # Gestión de autenticación y tokens JWT
│   ├── chatStore.ts       # Gestión del chat y conexión con Gemini
│   └── transactionStore.ts# Sincronización en tiempo real del saldo
└── utils/          # Formateadores de moneda (MXN) y fechas
```

## 🧠 Estado Global y Flujo de Datos

El Frontend ha eliminado todos los *mocks* (datos falsos) y se comunica directamente con el Backend mediante la API y WebSockets.

### 1. Autenticación (`authStore.ts`)
1. El usuario ingresa credenciales.
2. `useAuthStore.login()` llama a `POST /auth/login`.
3. Se recibe un token JWT que se inyecta automáticamente en `apiClient` de Axios.
4. Redirección a la aplicación principal (`AppTabs`).

### 2. Chat y OCR (`chatStore.ts`)
El chat permite mensajes de texto y subida de imágenes (tickets).
*   **Texto**: `useChatStore.sendMessage()` llama a `POST /api/v1/chat`.
*   **Imágenes**: Utilizando `expo-image-picker`, se seleccionan fotos, se convierten a `FormData` y se envían a `POST /api/v1/chat/image`.

### 3. Sincronización en Tiempo Real (`transactionStore.ts` y WebSockets)
*   Se utiliza un hook customizado `useWebSocket.ts` (inicializado en `App.tsx`) para mantener vivo el canal con `WS /api/v1/ws`.
*   Cuando Zero procesa un ingreso o egreso, el backend dispara un evento de WebSocket (`BALANCE_UPDATE`).
*   Esto provoca un *fetch* automático en `transactionStore`, actualizando el saldo de la cuenta inmediatamente en todas las pantallas.

## 🛠️ Entorno de Desarrollo y Configuración

### Extensiones VS Code Recomendadas
*   **Expo Tools**: Para ver logs y *debugging* directo.
*   **ES7+ React/Redux/React-Native snippets**: Para crear componentes rápidamente.
*   **Prettier**: Formateo automático de código.

### Instalación y Ejecución Local

1. Instalar Expo CLI globalmente:
   ```bash
   npm install -g expo-cli
   ```

2. Instalar dependencias del proyecto:
   ```bash
   cd ZeroFinancesFront
   npm install
   ```

3. Arrancar servidor de desarrollo:
   ```bash
   npm start
   # o
   expo start
   ```

### Opciones de Visualización
Una vez que el servidor Expo inicia, puedes:
*   Presionar `w` en la terminal para abrirlo en el **Navegador Web** (http://localhost:19006). Es el modo más rápido para depuración visual.
*   Instalar **Expo Go** en tu dispositivo físico (iOS/Android) y escanear el código QR para probar integraciones nativas como la cámara.
*   El *Hot Reload* aplicará automáticamente todos los cambios al guardar con `Ctrl + S`. En caso de fallo, presiona `r` en la terminal.

## ⚠️ Buenas Prácticas
*   **Validación de Datos**: Usa interfaces de TypeScript asegurando que las transferencias con el backend sean estrictas.
*   **Optimización de Imágenes**: Redimensionar las fotos de los tickets antes de enviarlas por la API para no saturar la red ni agotar límites de Gemini de forma anticipada.
*   **Feedback Visual**: Siempre mostrar un estado de carga (*spinners*) al enviar tickets al OCR o procesar texto largo.
