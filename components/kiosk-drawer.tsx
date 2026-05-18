import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { SiteConfig } from "@/lib/storage";

const DRAWER_WIDTH = 280;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface KioskDrawerProps {
  visible: boolean;
  sites: SiteConfig[];
  activeSiteId?: string;
  onClose: () => void;
  onSelectSite: (id: string) => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
}

export function KioskDrawer({
  visible,
  sites,
  activeSiteId,
  onClose,
  onSelectSite,
  onOpenSettings,
  onOpenAbout,
}: KioskDrawerProps) {
  const colors = useColors();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, overlayAnim]);

  const styles = StyleSheet.create({
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    drawer: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: DRAWER_WIDTH,
      backgroundColor: colors.surface,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 16,
    },
    header: {
      paddingTop: 48,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: "#1565C0",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFFFFF",
      letterSpacing: 0.5,
    },
    headerSubtitle: {
      fontSize: 13,
      color: "rgba(255,255,255,0.75)",
      marginTop: 4,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 20,
    },
    menuItemText: {
      fontSize: 16,
      color: colors.foreground,
      marginLeft: 12,
    },
    menuIcon: {
      fontSize: 20,
      width: 24,
      textAlign: "center",
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.muted,
      paddingHorizontal: 20,
      paddingVertical: 8,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    siteItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
    siteItemActive: {
      backgroundColor: "rgba(21, 101, 192, 0.12)",
    },
    siteItemText: {
      fontSize: 15,
      color: colors.foreground,
      flex: 1,
    },
    siteItemTextActive: {
      color: "#1565C0",
      fontWeight: "600",
    },
    activeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: "#1565C0",
      marginLeft: 8,
    },
  });

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={{ flex: 1 }}>
        {/* Overlay */}
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🌐 Kiosk Browser</Text>
            <Text style={styles.headerSubtitle}>Меню навігації</Text>
          </View>

          {/* Settings */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onClose();
              onOpenSettings();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuItemText}>Налаштування</Text>
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onClose();
              onOpenAbout();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>ℹ️</Text>
            <Text style={styles.menuItemText}>Про програму</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Sites list */}
          {sites.length > 0 && (
            <Text style={styles.sectionLabel}>Сайти</Text>
          )}
          <FlatList
            data={sites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isActive = item.id === activeSiteId;
              return (
                <TouchableOpacity
                  style={[styles.siteItem, isActive && styles.siteItemActive]}
                  onPress={() => {
                    onSelectSite(item.id);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.siteItemText,
                      isActive && styles.siteItemTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {isActive && <View style={styles.activeDot} />}
                </TouchableOpacity>
              );
            }}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}
