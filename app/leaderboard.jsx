import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, ZoomIn, SlideInRight } from 'react-native-reanimated';
import BottomNav from '../components/BottomNav';

const { width } = Dimensions.get('window');

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

const TABS = ['Weekly', 'Monthly', 'All Time'];

const STUDENTS = [
  { name: 'Alex H.', score: 2450, rank: 1, change: '+3', avatar: '🦁' },
  { name: 'Sam K.', score: 2310, rank: 2, change: '+1', avatar: '🐯' },
  { name: 'Jordan T.', score: 2180, rank: 3, change: '-1', avatar: '🦊' },
  { name: 'Mia R.', score: 2150, rank: 4, change: '=', avatar: '🐼' },
  { name: '⭐ You', score: 2100, rank: 5, change: '+2', avatar: '🚀', isYou: true },
  { name: 'Chris B.', score: 1980, rank: 6, change: '-1', avatar: '🐸' },
  { name: 'Riley M.', score: 1870, rank: 7, change: '+4', avatar: '🦋' },
  { name: 'Taylor S.', score: 1720, rank: 8, change: '-2', avatar: '🐙' },
];

const PODIUM_COLORS = ['#C0A060', '#A8A8A8', '#CD7F32'];
const PODIUM_LABELS = ['1st 🥇', '2nd 🥈', '3rd 🥉'];

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View style={styles.container}>
      <View style={[styles.bgBlob, { top: -60, right: -60, backgroundColor: 'rgba(217,202,255,0.35)', width: 280, height: 280, borderRadius: 140 }]} />

      <BlurView tint="light" intensity={80} style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>COMPETITION</Text>
          <Text style={styles.headerTitle}>Leaderboard 🏆</Text>
        </View>
        <View style={styles.weekBadge}>
          <MaterialIcons name="calendar-today" size={14} color={THEME.secondary} />
          <Text style={styles.weekBadgeText}>Week 17</Text>
        </View>
      </BlurView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Tab Switcher */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.tabs}>
          {TABS.map((t, i) => (
            <Pressable key={t} onPress={() => setActiveTab(i)} style={[styles.tab, activeTab === i && styles.tabActive]}>
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </Animated.View>

        {/* Podium */}
        <Animated.View entering={ZoomIn.delay(100).springify().damping(14)} style={styles.podiumRow}>
          {[1, 0, 2].map((idx) => {
            const s = STUDENTS[idx];
            const heights = [80, 110, 60];
            return (
              <View key={s.rank} style={styles.podiumItem}>
                <Text style={styles.podiumAvatar}>{s.avatar}</Text>
                <Text style={styles.podiumName}>{s.name}</Text>
                <Text style={styles.podiumScore}>{s.score}</Text>
                <View style={[styles.podiumBlock, { height: heights[idx < 2 ? (idx === 0 ? 1 : 0) : 2], backgroundColor: PODIUM_COLORS[idx] }]}>
                  <Text style={styles.podiumLabel}>{PODIUM_LABELS[idx < 2 ? (idx === 0 ? 1 : 0) : 2]}</Text>
                </View>
              </View>
            );
          })}
        </Animated.View>

        {/* Your Rank Card */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <LinearGradient colors={[THEME.primary, THEME.primaryContainer]} style={styles.yourRankCard}>
            <View>
              <Text style={styles.yourRankLabel}>Your Current Rank</Text>
              <Text style={styles.yourRankNum}>#5 Globally</Text>
            </View>
            <View style={styles.yourRankRight}>
              <View style={styles.xpPill}><Text style={styles.xpPillText}>2,100 XP</Text></View>
              <Text style={styles.yourRankChange}>↑ +2 since last week</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Full List */}
        <Text style={styles.sectionTitle}>Full Rankings</Text>
        <View style={styles.list}>
          {STUDENTS.map((student, i) => (
            <Animated.View
              key={student.rank}
              entering={SlideInRight.delay(100 + i * 60).springify()}
              style={[styles.row, student.isYou && styles.rowYou]}
            >
              <View style={[styles.rankBubble, student.rank <= 3 && { backgroundColor: PODIUM_COLORS[student.rank - 1] }]}>
                <Text style={[styles.rankText, student.rank <= 3 && { color: '#fff' }]}>#{student.rank}</Text>
              </View>
              <Text style={styles.avatarEmoji}>{student.avatar}</Text>
              <Text style={[styles.nameText, student.isYou && styles.textYou]}>{student.name}</Text>
              <View style={styles.rowRight}>
                <Text style={[styles.changeText, student.change.startsWith('+') ? styles.changeGreen : student.change === '=' ? { color: THEME.onSurfaceVariant } : styles.changeRed]}>{student.change}</Text>
                <Text style={[styles.scoreText, student.isYou && styles.textYou]}>{student.score} pts</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <BottomNav activeTab="leaderboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  bgBlob: { position: 'absolute' },

  header: { paddingTop: 56, paddingBottom: 16, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10 },
  headerLabel: { fontSize: 10, fontWeight: '800', color: THEME.onSurfaceVariant, letterSpacing: 1 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: THEME.onSurface, marginTop: 2 },
  weekBadge: { backgroundColor: THEME.secondaryContainer, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 6 },
  weekBadgeText: { fontSize: 13, fontWeight: 'bold', color: THEME.secondary },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 160, paddingTop: 16 },

  tabs: { flexDirection: 'row', backgroundColor: THEME.surfaceHighest, borderRadius: 999, padding: 4, marginBottom: 28 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 999, alignItems: 'center' },
  tabActive: { backgroundColor: THEME.surface, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  tabText: { fontSize: 13, fontWeight: '600', color: THEME.onSurfaceVariant },
  tabTextActive: { color: THEME.primary, fontWeight: '800' },

  podiumRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 8, marginBottom: 24 },
  podiumItem: { alignItems: 'center', flex: 1 },
  podiumAvatar: { fontSize: 32, marginBottom: 4 },
  podiumName: { fontSize: 11, fontWeight: '700', color: THEME.onSurface, textAlign: 'center', marginBottom: 2 },
  podiumScore: { fontSize: 11, color: THEME.onSurfaceVariant, marginBottom: 6 },
  podiumBlock: { width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8, justifyContent: 'center', alignItems: 'center', paddingVertical: 8 },
  podiumLabel: { fontSize: 11, fontWeight: 'bold', color: '#fff' },

  yourRankCard: { borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, shadowColor: THEME.primary, shadowOpacity: 0.3, shadowRadius: 15, elevation: 6 },
  yourRankLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  yourRankNum: { color: '#fff', fontSize: 28, fontWeight: '900' },
  yourRankRight: { alignItems: 'flex-end', gap: 8 },
  xpPill: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  xpPillText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  yourRankChange: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' },

  sectionTitle: { fontSize: 18, fontWeight: '900', color: THEME.onSurface, marginBottom: 16 },
  list: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface, padding: 14, borderRadius: 14, shadowColor: THEME.onSurface, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  rowYou: { borderWidth: 2, borderColor: THEME.primaryContainer, backgroundColor: '#fff8f6' },
  rankBubble: { width: 36, height: 36, borderRadius: 18, backgroundColor: THEME.surfaceHighest, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  rankText: { fontWeight: '800', fontSize: 12, color: THEME.onSurfaceVariant },
  avatarEmoji: { fontSize: 22, marginRight: 10 },
  nameText: { flex: 1, fontSize: 15, fontWeight: '700', color: THEME.onSurface },
  textYou: { color: THEME.primary },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  changeText: { fontSize: 12, fontWeight: 'bold' },
  changeGreen: { color: THEME.tertiary },
  changeRed: { color: THEME.primary },
  scoreText: { fontSize: 13, fontWeight: '800', color: THEME.secondary },
});
