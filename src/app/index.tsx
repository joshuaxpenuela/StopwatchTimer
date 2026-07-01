import React, { useCallback } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useStopwatch } from '@/hooks/useStopwatch';
import { TimerDisplay } from '@/components/TimerDisplay';
import { GlassButton } from '@/components/GlassButton';
import { LapRow } from '@/components/LapRow';

const { width: SCREEN_W } = Dimensions.get('window');
const BUTTON_SIZE = Math.min(82, SCREEN_W * 0.21);

export default function StopwatchScreen() {
  const {
    state,
    elapsed,
    lapElapsed,
    laps,
    start,
    resume,
    pause,
    reset,
    recordLap,
  } = useStopwatch();

  const haptic = useCallback((style: Haptics.ImpactFeedbackStyle) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(style).catch(() => {});
    }
  }, []);

  const handleStartResume = useCallback(() => {
    haptic(Haptics.ImpactFeedbackStyle.Medium);
    if (state === 'idle') start();
    else resume();
  }, [state, start, resume, haptic]);

  const handlePause = useCallback(() => {
    haptic(Haptics.ImpactFeedbackStyle.Light);
    pause();
  }, [pause, haptic]);

  const handleLap = useCallback(() => {
    haptic(Haptics.ImpactFeedbackStyle.Rigid);
    recordLap();
  }, [recordLap, haptic]);

  const handleReset = useCallback(() => {
    haptic(Haptics.ImpactFeedbackStyle.Heavy);
    reset();
  }, [reset, haptic]);

  // Left button: reset (when paused/idle after started) or lap (when running)
  const leftButton = (() => {
    if (state === 'running') {
      return (
        <GlassButton
          label="Lap"
          onPress={handleLap}
          variant="dark"
          size={BUTTON_SIZE}
        />
      );
    }
    if (state === 'paused') {
      return (
        <GlassButton
          label="Reset"
          onPress={handleReset}
          variant="dark"
          size={BUTTON_SIZE}
        />
      );
    }
    // idle
    return (
      <GlassButton
        label="Lap"
        onPress={() => {}}
        variant="dark"
        size={BUTTON_SIZE}
      />
    );
  })();

  // Right button: start/stop toggle
  const rightButton = (() => {
    if (state === 'running') {
      return (
        <GlassButton
          label="Stop"
          onPress={handlePause}
          variant="red"
          size={BUTTON_SIZE}
        />
      );
    }
    return (
      <GlassButton
        label={state === 'paused' ? 'Start' : 'Start'}
        onPress={handleStartResume}
        variant="green"
        size={BUTTON_SIZE}
      />
    );
  })();

  // Build the lap list rows.
  // The first item is always the "current" running lap.
  const currentLapNumber = laps.length + 1;

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* ── Clock section ── */}
        <View style={styles.clockSection}>
          {/* Large elapsed display */}
          <TimerDisplay ms={elapsed} />

          {/* Lap timer — visible once stopwatch is started */}
          {state !== 'idle' && (
            <View style={styles.lapTimerRow}>
              <TimerDisplay ms={lapElapsed} secondary />
            </View>
          )}
        </View>

        {/* ── Control buttons ── */}
        <View style={styles.controls}>
          {leftButton}
          {rightButton}
        </View>

        {/* ── Lap list ── */}
        <ScrollView
          style={styles.lapList}
          contentContainerStyle={styles.lapListContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Current running lap row (shown when running or paused with laps) */}
          {state !== 'idle' && (
            <LapRow
              key="current"
              lap={{
                id: currentLapNumber,
                time: elapsed,
                lapTime: lapElapsed,
                isBest: false,
                isWorst: false,
              }}
              totalLaps={currentLapNumber}
              isCurrentLap
              currentLapMs={lapElapsed}
            />
          )}

          {/* Recorded laps — newest first */}
          {laps.map((lap) => (
            <LapRow
              key={lap.id}
              lap={lap}
              totalLaps={laps.length}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  clockSection: {
    paddingTop: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 200,
  },
  lapTimerRow: {
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  lapList: {
    flex: 1,
  },
  lapListContent: {
    paddingBottom: 24,
  },
});
