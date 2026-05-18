# Kiosk Browser App – Design Document

## Overview
A full-screen kiosk-style Android browser app with all UI in Ukrainian. The app is intended for public display kiosks or managed devices, showing pre-configured websites in a full-screen WebView with a hidden left-swipe navigation drawer.

---

## Screen List

1. **Main Kiosk Screen** (`/`) – Full-screen WebView showing the active site; no headers or toolbars
2. **Settings Screen** (`/settings`) – CRUD list of saved site configs with FAB to add new
3. **Add/Edit Site Screen** (`/settings/edit`) – Form for creating or editing a site config
4. **QR Scanner Screen** (`/settings/qr-scanner`) – Camera view for scanning QR codes into URL field

---

## Primary Content and Functionality

### Main Kiosk Screen
- Full-screen `WebView` with no status bar or navigation bar (immersive mode when configured)
- Left-swipe from edge opens the Navigation Drawer
- Drawer contains: "Налаштування" (Settings), "Про програму" (About), divider, list of site names
- On tap of a site in drawer: close drawer, save last-visited ID, apply site config, load URL

### Settings Screen
- FlatList of saved `SiteConfig` items showing name and URL
- Each row has Edit and Delete buttons
- FAB ("+") in bottom-right to add a new site
- Back navigation returns to main kiosk view

### Add/Edit Site Screen
- Text input: "Назва сторінки" (site name)
- Text input: "Посилання" (URL) + QR scan button inline
- Toggle: "Дозволити поворот екрана"
- Toggle: "Повноекранний режим"
- Toggle: "Дозволити звук"
- Toggle: "Дозволити масштабування"
- Save button at bottom

### QR Scanner Screen
- Full-screen camera preview
- Detects QR codes and auto-populates URL field
- Close/cancel button

---

## Key User Flows

### Launch Flow
1. App opens → check AsyncStorage for saved sites
2. If empty → navigate to Settings screen
3. If sites exist → check last-visited ID → load that site (or first site)

### Navigation Flow
1. User swipes from left edge → Drawer opens
2. User taps site name → Drawer closes → site config applied → URL loaded

### Add Site Flow
1. Settings → FAB → Add/Edit form
2. Fill name + URL (or scan QR) → toggle options → Save
3. Return to Settings list

### QR Scan Flow
1. Tap "Сканувати QR" → check camera permission
2. If denied → show Ukrainian explanation + request
3. Camera opens → scan QR → URL populated → camera closes

---

## Color Choices

| Token | Value | Usage |
|-------|-------|-------|
| primary | `#1565C0` (deep blue) | FAB, active states, buttons |
| background | `#FFFFFF` / `#121212` | Screen backgrounds |
| surface | `#F5F7FA` / `#1E2226` | Cards, drawer background |
| foreground | `#1A1A2E` / `#E8EAED` | Primary text |
| muted | `#6B7280` / `#9CA3AF` | Secondary text |
| border | `#E5E7EB` / `#2D3748` | Dividers |
| error | `#DC2626` / `#F87171` | Delete actions |
| success | `#16A34A` / `#4ADE80` | Save confirmations |

---

## Architecture Notes

- **Data Storage**: AsyncStorage for site configs and last-visited ID
- **Navigation**: Expo Router with custom drawer overlay (no tab bar)
- **WebView**: `react-native-webview` with dynamic config per site
- **QR Scanner**: `expo-camera` with barcode scanning
- **Screen Orientation**: `expo-screen-orientation` for per-site lock
- **Status Bar**: `expo-status-bar` + `expo-system-ui` for immersive mode
