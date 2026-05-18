import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/use-colors";

interface AboutDialogProps {
  visible: boolean;
  onClose: () => void;
}

export function AboutDialog({ visible, onClose }: AboutDialogProps) {
  const colors = useColors();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      width: "100%",
      maxWidth: 360,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 12,
    },
    iconRow: {
      alignItems: "center",
      marginBottom: 16,
    },
    iconText: {
      fontSize: 48,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.foreground,
      textAlign: "center",
      marginBottom: 8,
    },
    version: {
      fontSize: 13,
      color: colors.muted,
      textAlign: "center",
      marginBottom: 16,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 16,
    },
    description: {
      fontSize: 14,
      color: colors.foreground,
      lineHeight: 22,
      textAlign: "center",
      marginBottom: 24,
    },
    closeButton: {
      backgroundColor: "#1565C0",
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={styles.card}>
            <View style={styles.iconRow}>
              <Text style={styles.iconText}>🌐</Text>
            </View>
            <Text style={styles.title}>Kiosk Browser</Text>
            <Text style={styles.version}>Версія 1.0.0</Text>
            <View style={styles.divider} />
            <Text style={styles.description}>
              Браузер-кіоск для Android. Дозволяє відображати попередньо
              налаштовані веб-сайти у повноекранному режимі з прихованою
              навігацією через бічне меню.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.closeButtonText}>Закрити</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
