# APEX OS // MOBILE RUNTIME (IPHONE & ANDROID)

APEX OS is fully optimized for **iPhone (iOS)** and **Android** smartphones with zero compromises, featuring low-latency touch controls, bottom tab bar navigation, edge-to-edge notch/Dynamic Island support, safe-area insets, and PWA / Native app support.

---

## Option 1: Run as a Progressive Web App (PWA) — *Recommended (Instant Setup)*

### On iPhone / iPad (Safari)
1. Open APEX OS in **Safari** on your iPhone.
2. Tap the **Share** button (box with an arrow pointing up) in the bottom Safari toolbar.
3. Scroll down and tap **Add to Home Screen**.
4. APEX OS will now appear on your iPhone home screen as a full-screen, standalone app without browser bars.

### On Android (Chrome / Edge)
1. Open APEX OS in **Chrome** on your Android phone.
2. When prompted, tap the Cyberpunk **INSTALL APEX APP NOW** banner at the bottom of the screen (or tap the 3 dots menu -> **Install app** / **Add to Home screen**).
3. APEX OS will install natively via WebAPK onto your home screen and app drawer.

---

## Option 2: Build as a Native Mobile App (.apk / iOS App) via Capacitor

APEX includes a pre-configured `capacitor.config.json` for compilation in Xcode and Android Studio.

### Prerequisites
Install Capacitor CLI & platforms:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
```

### Build & Sync Native Projects

#### 1. Build Production Bundle
```bash
npm run build
```

#### 2. Add Native iOS / Android Projects
```bash
# Add iOS project (for iPhone / iPad)
npx cap add ios

# Add Android project (for Android APK / AAB)
npx cap add android
```

#### 3. Sync & Open Native IDEs
```bash
# Sync web assets to mobile shells
npx cap sync

# Open in Xcode (macOS) to deploy to iPhone/Simulator
npx cap open ios

# Open in Android Studio to build APK or run on Android device
npx cap open android
```

---

## Key Mobile Features Included

- **Fixed Cyberpunk Bottom Tab Bar**: Quick 1-thumb switching between Command Center, Habits, Focus Timer, AI Coach, and Profile.
- **Slide-Over Mobile Drawer**: Quick access to Growth Heatmaps, Growth Ledger, System Settings, Node Sync, and PWA Install triggers.
- **Dynamic Island & Notch Compatibility**: Built with `viewport-fit=cover` and iOS Safe Area insets (`env(safe-area-inset-bottom)`).
- **Responsive Layout**: Replaces left desktop sidebar on small screens (`< md`) to give the main canvas 100% screen width.
- **Offline Node Sync**: Service Worker handles offline caching and background synchronization when mobile connectivity drops.
