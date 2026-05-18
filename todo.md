# Project TODO

- [x] Create SiteConfig data model and AsyncStorage service
- [x] Create app context/provider for site configs and last-visited state
- [x] Remove default tab navigation, implement full-screen single-screen layout
- [x] Build main kiosk screen with full-screen WebView
- [x] Build left-swipe navigation drawer with site list
- [x] Implement app startup routing logic (empty → settings, else → last/first site)
- [x] Build Settings screen with CRUD list of sites
- [x] Build Add/Edit Site form with all toggles
- [x] Build QR Scanner screen with camera permission handling
- [x] Implement WebView dynamic configuration (zoom, sound, rotation, fullscreen)
- [x] Implement immersive/fullscreen mode per site config
- [x] Implement screen orientation lock per site config
- [x] Add "Про програму" (About) dialog
- [x] Localize all UI strings to Ukrainian
- [x] Generate and set app icon/logo
- [x] Update app.config.ts with correct app name and branding
- [x] Final polish: colors, spacing, press states

## Bug Fixes

- [x] Fix drawer list not updating after site save
- [x] Fix left-swipe gesture detection blocked by WebView
- [x] Implement immersive sticky mode to hide Android navigation bar

## New Features

- [x] Add "keep screen awake" toggle to site settings

- [x] Fix settings list not updating after adding a site
- [x] Display app version dynamically in About dialog
