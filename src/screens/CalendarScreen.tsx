// src/screens/CalendarScreen.tsx
import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

const HOUR_BLOCK_HEIGHT = 60; // px per hour
const TAB_CONTAINER_HEIGHT = 100;

type Task = {
  id: string;
  title: string;
  category: 'Health' | 'Work' | 'Mental Health' | 'Others' | string;
  categoryColor?: string;
  date: string; // "YYYY-MM-DD"
  time: string; // e.g. "17:30" or "05:30 PM" depending on locale
  duration: '30m' | '1h' | '2h' | '3h' | '4h' | string;
};

const EVENT_FILL: Record<string, string> = {
  Health: '#E4ECFE', // light blue
  Work: '#E4F9EC', // light green
  'Mental Health': '#F6E4F9', // light purple
  Others: '#FFF4E4', // light orange/peach
  default: '#EAE4F9',
};

// --------- Utilities ----------
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toISODate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const monthShort = (i: number) =>
  [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][i];
const dayShort = (i: number) =>
  ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][i];

// “26 Dec”
const headerDate = (d: Date) => `${d.getDate()} ${monthShort(d.getMonth())}`;

// Build 6 pills, centered with selected at index 1
const buildPills = (selected: Date) => {
  const start = new Date(selected);
  start.setDate(selected.getDate() - 1);
  return Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

// Parse "17:44", "05:44 PM", "5:00", etc -> 24h { hour, minute }
const parseTime = (time: string): { hour: number; minute: number } => {
  if (!time) return { hour: 0, minute: 0 };

  // Try 24h first: "17:44"
  const m24 = time.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) {
    const hour = Math.min(23, parseInt(m24[1], 10));
    const minute = Math.min(59, parseInt(m24[2], 10));
    return { hour, minute };
  }

  // Try 12h: "05:44 PM" / "5:44 pm"
  const m12 = time.match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/i);
  if (m12) {
    let hour = parseInt(m12[1], 10);
    const minute = Math.min(59, parseInt(m12[2], 10));
    const ampm = m12[3].toLowerCase();
    if (ampm === 'pm' && hour < 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;
    return { hour, minute };
  }

  // Fallback
  return { hour: 0, minute: 0 };
};

// Convert "30m" / "1h" / "2h" ... -> duration in hours (0.5, 1, 2, ...)
const durationToHours = (d: string): number => {
  if (!d) return 1;
  const h = d.match(/^(\d+)h$/i);
  if (h) return parseInt(h[1], 10);
  const m = d.match(/^(\d+)m$/i);
  if (m) return parseInt(m[1], 10) / 60;
  return 1;
};

const CalendarScreen: React.FC = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedIndex, setSelectedIndex] = useState<number>(1);
  // Refresh tasks when screen focuses
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const raw = await AsyncStorage.getItem('tasks');
        const tasks = raw ? JSON.parse(raw) : [];

        setAllTasks(tasks);

        if (tasks.length > 0) {
          const earliest = tasks.reduce(
            (min: string, t: Task) => (t.date < min ? t.date : min),
            tasks[0].date,
          );

          setSelectedDate(new Date(earliest));
          setSelectedIndex(1);
        }
      };
      load();
    }, []),
  );

  // Build 6 pills around current selection
  const pills = useMemo(() => buildPills(selectedDate), [selectedDate]);

  // Tasks filtered for the selected day
  const dayIso = toISODate(selectedDate);
  const dayTasks = useMemo(() => {
    return allTasks.filter(t => t.date === dayIso);
  }, [allTasks, dayIso]);

  // Transform to “events” that the timeline expects
  type EventBlock = {
    timeKey: string;
    title: string;
    hours: number;
    color: string;
  };
  const events: EventBlock[] = useMemo(() => {
    return dayTasks.map(t => {
      const { hour /* minute */ } = parseTime(t.time);

      // keep design: snap minutes to the lower hour row
      const snappedHour = Math.max(0, Math.min(23, hour));
      const timeKey = `${snappedHour}:00`;

      const hours = durationToHours(t.duration);
      const color = EVENT_FILL[t.category] || EVENT_FILL.default;

      return {
        timeKey,
        title: t.title,
        hours,
        color,
      };
    });
  }, [dayTasks]);

  // Events by hour (allow multiple events in the same hour; they’ll stack vertically inside the cell)
  const eventsByHour = useMemo(() => {
    const map: Record<string, EventBlock[]> = {};
    events.forEach(e => {
      if (!map[e.timeKey]) map[e.timeKey] = [];
      map[e.timeKey].push(e);
    });
    return map;
  }, [events]);

  // Header date text like "26 Dec"
  const headerDateText = headerDate(selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Header title="Calendar" date={headerDateText} />

      {/* Date pills (same look, now dynamic) */}
      <View style={styles.dateTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateTabsContent}
        >
          {pills.map((d, i) => {
            const isActive = i === selectedIndex;
            return (
              <TouchableOpacity
                key={`${d.toDateString()}-${i}`}
                onPress={() => {
                  setSelectedIndex(i);
                  setSelectedDate(d);
                }}
                activeOpacity={0.8}
                style={[styles.dateTab, isActive && styles.dateTabActive]}
              >
                <Text
                  style={[styles.dateDay, isActive && styles.dateDayActive]}
                >
                  {dayShort(d.getDay())}
                </Text>
                <Text
                  style={[styles.dateNum, isActive && styles.dateNumActive]}
                >
                  {d.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Timeline (same structure, just reading from eventsByHour) */}
      <ScrollView
        style={styles.timeline}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {Array.from({ length: 13 }).map((_, idx) => {
          const hour = idx + 6; // 6:00 to 18:00
          const timeStr = `${hour}:00`;
          const blocks = eventsByHour[timeStr] || [];

          return (
            <View key={hour} style={styles.timeRow}>
              <Text style={styles.timeText}>{timeStr}</Text>
              <View style={{ flex: 1 }}>
                {blocks.map((ev, j) => (
                  <View
                    key={`${timeStr}-${j}`}
                    style={[
                      styles.eventBlock,
                      {
                        backgroundColor: ev.color,
                        height: ev.hours * HOUR_BLOCK_HEIGHT,
                        marginBottom: 8,
                      },
                    ]}
                  >
                    <Text style={styles.eventTitle}>{ev.title}</Text>
                    <Text style={styles.eventDuration}>
                      {ev.hours === 0.5 ? '30m' : `${ev.hours}h`}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },

  // Date tabs container
  dateTabsContainer: {
    height: TAB_CONTAINER_HEIGHT,
    justifyContent: 'center',
  },
  dateTabsContent: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  dateTab: {
    width: 64,
    height: 88,
    borderRadius: 14,
    backgroundColor: '#f2f2f2',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTabActive: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
  },

  dateDay: {
    fontSize: 12,
    color: '#777',
    fontWeight: '500',
  },
  dateNum: {
    fontSize: 16,
    color: '#777',
    fontWeight: '700',
    marginTop: 6,
  },
  dateDayActive: {
    color: '#000',
    fontWeight: '700',
  },
  dateNumActive: {
    color: '#000',
  },

  // Timeline
  timeline: { flex: 1, marginTop: 8 },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: HOUR_BLOCK_HEIGHT,
  },
  timeText: { width: 50, textAlign: 'right', color: '#999', marginRight: 10 },

  // Event block
  eventBlock: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  eventTitle: { fontSize: 16, fontWeight: '800' },
  eventDuration: { fontSize: 14, color: '#666', marginTop: 6 },
});

export default CalendarScreen;
