# Frontend ZeroFinances
Este documento define la interfaz de usuario, la captura sensorial y la experiencia del cliente móvil.

### Capas de Tecnología y Arquitectura
**Framework**: React Native + Expo (Desarrollo ágil con rendimiento nativo).
**Lenguaje**: TypeScript (Para robustez y tipado estricto de finanzas).
**Estado Global**: Zustand (Gestor de estado ligero).
**Comunicación**: Axios + React Query (Sincronización con el Backend).
**Navegación**: React Navigation.

### Configuración del Entorno (VS Code)
**Extensiones Recomendadas**: ES7+ React/Redux/React-Native snippets, Prettier, Expo Tools.
**Previsualización**: App Expo Go en el dispositivo físico para pruebas en tiempo real.

### Estructura de Carpetas (Arquitectura Modular)
ZeroFinancesFront/
├── src/
│   ├── api/            # Hooks de React Query y config de Axios
│   ├── components/     # UI Atómica (Botones, Tarjetas, Inputs)
│   ├── hooks/          # Lógica de grabación de voz y cámara
│   ├── navigation/     # Configuración de Tabs y Stacks
│   ├── screens/        # Vistas principales (Chat, History, Profile)
│   ├── store/          # Estado global con Zustand
│   └── utils/          # Formateadores de moneda (MXN) y fechas
├── assets/             # Recursos estáticos
└── App.tsx             # Punto de entrada



### Comandos Iniciales
**Crear proyecto con TS**
npx create-expo-app@latest ZeroFinancesFront -t expo-template-blank-typescript

**Instalar librerías**
npm install axios zustand @tanstack/react-query @react-navigation/native
npx expo install expo-camera expo-av expo-file-system

# Buenas Prácticas Generales
**Validación de Datos**: Usar interfaces de TypeScript en el Front y Pydantic en el Back para asegurar que los montos siempre sean numéricos.
**Optimización de Imágenes**: Redimensionar las fotos de los tickets antes de subirlas para no saturar el ancho de banda del servidor local.
**Seguridad**: Nunca subir el archivo .env a GitHub; usar variables de entorno para las API Keys de Gemini.
**Feedback al Usuario**: Mostrar indicadores de carga (spinners) mientras la IA procesa audios o imágenes.