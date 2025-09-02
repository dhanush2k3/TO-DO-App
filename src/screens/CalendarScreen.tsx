// src/screens/CalendarScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Header from '../components/Header';

const HOUR_BLOCK_HEIGHT = 60; // pixels per hour

const events = [
  {
    time: '6:00',
    title: 'Drink 8 glasses of water',
    duration: '1h',
    color: '#E4ECFE',
  },
  { time: '8:00', title: 'Get a notebook', duration: '1h', color: '#F6E4F9' },
  { time: '10:00', title: 'Work', duration: '4h', color: '#E4F9EC' },
  {
    time: '14:00',
    title: 'Lunch with Sarah',
    duration: '1h',
    color: '#FFF4E4',
  },
  { time: '15:00', title: 'Team meeting', duration: '1h', color: '#E4F0FF' },
  { time: '16:00', title: 'Gym', duration: '1h', color: '#F4E4E4' },
  { time: '18:00', title: 'Read a book', duration: '1h', color: '#EAE4F9' },
];

const dates = [
  { day: 'WED', date: '25' },
  { day: 'THU', date: '26' },
  { day: 'FRI', date: '27' },
  { day: 'SAT', date: '28' },
  { day: 'SUN', date: '29' },
  { day: 'MON', date: '30' },
];

const CalendarScreen: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(1); // THU 26

  return (
    <View style={styles.container}>
      <Header title="Calendar" date="26 Dec" />

      {/* Scrollable date tabs above the timeline (fixed-height container) */}
      <View style={styles.dateTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateTabsContent}
        >
          {dates.map((d, i) => {
            const isActive = i === selectedIndex;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedIndex(i)}
                activeOpacity={0.8}
                style={[styles.dateTab, isActive && styles.dateTabActive]}
              >
                <Text
                  style={[styles.dateDay, isActive && styles.dateDayActive]}
                >
                  {d.day}
                </Text>
                <Text
                  style={[styles.dateNum, isActive && styles.dateNumActive]}
                >
                  {d.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Timeline (unchanged behaviour / sizing) */}
      <ScrollView
        style={styles.timeline}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {Array.from({ length: 13 }).map((_, idx) => {
          const hour = idx + 6; // 6:00 to 18:00
          const timeStr = `${hour}:00`;
          const event = events.find(e => e.time === timeStr);

          return (
            <View key={hour} style={styles.timeRow}>
              <Text style={styles.timeText}>{timeStr}</Text>
              <View style={{ flex: 1 }}>
                {event && (
                  <View
                    style={[
                      styles.eventBlock,
                      {
                        backgroundColor: event.color,
                        height:
                          parseInt(event.duration, 10) * HOUR_BLOCK_HEIGHT,
                      },
                    ]}
                  >
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDuration}>{event.duration}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const TAB_CONTAINER_HEIGHT = 100; // controls how tall the date tab row is

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },

  // Date tabs container: fixed height so tabs won't stretch
  dateTabsContainer: {
    height: TAB_CONTAINER_HEIGHT,
    justifyContent: 'center',
  },
  dateTabsContent: {
    alignItems: 'center', // center tabs vertically inside the fixed-height container
    paddingHorizontal: 12,
  },

  // Each individual tab (vertical pill)
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

  // Timeline (unchanged)
  timeline: { flex: 1, marginTop: 8 },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: HOUR_BLOCK_HEIGHT,
  },
  timeText: { width: 50, textAlign: 'right', color: '#999', marginRight: 10 },

  // Event block styles (unchanged)
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
