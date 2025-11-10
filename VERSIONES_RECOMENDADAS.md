# Versiones Recomendadas para Futuras Apps

Este documento detalla las versiones exactas utilizadas en la aplicación Sound Meter que funcionan correctamente juntas. Se recomienda usar estas versiones como referencia para proyectos similares.

## ✅ Configuración Probada y Funcional

### Framework Principal
- **React**: `19.1.0`
- **React Native**: `0.81.5`
- **Expo**: `~54.0.23`
- **TypeScript**: `~5.9.2`

### Módulo de Publicidad (AdMob)
- **react-native-google-mobile-ads**: `^16.0.0`
  - ✅ Funciona perfectamente con React Native 0.81.5
  - ✅ Compatible con Expo 54
  - ✅ Soporta banners, intersticiales y rewarded ads
  - ✅ Funciona en modo offline sin crashes

### Navegación
- **@react-navigation/native**: `^7.1.19`
- **@react-navigation/native-stack**: `^7.6.2`
- **@react-navigation/bottom-tabs**: `^7.8.4`
- **react-native-screens**: `^4.18.0`
- **react-native-safe-area-context**: `^5.6.2`

### Dependencias Expo
- **expo-dev-client**: `~6.0.17`
- **expo-av**: `^16.0.7` (para audio)
- **expo-haptics**: `^15.0.7` (para vibración)
- **expo-status-bar**: `~3.0.8`
- **expo-sharing**: `^14.0.7`

### Almacenamiento y Gráficos
- **@react-native-async-storage/async-storage**: `^2.2.0`
- **react-native-chart-kit**: `^6.12.0`
- **react-native-svg**: `^15.14.0`

### Tipos para TypeScript
- **@types/react**: `~19.1.0`

## 📋 Cómo usar este stack en una nueva app

### 1. Crear nuevo proyecto Expo
```bash
npx create-expo-app@latest mi-nueva-app
cd mi-nueva-app
```

### 2. Instalar dependencias exactas
```bash
npm install react@19.1.0 react-native@0.81.5
npm install expo@~54.0.23
npm install react-native-google-mobile-ads@^16.0.0
npm install @react-navigation/native@^7.1.19 @react-navigation/native-stack@^7.6.2 @react-navigation/bottom-tabs@^7.8.4
npm install @react-native-async-storage/async-storage@^2.2.0
npm install react-native-safe-area-context@^5.6.2 react-native-screens@^4.18.0
npm install expo-av@^16.0.7 expo-haptics@^15.0.7
npm install typescript@~5.9.2 @types/react@~19.1.0 --save-dev
```

### 3. Configurar AdMob
Crear `app.json` con:
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXX~XXXXXXXXXX",
          "iosAppId": "ca-app-pub-XXXXXXXXXX~XXXXXXXXXX"
        }
      ]
    ]
  }
}
```

### 4. Build con Expo Dev Client
```bash
npx expo install expo-dev-client
npx expo prebuild
npx expo run:android
# o
npx expo run:ios
```

## 🎯 Por qué funciona esta configuración

### Compatibilidad
- ✅ React 19.1.0 es la última versión estable compatible con React Native 0.81.5
- ✅ Expo 54 tiene soporte completo para estas versiones
- ✅ AdMob 16.0.0 ha sido probado extensivamente con esta configuración

### Estabilidad
- ✅ Sin crashes conocidos en modo offline
- ✅ Navegación fluida con React Navigation 7.x
- ✅ Publicidad funciona correctamente en Android e iOS
- ✅ TypeScript 5.9.2 proporciona tipado robusto

### Rendimiento
- ✅ React Native 0.81.5 tiene mejoras de rendimiento significativas
- ✅ React 19.1.0 incluye optimizaciones del motor
- ✅ AdMob 16.0.0 tiene mejor gestión de memoria

## ⚠️ Notas Importantes

1. **AdMob en Desarrollo**: Usar IDs de prueba durante el desarrollo
   - Banner Test ID: `ca-app-pub-3940256099942544/6300978111`
   - Interstitial Test ID: `ca-app-pub-3940256099942544/1033173712`

2. **Expo Dev Client**: Necesario para usar react-native-google-mobile-ads (no funciona con Expo Go)

3. **TypeScript**: Esta configuración requiere TypeScript. No usar JavaScript plano.

4. **Offline First**: Esta configuración soporta apps que funcionan sin conexión

## 📱 Apps de Referencia

Este stack ha sido probado exitosamente en:
- **Sound Meter App** (esta app) - Medidor de sonido con AdMob

## 🔄 Actualizaciones Futuras

Cuando actualices versiones, hazlo de manera incremental:
1. Primero actualiza dependencias menores (patches)
2. Luego versiones menores (minor)
3. Finalmente versiones mayores (major)
4. Siempre prueba AdMob después de cada actualización

---

**Fecha de última verificación**: Noviembre 2025
**Estado**: ✅ Totalmente funcional
