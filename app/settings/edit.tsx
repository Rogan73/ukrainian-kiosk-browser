import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useKiosk } from "@/lib/kiosk-context";
import { SiteConfig } from "@/lib/storage";

export default function EditSiteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { sites, addNewSite, editSite } = useKiosk();

  const isEditing = !!id;
  const existingSite = id ? sites.find((s) => s.id === id) : undefined;

  const [name, setName] = useState(existingSite?.name ?? "");
  const [url, setUrl] = useState(existingSite?.url ?? "");
  const [allowRotation, setAllowRotation] = useState(
    existingSite?.allowRotation ?? false
  );
  const [isFullscreen, setIsFullscreen] = useState(
    existingSite?.isFullscreen ?? true
  );
  const [isSoundEnabled, setIsSoundEnabled] = useState(
    existingSite?.isSoundEnabled ?? true
  );
  const [isZoomEnabled, setIsZoomEnabled] = useState(
    existingSite?.isZoomEnabled ?? false
  );
  const [keepScreenAwake, setKeepScreenAwake] = useState(
    existingSite?.keepScreenAwake ?? true
  );
  const [isSaving, setIsSaving] = useState(false);

  // Listen for QR scan result passed via params
  const { scannedUrl } = useLocalSearchParams<{ scannedUrl?: string }>();
  useEffect(() => {
    if (scannedUrl) {
      setUrl(scannedUrl);
    }
  }, [scannedUrl]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName) {
      Alert.alert("Помилка", "Введіть назву сторінки");
      return;
    }
    if (!trimmedUrl) {
      Alert.alert("Помилка", "Введіть посилання");
      return;
    }

    // Auto-add https:// if missing
    const finalUrl =
      trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")
        ? trimmedUrl
        : `https://${trimmedUrl}`;

    setIsSaving(true);
    try {
      const siteData: Omit<SiteConfig, "id"> = {
        name: trimmedName,
        url: finalUrl,
        allowRotation,
        isFullscreen,
        isSoundEnabled,
        isZoomEnabled,
        keepScreenAwake,
      };

      if (isEditing && existingSite) {
        await editSite({ ...siteData, id: existingSite.id });
      } else {
        await addNewSite(siteData);
      }
      router.back();
    } catch {
      Alert.alert("Помилка", "Не вдалося зберегти сайт");
    } finally {
      setIsSaving(false);
    }
  };

  const handleScanQR = () => {
    router.push({
      pathname: "/settings/qr-scanner",
      params: { returnTo: "edit", editId: id ?? "" },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="light" backgroundColor="#1565C0" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? "Редагувати" : "Додати сайт"}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Назва сторінки</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Наприклад: Головна сторінка"
              placeholderTextColor="#9CA3AF"
              returnKeyType="next"
              autoCapitalize="words"
            />
          </View>

          {/* URL field with QR button */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Посилання</Text>
            <View style={styles.urlRow}>
              <TextInput
                style={[styles.input, styles.urlInput]}
                value={url}
                onChangeText={setUrl}
                placeholder="https://example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.qrButton}
                onPress={handleScanQR}
                activeOpacity={0.8}
              >
                <Text style={styles.qrButtonIcon}>📷</Text>
                <Text style={styles.qrButtonText}>QR</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Toggles section */}
          <View style={styles.togglesSection}>
            <Text style={styles.sectionTitle}>Параметри відображення</Text>

            <ToggleRow
              label="Дозволити поворот екрана"
              value={allowRotation}
              onValueChange={setAllowRotation}
            />
            <View style={styles.toggleDivider} />
            <ToggleRow
              label="Повноекранний режим"
              value={isFullscreen}
              onValueChange={setIsFullscreen}
            />
            <View style={styles.toggleDivider} />
            <ToggleRow
              label="Дозволити звук"
              value={isSoundEnabled}
              onValueChange={setIsSoundEnabled}
            />
            <View style={styles.toggleDivider} />
            <ToggleRow
              label="Дозволити масштабування"
              value={isZoomEnabled}
              onValueChange={setIsZoomEnabled}
            />
            <View style={styles.toggleDivider} />
            <ToggleRow
              label="Не вимикати екран"
              value={keepScreenAwake}
              onValueChange={setKeepScreenAwake}
            />
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? "Збереження..." : "Зберегти"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
        thumbColor={value ? "#1565C0" : "#9CA3AF"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1565C0",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backIcon: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
  },
  headerSpacer: {
    width: 36,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1A1A2E",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  urlRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  urlInput: {
    flex: 1,
  },
  qrButton: {
    backgroundColor: "#1565C0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
    gap: 2,
  },
  qrButtonIcon: {
    fontSize: 16,
  },
  qrButtonText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  togglesSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleLabel: {
    fontSize: 15,
    color: "#1A1A2E",
    flex: 1,
    marginRight: 12,
  },
  toggleDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
  },
  saveButton: {
    backgroundColor: "#1565C0",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
});
