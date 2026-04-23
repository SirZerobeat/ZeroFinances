# Frontend - Guía de Estructura

## 📁 Estructura de Carpetas

```
src/
├── api/            # (Por implementar) Hooks de React Query y config de Axios
├── components/     # Componentes UI reutilizables
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── ChatMessage.tsx
│   └── TransactionItem.tsx
├── hooks/          # (Por implementar) Lógica de grabación de voz y cámara
├── navigation/
│   └── RootNavigator.tsx  # Configuración principal de navegación
├── screens/        # Pantallas principales
│   ├── LoginScreen.tsx    # Pantalla de inicio de sesión
│   ├── ChatScreen.tsx     # Chat con Zero (IA)
│   ├── CalendarScreen.tsx # Calendario con transacciones
│   ├── ProfileScreen.tsx  # Perfil del usuario
│   └── ExcelScreen.tsx    # Exportación a Excel
├── store/          # Estado global con Zustand
│   ├── authStore.ts       # Gestión de autenticación
│   ├── chatStore.ts       # Gestión del chat
│   └── transactionStore.ts # Gestión de transacciones
└── utils/          # (Por implementar) Utilidades (formateadores, etc.)
```

## 🎯 Flujo de Navegación

```
App
├── No autenticado
│   └── LoginScreen
│       └── Ingresar email y contraseña
│
└── Autenticado
    └── AppTabs (Bottom Tab Navigator)
        ├── Chat
        │   └── ChatScreen (primera pestaña, por defecto)
        ├── Calendario
        │   └── CalendarScreen
        ├── Excel
        │   └── ExcelScreen
        └── Perfil
            └── ProfileScreen
```

## 🧠 Estado Global (Zustand)

### authStore.ts
Gestiona:
- Usuario actual
- Token de autenticación
- Estado de carga
- Acciones: `login()`, `logout()`

### chatStore.ts
Gestiona:
- Mensajes del chat
- Estado de carga
- Acciones: `sendMessage()`, `addMessage()`, `clearMessages()`

### transactionStore.ts
Gestiona:
- Lista de transacciones
- Estado de carga
- Acciones: `fetchTransacciones()`, `addTransaccion()`

## 🎨 Componentes Disponibles

### Button
Botón reutilizable con variantes.
```tsx
<Button
  title="Enviar"
  onPress={() => {}}
  loading={false}
  variant="primary"
/>
```

### Input
Campo de texto con validación.
```tsx
<Input
  label="Email"
  placeholder="tu@email.com"
  error={emailError}
  value={email}
  onChangeText={setEmail}
/>
```

### ChatMessage
Componente para mostrar mensajes del chat.
```tsx
<ChatMessage message={message} />
```

### TransactionItem
Componente para mostrar una transacción.
```tsx
<TransactionItem transaccion={transaccion} />
```

## 🔄 Flujo de Datos

### Login
1. Usuario ingresa email/contraseña en LoginScreen
2. `useAuthStore.login()` se llama
3. Backend valida credenciales
4. Si es válido, se establece `isAuthenticated = true`
5. Navegación cambia automáticamente a AppTabs

### Chat
1. Usuario escribe mensaje en ChatScreen
2. `useChatStore.sendMessage()` se llama
3. Mensaje se envía al backend (Gemini API)
4. Respuesta de Zero se muestra en el chat

### Transacciones
1. Al iniciar la app, `fetchTransacciones()` se ejecuta
2. Las transacciones se cargan en `transactionStore`
3. Se muestran en CalendarScreen y ExcelScreen

## 🚀 Pendiente de Implementar

- [ ] Integración con API Backend (URLs, autenticación real)
- [ ] Hooks para grabación de voz (expo-av)
- [ ] Hooks para captura de fotos (expo-camera)
- [ ] Utilidades para formateo de moneda y fechas
- [ ] Generación de archivos Excel
- [ ] Integración con Gemini API para procesamiento multimodal
- [ ] Persistencia local (AsyncStorage)
- [ ] Testing

## 📱 Tecnologías

- **React Native** + **Expo** (Framework móvil)
- **TypeScript** (Tipado estricto)
- **Zustand** (Gestión de estado)
- **React Navigation** (Navegación)
- **Axios** (HTTP requests)
- **React Query** (Sincronización de datos)

## 🔧 Comandos Útiles

```bash
# Iniciar la app
npm start

# Ver en Android
npm run android

# Ver en iOS
npm run ios

# Ver en web
npm run web

# Validar tipos
npx tsc --noEmit
```

## 📝 Notas

- Todos los datos están en mock por ahora (ver archivos de store)
- Las pantallas están diseñadas para ser responsivas
- Se usa Safe Area para evitar notches
- Los colores principales son azul (#007AFF) y rojo para errores
