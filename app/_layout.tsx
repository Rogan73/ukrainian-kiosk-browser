import { ThemeProvider } from "@/lib/theme-provider";
import { KioskProvider } from "@/lib/kiosk-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <KioskProvider>
            <StatusBar style="light" translucent backgroundColor="transparent" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="settings/index" options={{ headerShown: false }} />
              <Stack.Screen name="settings/edit" options={{ headerShown: false }} />
              <Stack.Screen name="settings/qr-scanner" options={{ headerShown: false }} />
            </Stack>
          </KioskProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
