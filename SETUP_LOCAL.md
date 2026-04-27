# 🚀 Guía para Ejecutar ZeroFinances en Local

## 1️⃣ Extensiones de VS Code Recomendadas

Instala estas extensiones en VS Code para mejor experiencia:

### **OBLIGATORIAS**
1. **Expo Tools** (por Expo)
   - ID: `expo.vscode-expo-tools`
   - Propósito: Debugging directo, ver logs de Expo

2. **ES7+ React/Redux/React-Native/JS snippets** (por dsznajder)
   - ID: `dsznajder.es7-react-js-snippets`
   - Propósito: Autocomplete y snippets para React Native

3. **Prettier - Code formatter** (por Prettier)
   - ID: `esbenp.prettier-vscode`
   - Propósito: Formateo automático de código

### **RECOMENDADAS**
4. **Thunder Client** (por rangav)
   - ID: `rangav.vscode-thunder-client`
   - Propósito: Probar endpoints del backend luego

5. **TypeScript Vue Plugin** (por Vue)
   - ID: `Vue.vscode-typescript-vue-plugin`
   - O simplemente usa la extensión TypeScript oficial

---

## 2️⃣ Instalar Expo CLI Globalmente (Importante)

```bash
npm install -g expo-cli
```

Verifica la instalación:
```bash
expo --version
```

---

## 3️⃣ Estructura de Directorios

Tu proyecto está aquí:
```
C:\Users\esteb\Work\Proyects\ZeroFinances\ZeroFinancesFront\
```

---

## 4️⃣ OPCIÓN A: Ejecutar en Web (La más rápida para desarrollo)

### Paso 1: Abre terminal en VS Code
En VS Code, abre la terminal integrada:
- Presiona `Ctrl + ~` (backtick) o
- Menú: Terminal → New Terminal

### Paso 2: Ve al directorio correcto
```bash
cd ZeroFinancesFront
```

### Paso 3: Inicia el servidor Expo
```bash
npm start
```

O directamente:
```bash
expo start
```

### Paso 4: Presiona `w` en la terminal
Una vez que veas el QR y opciones, presiona `w` para abrir en navegador web.

**¡Listo!** Ahora abre http://localhost:19006 en tu navegador y ves la app en tiempo real.

---

## 5️⃣ OPCIÓN B: Ejecutar en tu Teléfono (Recomendado para pruebas reales)

### Paso 1: Instala Expo Go en tu móvil
- **iOS**: App Store → Busca "Expo Go"
- **Android**: Google Play → Busca "Expo Go"

### Paso 2: Ejecuta en la terminal
```bash
npm start
```

### Paso 3: Escanea el QR
- Se mostrará un código QR en la terminal
- Abre la app Expo Go en tu teléfono
- Presiona "Scan QR code"
- Apunta la cámara al QR

**¡Listo!** Tu app se abrirá en el teléfono y verás cambios en tiempo real.

---

## 6️⃣ Hot Reload en Tiempo Real

Cuando hagas cambios en el código:

1. **Guarda el archivo** (`Ctrl + S`)
2. **Automáticamente se recarga** (Fast Refresh)
3. **Ves los cambios al instante** ✨

Si no funciona automático, en la terminal presiona:
- `r` para recargar la app
- `c` para limpiar pantalla
- `q` para salir

---

## 7️⃣ Comandos Útiles

```bash
# Mostrar logs en tiempo real
npm start -- --verbose

# Ejecutar solo en web
npm run web

# Ejecutar en Android (si tienes Android Studio)
npm run android

# Ejecutar en iOS (solo Mac)
npm run ios

# Abrir dev tools
npm start -- --dev-client

# Mostrar opciones
npm start -- --help
```

---

## 8️⃣ Workflow Recomendado para Desarrollo

### Configuración ideal:
1. **Lado izquierdo**: VS Code con tu código
2. **Lado derecho**: Navegador con http://localhost:19006

### O mejor aún:
1. **VS Code** en una pantalla
2. **Teléfono** conectado por Expo Go
3. Haces cambios → guardas → se actualiza automáticamente en el teléfono

---

## 9️⃣ Troubleshooting

### ❌ "Port 19000 is already in use"
```bash
# Cambia el puerto
expo start --port 19001
```

### ❌ No ve cambios en tiempo real
Presiona en la terminal:
```
r
```
Para forzar reload

### ❌ Error: "module not found"
```bash
# Limpia y reinstala
rm -rf node_modules package-lock.json
npm install
```

### ❌ El navegador no abre automáticamente
Abre manualmente: http://localhost:19006

---

## 🎯 RESUMEN - Comando Más Importante

Para empezar **ahora mismo**:

```bash
cd C:\Users\esteb\Work\Proyects\ZeroFinances\ZeroFinancesFront
npm start
```

Luego presiona `w` para web o escanea QR en Expo Go en tu teléfono.

**¡Y listo! Edita cualquier archivo y verás los cambios al instante.** ⚡

---

## 📁 Archivos para Editar (Cosas que probablemente quieras cambiar)

Todos están en `src/`:
```
src/screens/LoginScreen.tsx      ← Pantalla de login
src/screens/ChatScreen.tsx       ← Chat con Zero
src/screens/CalendarScreen.tsx   ← Calendario
src/screens/ProfileScreen.tsx    ← Perfil
src/screens/ExcelScreen.tsx      ← Excel export
src/components/Button.tsx        ← Botones
src/components/Input.tsx         ← Inputs
src/store/authStore.ts           ← Estado de auth
src/store/chatStore.ts           ← Estado del chat
```

Modifica cualquiera y guarda (`Ctrl + S`) → cambios inmediatos ✨
