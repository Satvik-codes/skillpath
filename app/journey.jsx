import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import BottomNav from '../components/BottomNav';

const { width } = Dimensions.get('window');

const THEME = {
  background: '#fdf9f5',
  surface: '#ffffff',
  primary: '#ba3200',
  primaryContainer: '#ff7851',
  secondary: '#742ffc',
  secondaryContainer: '#d9caff',
  tertiary: '#00751f',
  tertiaryContainer: '#91f78e',
  onSurface: '#393836',
  onSurfaceVariant: '#666462',
  surfaceHighest: '#ebe7e4',
};

const MODULES = [
  { id: 1, title: 'Number Sense', subtitle: 'Counting, Place Value & Comparing', status: 'completed', icon: 'looks-one', xp: 500, color: THEME.tertiary, bg: THEME.tertiaryContainer },
  { id: 2, title: 'Mental Addition', subtitle: 'Single & Double Digit Addition', status: 'completed', icon: 'looks-two', xp: 600, color: THEME.tertiary, bg: THEME.tertiaryContainer },
  { id: 3, title: 'Subtraction', subtitle: 'Borrowing & Number Lines', status: 'active', icon: 'looks-3', xp: 700, color: THEME.primary, bg: '#fde8e0' },
  { id: 4, title: 'Multiplication', subtitle: 'Times Tables & Arrays', status: 'locked', icon: 'looks-4', xp: 800, color: THEME.onSurfaceVariant, bg: THEME.surfaceHighest },
  { id: 5, title: 'Division', subtitle: 'Sharing & Grouping', status: 'locked', icon: 'looks-5', xp: 900, color: THEME.onSurfaceVariant, bg: THEME.surfaceHighest },
  { id: 6, title: 'Fractions', subtitle: 'Parts of a Whole', status: 'locked', icon: 'looks-6', xp: 1000, color: THEME.onSurfaceVariant, bg: THEME.surfaceHighest },
];

export default function JourneyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={[styles.bgBlob, { top: -80, right: -60, backgroundColor: 'rgba(145,247,142,0.3)', width: 300, height: 300, borderRadius: 150 }]} />
      <View style={[styles.bgBlob, { bottom: 200, left: -80, backgroundColor: 'rgba(217,202,255,0.2)', width: 280, height: 280, borderRadius: 140 }]} />

      {/* Header */}
      <BlurView tint="light" intensity={80} style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>YOUR ADVENTURE</Text>
          <Text style={styles.headerTitle}>Course Journey 🗺️</Text>
        </View>
        <View style={styles.xpBadge}>
          <MaterialIcons name="auto-awesome" size={16} color={THEME.secondary} />
          <Text style={styles.xpBadgeText}>1,100 XP</Text>
        </View>
      </BlurView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Overall progress bar */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.overallCard}>
          <Text style={styles.overallLabel}>Overall Progress</Text>
          <Text style={styles.overallPct}>33% Complete</Text>
          <View style={styles.overallTrack}>
            <LinearGradient colors={[THEME.tertiary, THEME.tertiaryContainer]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.overallFill, { width: '33%' }]} />
          </View>
          <Text style={styles.overallSub}>2 of 6 modules mastered</Text>
        </Animated.View>

        {/* Timeline */}
        <View style={styles.timeline}>
          <View style={styles.timelineLine} />
          {MODULES.map((mod, i) => (
            <Animated.View key={mod.id} entering={FadeInDown.delay(i * 100).springify()} style={styles.nodeRow}>
              {/* Circle node */}
              <Pressable
                disabled={mod.status === 'locked'}
                onPress={() => mod.status !== 'locked' && router.push('/worksheet')}
                style={[styles.circle, { backgroundColor: mod.bg, borderColor: mod.color, borderWidth: mod.status === 'active' ? 3 : 1 }]}
              >
                <MaterialIcons
                  name={mod.status === 'completed' ? 'check' : mod.status === 'active' ? 'play-arrow' : 'lock'}
                  size={22}
                  color={mod.color}
                />
              </Pressable>

              {/* Card */}
              <Pressable
                disabled={mod.status === 'locked'}
                onPress={() => mod.status !== 'locked' && router.push('/worksheet')}
                style={[styles.nodeCard,
                  mod.status === 'active' && styles.nodeCardActive,
                  mod.status === 'locked' && styles.nodeCardLocked
                ]}
              >
                <View style={styles.nodeCardTop}>
                  <View>
                    <Text style={[styles.nodeName, mod.status === 'locked' && { color: THEME.onSurfaceVariant }]}>{mod.title}</Text>
                    <Text style={styles.nodeSub}>{mod.subtitle}</Text>
                  </View>
                  <View style={[styles.xpPill, { backgroundColor: mod.bg }]}>
                    <Text style={[styles.xpPillText, { color: mod.color }]}>{mod.xp} XP</Text>
                  </View>
                </View>
                {mod.status === 'active' && (
                  <View style={styles.activeProgressBar}>
                    <View style={styles.activeProgressTrack}>
                      <LinearGradient colors={[THEME.primary, THEME.primaryContainer]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.activeProgressFill, { width: '40%' }]} />
                    </View>
                    <Text style={styles.activeProgressText}>40% done</Text>
                  </View>
                )}
                {mod.status === 'completed' && (
                  <View style={styles.completedRow}>
                    <MaterialIcons name="verified" size={14} color={THEME.tertiary} />
                    <Text style={styles.completedText}>Mastered!</Text>
                  </View>
                )}
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      <BottomNav activeTab="map" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  bgBlob: { position: 'absolute' },
  header: { paddingTop: 56, paddingBottom: 16, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 10 },
  headerLabel: { fontSize: 10, fontWeight: '800', color: THEME.onSurfaceVariant, letterSpacing: 1 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: THEME.onSurface, marginTop: 2 },
  xpBadge: { backgroundColor: THEME.secondaryContainer, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 6 },
  xpBadgeText: { fontSize: 13, fontWeight: 'bold', color: THEME.secondary },

  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 160 },

  overallCard: { backgroundColor: THEME.surface, borderRadius: 20, padding: 20, marginBottom: 32, shadowColor: THEME.onSurface, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.07, shadowRadius: 20, elevation: 4 },
  overallLabel: { fontSize: 11, fontWeight: '700', color: THEME.onSurfaceVariant, letterSpacing: 0.5, marginBottom: 4 },
  overallPct: { fontSize: 28, fontWeight: '900', color: THEME.onSurface, marginBottom: 12 },
  overallTrack: { height: 12, backgroundColor: THEME.surfaceHighest, borderRadius: 999, overflow: 'hidden', marginBottom: 8 },
  overallFill: { height: '100%', borderRadius: 999 },
  overallSub: { fontSize: 12, color: THEME.onSurfaceVariant },

  timeline: { position: 'relative', paddingLeft: 28 },
  timelineLine: { position: 'absolute', left: 47, top: 20, bottom: 20, width: 2, backgroundColor: THEME.surfaceHighest },

  nodeRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, gap: 16 },
  circle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', zIndex: 1, backgroundColor: THEME.surface, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },

  nodeCard: { flex: 1, backgroundColor: THEME.surface, borderRadius: 16, padding: 16, shadowColor: THEME.onSurface, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  nodeCardActive: { borderWidth: 2, borderColor: THEME.primaryContainer, shadowColor: THEME.primary, shadowOpacity: 0.15, shadowRadius: 16 },
  nodeCardLocked: { opacity: 0.5 },
  nodeCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nodeName: { fontSize: 15, fontWeight: '800', color: THEME.onSurface, marginBottom: 4 },
  nodeSub: { fontSize: 12, color: THEME.onSurfaceVariant, lineHeight: 16 },
  xpPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  xpPillText: { fontSize: 11, fontWeight: 'bold' },

  activeProgressBar: { marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  activeProgressTrack: { flex: 1, height: 6, backgroundColor: THEME.surfaceHighest, borderRadius: 3, overflow: 'hidden' },
  activeProgressFill: { height: '100%', borderRadius: 3 },
  activeProgressText: { fontSize: 11, color: THEME.primary, fontWeight: 'bold' },

  completedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  completedText: { fontSize: 12, color: THEME.tertiary, fontWeight: 'bold' },
});
