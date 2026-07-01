import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  variant: 'green' | 'red' | 'dark';
  size?: number;
}

const VARIANTS = {
  green: {
    bg: 'rgba(52, 199, 89, 0.22)',
    border: 'rgba(52, 199, 89, 0.45)',
    text: '#34C759',
    pressed: 'rgba(52, 199, 89, 0.35)',
  },
  red: {
    bg: 'rgba(255, 59, 48, 0.22)',
    border: 'rgba(255, 59, 48, 0.45)',
    text: '#FF3B30',
    pressed: 'rgba(255, 59, 48, 0.35)',
  },
  dark: {
    bg: 'rgba(255, 255, 255, 0.10)',
    border: 'rgba(255, 255, 255, 0.18)',
    text: '#FFFFFF',
    pressed: 'rgba(255, 255, 255, 0.20)',
  },
};

export function GlassButton({ label, onPress, variant, size = 80 }: GlassButtonProps) {
  const colors = VARIANTS[variant];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: pressed ? colors.pressed : colors.bg,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Inner highlight ring — simulates glass refraction */}
      <View
        style={[
          styles.innerRing,
          {
            width: size - 4,
            height: size - 4,
            borderRadius: (size - 4) / 2,
            borderColor: 'rgba(255,255,255,0.12)',
          },
        ]}
      />
      <Text
        style={[
          styles.label,
          { color: colors.text, fontSize: size < 72 ? 15 : 17 },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    // Subtle shadow for depth
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 1,
  },
  label: {
    fontWeight: '600',
    letterSpacing: -0.3,
  },
});
