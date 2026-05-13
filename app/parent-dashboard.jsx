import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import BottomNav from '../components/BottomNav';

const THEME = {
  background: '#fdf9f5',
  surface: '#ffffff',
  surfaceHighest: '#ebe7e4',
  primary: '#ba3200',
  primaryContainer: '#ff7851',
  secondary: '#742ffc',
  secondaryContainer: '#d9caff',
  tertiary: '#00751f',
  tertiaryContainer: '#91f78e',
  onSurface: '#393836',
  onSurfaceVariant: '#666462',
};

const WEEKLY_STATS = [
  { label: 'Total Time', value: '12h 45m', icon: 'schedule', color: THEME.secondary, bg: THEME.secondaryContainer },
  { label: 'Avg Score', value: '88%', icon: 'verified', color: THEME.tertiary, bg: THEME.tertiaryContainer },
  { label: 'Streak', value: '5 days 🔥', icon: 'local-fire-department', color: THEME.primary, bg: '#fde8e0' },
  { label: 'XP Earned', value: '2,100', icon: 'auto-awesome', color: '#b5860d', bg: '#fef3c7' },
];

const SUBJECTS = [
  { name: 'Mathematics', score: 88, color: THEME.secondary, c2: THEME.secondaryContainer },
  { name: 'Language Arts', score: 74, color: THEME.tertiary, c2: THEME.tertiaryContainer },
  { name: 'Logical Reasoning', score: 65, color: THEME.primary, c2: THEME.primaryContainer },
  { name: 'Creative Thinking', score: 91, color: '#b5860d', c2: '#fef3c7' },
];

export default function ParentDashboardScreen() {
  const [dailyReminder, setDailyReminder] = useState(true);
  const [goalMinutes, setGoalMinutes] = useState('20');

  return (
    <View style={styles.container}>
      <View style={[styles.bgBlob, { top: -60, left: -60, backgroundColor: 'rgba(145,247,142,0.2)', width: 280, height: 280, borderRadius: 140 }]} />

      <BlurView tint="light" intensity={80} style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>PARENT PORTAL</Text>
          <Text style={styles.headerTitle}>Dashboard 👨‍👩‍👧</Text>
        </View>
        <View style={styles.childChip}>
          <Text style={styles.childChipText}>Leo · Grade 3</Text>
        </View>
      </BlurView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* AI Summary Card */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.summaryCard}>
          <LinearGradient colors={[THEME.secondary, '#6816f0']} style={styles.summaryGrad}>
            <View style={styles.summaryIconBox}>
              <MaterialIcons name="psychology" size={28} color="#fff" />
            </View>
            <Text style={styles.summaryTitle}>AI Coach Report</Text>
            <Text style={styles.summaryBody}>
              Leo is excelling in Creative Thinking (91%) but needs extra support with Logical Reasoning. Consider assigning more{' '}
              <Text style={{ fontWeight: 'bold', color: THEME.tertiaryContainer }}>Logic Puzzles</Text> this week.
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.statsGrid}>
          {WEEKLY_STATS.map((s, i) => (
            <View key={i} style={[styles.statCard, { borderLeftColor: s.color, borderLeftWidth: 4 }]}>
              <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                <MaterialIcons name={s.icon} size={20} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Subject Breakdown */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Subject Breakdown</Text>
          <View style={styles.subjectList}>
            {SUBJECTS.map((sub, i) => (
              <View key={i} style={styles.subjectRow}>
                <View style={styles.subjectRowTop}>
                  <Text style={styles.subjectName}>{sub.name}</Text>
                  <Text style={[styles.subjectPct, { color: sub.color }]}>{sub.score}%</Text>
                </View>
                <View style={styles.subjectTrack}>
                  <LinearGradient colors={[sub.color, sub.c2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.subjectFill, { width: `${sub.score}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Struggling Topic */}
        <Animated.View entering={FadeInDown.delay(250)} style={styles.alertCard}>
          <MaterialIcons name="warning" size={22} color="#c08000" />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Needs Attention</Text>
            <Text style={styles.alertBody}>Leo is struggling with <Text style={{ fontWeight: 'bold' }}>Fractions</Text> (answered incorrectly 7 times today).</Text>
          </View>
        </Animated.View>

        {/* Assign Practice */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Assign Practice</Text>
          <View style={styles.assignGrid}>
            {['Fraction Review', 'Times Tables', 'Logic Mazes', 'Reading Comprehension'].map((task) => (
              <Pressable key={task} style={styles.assignBtn}>
                <MaterialIcons name="add-task" size={18} color={THEME.secondary} />
                <Text style={styles.assignText}>{task}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Settings */}
        <Animated.View entering={FadeInDown.delay(350)} style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Daily Reminder</Text>
              <Switch
                value={dailyReminder}
                onValueChange={setDailyReminder}
                trackColor={{ true: THEME.primary, false: THEME.surfaceHighest }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Daily Goal (minutes)</Text>
              <TextInput
                style={styles.settingInput}
                value={goalMinutes}
                onChangeText={setGoalMinutes}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <Pressable style={styles.ctaBtn}>
            <LinearGradient colors={[THEME.primary, THEME.primaryContainer]} style={styles.ctaGrad}>
              <MaterialIcons name="send" size={22} color="#fff" />
              <Text style={styles.ctaText}>Send Weekly Report to Email</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

      </ScrollView>
      <BottomNav activeTab="family-restroom" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  bgBlob: { position: 'absolute' },

  header: { paddingTop: 56, paddingBottom: 16, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10 },
  headerLabel: { fontSize: 10, fontWeight: '800', color: THEME.onSurfaceVariant, letterSpacing: 1 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: THEME.onSurface, marginTop: 2 },
  childChip: { backgroundColor: THEME.secondaryContainer, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  childChipText: { fontSize: 13, fontWeight: 'bold', color: THEME.secondary },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 160, paddingTop: 16 },

  summaryCard: { borderRadius: 20, marginBottom: 24, overflow: 'hidden', shadowColor: THEME.secondary, shadowOpacity: 0.25, shadowRadius: 15, elevation: 6 },
  summaryGrad: { padding: 22 },
  summaryIconBox: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  summaryTitle: { fontSize: 18, fontWeight: '900', color: '#fff', marginBottom: 10 },
  summaryBody: { fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 22 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: { width: '47%', backgroundColor: THEME.surface, borderRadius: 16, padding: 16, shadowColor: THEME.onSurface, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 20, fontWeight: '900', color: THEME.onSurface, marginBottom: 2 },
  statLabel: { fontSize: 11, color: THEME.onSurfaceVariant, fontWeight: '600' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: THEME.onSurface, marginBottom: 14 },
  subjectList: { backgroundColor: THEME.surface, borderRadius: 16, padding: 20, gap: 18, shadowColor: THEME.onSurface, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  subjectRow: {},
  subjectRowTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  subjectName: { fontSize: 14, fontWeight: '700', color: THEME.onSurface },
  subjectPct: { fontSize: 14, fontWeight: 'bold' },
  subjectTrack: { height: 10, backgroundColor: THEME.surfaceHighest, borderRadius: 999, overflow: 'hidden' },
  subjectFill: { height: '100%', borderRadius: 999 },

  alertCard: { backgroundColor: '#fffbeb', borderRadius: 14, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderWidth: 1, borderColor: '#fde68a', marginBottom: 24 },
  alertTitle: { fontSize: 14, fontWeight: 'bold', color: '#92400e', marginBottom: 4 },
  alertBody: { fontSize: 13, color: '#78350f', lineHeight: 18 },

  assignGrid: { gap: 10 },
  assignBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: THEME.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: THEME.secondaryContainer, shadowColor: THEME.onSurface, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  assignText: { fontSize: 14, fontWeight: '700', color: THEME.onSurface },

  settingsCard: { backgroundColor: THEME.surface, borderRadius: 16, overflow: 'hidden', shadowColor: THEME.onSurface, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  settingLabel: { fontSize: 14, fontWeight: '600', color: THEME.onSurface },
  settingInput: { borderWidth: 1, borderColor: THEME.surfaceHighest, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, fontSize: 16, fontWeight: 'bold', color: THEME.primary, width: 60, textAlign: 'center' },
  settingDivider: { height: 1, backgroundColor: THEME.surfaceHighest, marginHorizontal: 20 },

  ctaBtn: { shadowColor: THEME.primary, shadowOpacity: 0.3, shadowRadius: 15, elevation: 6 },
  ctaGrad: { height: 60, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  ctaText: { fontSize: 16, fontWeight: '900', color: '#fff' },
});
