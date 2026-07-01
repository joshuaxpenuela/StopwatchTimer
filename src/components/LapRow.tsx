import { formatTime } from "@/constants/formatTime";
import { Lap } from "@/hooks/useStopwatch";
import { StyleSheet, Text, View } from "react-native";

interface LapRowProps {
  lap: Lap;
  totalLaps: number;
  isCurrentLap?: boolean;
  currentLapMs?: number;
}

export function LapRow({
  lap,
  totalLaps,
  isCurrentLap,
  currentLapMs,
}: LapRowProps) {
  const lapNumber = lap.id;

  const labelColor = lap.isBest
    ? "#34C759"
    : lap.isWorst
      ? "#FF3B30"
      : "rgba(255,255,255,0.85)";

  const displayMs = isCurrentLap ? (currentLapMs ?? 0) : lap.lapTime;

  return (
    <View style={styles.row}>
      <View style={styles.separator} />
      <View style={styles.content}>
        <Text style={[styles.lapLabel, { color: labelColor }]}>
          {`Lap ${lapNumber}`}
        </Text>
        <Text style={[styles.lapTime, { color: labelColor }]}>
          {formatTime(displayMs)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  lapLabel: {
    fontSize: 17,
    fontWeight: "400",
    letterSpacing: -0.2,
  },
  lapTime: {
    fontSize: 17,
    fontWeight: "400",
    fontVariant: ["tabular-nums"],
    letterSpacing: -0.5,
  },
});
