import React, { useCallback } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useKiosk } from "@/lib/kiosk-context";
import { SiteConfig } from "@/lib/storage";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sites, removeSite, activeSite, loadSites } = useKiosk();

  // Reload sites whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSites();
    }, [loadSites])
  );

  const handleDelete = (site: SiteConfig) => {
    Alert.alert(
      "Видалити сайт",
      `Ви впевнені, що хочете видалити "${site.name}"?`,
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: () => removeSite(site.id),
        },
      ]
    );
  };

  const handleEdit = (site: SiteConfig) => {
    router.push({ pathname: "/settings/edit", params: { id: site.id } });
  };

  const handleAdd = () => {
    router.push("/settings/edit");
  };

  const handleBack = () => {
    if (sites.length > 0) {
      router.replace("/");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" backgroundColor="#1565C0" />

      {/* Header */}
      <View style={styles.header}>
        {sites.length > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Налаштування</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      {sites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Немає сайтів</Text>
          <Text style={styles.emptySubtitle}>
            Натисніть "+" щоб додати перший сайт
          </Text>
        </View>
      ) : (
        <FlatList
          data={sites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View
              style={[
                styles.siteCard,
                item.id === activeSite?.id && styles.siteCardActive,
              ]}
            >
              <View style={styles.siteInfo}>
                <Text style={styles.siteName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.siteUrl} numberOfLines={1}>
                  {item.url}
                </Text>
                <View style={styles.badgeRow}>
                  {item.isFullscreen && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Повноекранний</Text>
                    </View>
                  )}
                  {item.allowRotation && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Поворот</Text>
                    </View>
                  )}
                  {item.isSoundEnabled && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Звук</Text>
                    </View>
                  )}
                  {item.isZoomEnabled && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Масштаб</Text>
                    </View>
                  )}
                  {item.keepScreenAwake && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Екран вкл</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editButtonText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={handleAdd}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  separator: {
    height: 10,
  },
  siteCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  siteCardActive: {
    borderLeftWidth: 4,
    borderLeftColor: "#1565C0",
  },
  siteInfo: {
    flex: 1,
    marginRight: 12,
  },
  siteName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  siteUrl: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    color: "#1565C0",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "column",
    gap: 8,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  fab: {
    position: "absolute",
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1565C0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1565C0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
    lineHeight: 32,
  },
});
