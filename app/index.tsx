import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import { useKiosk } from "@/lib/kiosk-context";
import { KioskDrawer } from "@/components/kiosk-drawer";
import { AboutDialog } from "@/components/about-dialog";

const EDGE_SWIPE_WIDTH = 40;
const MIN_SWIPE_DISTANCE = 60;

export default function KioskScreen() {
  const router = useRouter();
  const { sites, activeSite, isLoading, selectSite } = useKiosk();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [webViewKey, setWebViewKey] = useState(0);
  const webViewRef = useRef<WebView>(null);

  // Startup routing: if no sites, go to settings
  useEffect(() => {
    if (!isLoading && sites.length === 0) {
      router.replace("/settings");
    }
  }, [isLoading, sites.length, router]);

  // Apply screen orientation based on active site config
  useEffect(() => {
    if (!activeSite || Platform.OS === "web") return;
    const applyOrientation = async () => {
      try {
        if (activeSite.allowRotation) {
          await ScreenOrientation.unlockAsync();
        } else {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
        }
      } catch {
        // Ignore orientation errors on web/simulator
      }
    };
    applyOrientation();
  }, [activeSite]);

  // Reload WebView when active site changes
  useEffect(() => {
    setWebViewKey((k) => k + 1);
  }, [activeSite?.id]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Edge swipe gesture to open drawer
  const edgeSwipeGesture = Gesture.Pan()
    .minDistance(MIN_SWIPE_DISTANCE)
    .onStart((e) => {
      if (e.x <= EDGE_SWIPE_WIDTH && e.velocityX > 0) {
        runOnJS(openDrawer)();
      }
    })
    .runOnJS(true);

  const isFullscreen = activeSite?.isFullscreen ?? false;

  // Build WebView injected JS for zoom/sound control
  const getInjectedJS = () => {
    const parts: string[] = [];
    if (activeSite && !activeSite.isZoomEnabled) {
      parts.push(
        `document.querySelector('meta[name="viewport"]') && (document.querySelector('meta[name="viewport"]').content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');`
      );
    }
    if (activeSite && !activeSite.isSoundEnabled) {
      parts.push(
        `document.querySelectorAll('audio, video').forEach(el => { el.muted = true; el.pause(); });`
      );
    }
    return parts.join("\n");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1565C0" />
        <Text style={styles.loadingText}>Завантаження...</Text>
      </View>
    );
  }

  if (!activeSite) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🌐</Text>
        <Text style={styles.emptyTitle}>Немає сайтів</Text>
        <Text style={styles.emptySubtitle}>
          Додайте сайти в налаштуваннях
        </Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push("/settings")}
          activeOpacity={0.8}
        >
          <Text style={styles.settingsButtonText}>Налаштування</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        style="light"
        hidden={isFullscreen}
        translucent
        backgroundColor="transparent"
      />

      {/* Edge swipe detector layer */}
      <GestureDetector gesture={edgeSwipeGesture}>
        <View style={styles.gestureLayer} pointerEvents="box-none">
          {/* Edge touch target */}
          <View style={styles.edgeTouchTarget} />
        </View>
      </GestureDetector>

      {/* WebView */}
      <WebView
        key={webViewKey}
        ref={webViewRef}
        source={{ uri: activeSite.url }}
        style={styles.webView}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={!activeSite.isSoundEnabled}
        scalesPageToFit={activeSite.isZoomEnabled}
        setBuiltInZoomControls={activeSite.isZoomEnabled}
        setDisplayZoomControls={false}
        injectedJavaScript={getInjectedJS()}
        onShouldStartLoadWithRequest={() => true}
        mixedContentMode="always"
        allowsFullscreenVideo
        renderLoading={() => (
          <View style={styles.webViewLoading}>
            <ActivityIndicator size="large" color="#1565C0" />
          </View>
        )}
        startInLoadingState
      />

      {/* Drawer */}
      <KioskDrawer
        visible={drawerOpen}
        sites={sites}
        activeSiteId={activeSite.id}
        onClose={closeDrawer}
        onSelectSite={(id) => {
          selectSite(id);
          closeDrawer();
        }}
        onOpenSettings={() => router.push("/settings")}
        onOpenAbout={() => setAboutOpen(true)}
      />

      {/* About dialog */}
      <AboutDialog
        visible={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  gestureLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
    pointerEvents: "box-none",
  },
  edgeTouchTarget: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: EDGE_SWIPE_WIDTH,
    backgroundColor: "transparent",
  },
  webView: {
    flex: 1,
  },
  webViewLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 32,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
  settingsButton: {
    marginTop: 16,
    backgroundColor: "#1565C0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
