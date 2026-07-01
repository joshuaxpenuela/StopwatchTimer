import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { splitTime } from '@/constants/formatTime';

interface TimerDisplayProps {
  ms: number;
  /** Smaller secondary display (lap timer) */
  secondary?: boolean;
}

export function TimerDisplay({ ms, secondary = false }: TimerDisplayProps) {
  const { main, cents } = splitTime(ms);

  if (secondary) {
    return (
      <View style={styles.secondaryRow}>
        <Text style={styles.secondaryText}>
          {main}
          <Text style={styles.secondaryCents}>{cents}</Text>
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.primaryRow}>
      <Text style={styles.primaryMain} allowFontScaling={false}>
        {main}
      </Text>
      <Text style={styles.primaryCents} allowFontScaling={false}>
        {cents}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  primaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  primaryMain: {
    fontFamily: 'System',
    fontVariant: ['tabular-nums'],
    fontSize: 86,
    fontWeight: '200',
    color: '#FFFFFF',
    letterSpacing: -4,
    lineHeight: 96,
    includeFontPadding: false,
  },
  primaryCents: {
    fontFamily: 'System',
    fontVariant: ['tabular-nums'],
    fontSize: 48,
    fontWeight: '200',
    color: '#FFFFFF',
    letterSpacing: -2,
    lineHeight: 60,
    marginBottom: 6,
    includeFontPadding: false,
  },
  secondaryRow: {
    alignItems: 'center',
  },
  secondaryText: {
    fontFamily: 'System',
    fontVariant: ['tabular-nums'],
    fontSize: 22,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: -0.5,
  },
  secondaryCents: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.40)',
  },
});
