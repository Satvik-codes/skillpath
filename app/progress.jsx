import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';
import Svg, { Path, Circle as SvgCircle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown, ZoomIn, useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const THEME = {
  background: '#EEF5F1',
  surface: '#ffffff',
  surfaceLow: '#fdf9f5',
  surfaceHighest: '#ebe7e4',
  primary: '#ba3200',
  primaryContainer: '#ff7851',
  secondary: '#742ffc',
  secondaryContainer: '#d9caff',
  tertiary: '#00751f',
  tertiaryContainer: '#91f78e',
  onSurface: '#393836',
  onSurfaceVariant: '#666462'
};

export default function ProgressAnalytics() {
  // Graph grow animation state
  const growAnim = useSharedValue(0);

  React.useEffect(() => {
    growAnim.value = withDelay(500, withTiming(1, { duration: 1000 }));
  }, []);

  const animatedGrowStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: growAnim.value }],
    transformOrigin: 'left'
  }));

  return (
    <View style={styles.container}>
      {/* Background Organic Blobs */}
      <View style={[styles.bgBlob, { top: 40, left: -60, backgroundColor: 'rgba(145, 247, 142, 0.4)', borderRadius: 150, width: 300, height: 300 }]} />
      <View style={[styles.bgBlob, { top: 240, right: -80, backgroundColor: 'rgba(217, 202, 255, 0.3)', borderRadius: 180, width: 360, height: 360 }]} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <Animated.View entering={FadeInDown.duration(700).springify()} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroLabel}>CURRENT PROGRESS</Text>
              <Text style={styles.heroTitle}>78% Mastered</Text>
              <Text style={styles.heroSub}>You're in the top 5% of explorers this month!</Text>
            </View>
            <View style={styles.badge}>
              <MaterialIcons name="trending-up" size={16} color={THEME.tertiary} />
              <Text style={styles.badgeText}>+12% from last month</Text>
            </View>
          </View>

          {/* Curved Line Chart (Perfect SVG port) */}
          <View style={styles.chartContainer}>
            <Svg width="100%" height={150} viewBox="0 0 400 150" preserveAspectRatio="none">
              <Defs>
                <SvgLinearGradient id="gradArea" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor={THEME.tertiary} stopOpacity={0.2} />
                  <Stop offset="100%" stopColor={THEME.tertiary} stopOpacity={0} />
                </SvgLinearGradient>
                <SvgLinearGradient id="gradLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor={THEME.tertiaryContainer} />
                  <Stop offset="100%" stopColor={THEME.tertiary} />
                </SvgLinearGradient>
              </Defs>
              <Path 
                d="M0,150 C50,140 80,100 120,110 C160,120 200,40 250,60 C300,80 350,10 400,20 L400,150 L0,150 Z" 
                fill="url(#gradArea)" 
              />
              <Path 
                d="M0,150 C50,140 80,100 120,110 C160,120 200,40 250,60 C300,80 350,10 400,20" 
                fill="none" 
                stroke="url(#gradLine)" 
                strokeWidth={5} 
                strokeLinecap="round" 
              />
              <SvgCircle cx="120" cy="110" r="6" fill={THEME.tertiary} />
              <SvgCircle cx="250" cy="60" r="6" fill={THEME.tertiary} />
              <SvgCircle cx="400" cy="20" r="8" fill={THEME.tertiary} stroke="#fff" strokeWidth={4} />
            </Svg>
            <View style={styles.chartLabels}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(lbl => (
                <Text key={lbl} style={styles.chartLbl}>{lbl}</Text>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Bento Stats */}
        <Animated.View entering={FadeIn.delay(200)} style={styles.bentoGrid}>
          {[
            { title: 'Total Worksheets', val: '124', icon: 'description', color: THEME.secondary, bg: THEME.surfaceLow },
            { title: 'Accuracy Rate', val: '94.2%', icon: 'verified', color: THEME.tertiary, sub: '+2.4% vs Avg', bg: THEME.surfaceLow },
          ].map((item, idx) => (
            <View key={idx} style={[styles.bentoCard, { backgroundColor: item.bg }]}>
              <View style={[styles.bentoIcon, { backgroundColor: `${item.color}20` }]}>
                <MaterialIcons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.bentoTitle}>{item.title}</Text>
              <Text style={styles.bentoVal}>{item.val}</Text>
              {item.sub ? (
                <Text style={[styles.bentoSub, { color: item.color }]}>{item.sub}</Text>
              ) : (
                <View style={styles.bentoProgressTrack}>
                  <View style={[styles.bentoProgressFill, { width: '75%', backgroundColor: item.color }]} />
                </View>
              )}
            </View>
          ))}
          
          {/* Third Card - Next Milestone */}
          <View style={[styles.bentoCard, { backgroundColor: THEME.primary }]}>
            <View style={styles.bentoIconLight}>
              <MaterialIcons name="workspace-premium" size={24} color="#fff" />
            </View>
            <Text style={[styles.bentoTitle, { color: 'rgba(255,255,255,0.8)' }]}>Next Milestone</Text>
            <Text style={[styles.bentoVal, { color: '#fff' }]}>Logic Master</Text>
            <Text style={[styles.bentoSub, { color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', fontWeight: '400' }]}>8,500 XP to reach</Text>
          </View>
        </Animated.View>

        {/* Skill Breakdown */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.skillsSection}>
          <View style={styles.skillsHeader}>
            <View>
              <Text style={styles.skillsTitle}>Skill Breakdown</Text>
              <Text style={styles.skillsSub}>Where you shine the brightest</Text>
            </View>
            <Text style={styles.skillsLink}>View full report <MaterialIcons name="arrow-forward" size={12} /></Text>
          </View>

          <View style={styles.skillsList}>
            {[
              { name: 'Creative Problem Solving', val: '88%', c1: THEME.tertiary, c2: THEME.tertiaryContainer },
              { name: 'Logical Reasoning', val: '72%', c1: THEME.secondary, c2: THEME.secondaryContainer },
              { name: 'Language Arts', val: '65%', c1: THEME.primary, c2: THEME.primaryContainer },
            ].map((s, i) => (
              <View key={i} style={styles.skillRow}>
                <View style={styles.skillRowHeader}>
                  <Text style={styles.skillName}>{s.name}</Text>
                  <Text style={[styles.skillVal, { color: s.c1 }]}>{s.val}</Text>
                </View>
                <View style={styles.skillTrack}>
                  <Animated.View style={[{ width: s.val, height: '100%', borderRadius: 999, overflow: 'hidden' }, animatedGrowStyle]}>
                    <LinearGradient colors={[s.c1, s.c2]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                  </Animated.View>
                </View>
              </View>
            ))}
          </View>

          {/* AI Insight Card (Rotated) */}
          <Animated.View entering={ZoomIn.delay(600).springify().damping(12)}>
            <BlurView tint="light" intensity={40} style={styles.insightCard}>
              <View style={styles.insightIconBox}>
                <MaterialIcons name="auto-awesome" size={24} color="#fff" />
              </View>
              <Text style={styles.insightTitle}>AI Coach Insight</Text>
              <Text style={styles.insightBody}>
                "Your pattern recognition has improved significantly! Try more <Text style={{ color: THEME.secondary, fontWeight: 'bold' }}>Logic Mazes</Text> this week to unlock the next level."
              </Text>
              <Pressable style={styles.insightBtn}>
                <Text style={styles.insightBtnText}>Accept Recommendation</Text>
              </Pressable>
            </BlurView>
          </Animated.View>
        </Animated.View>

      </ScrollView>

      {/* Shared Absolute Header */}
      <BlurView tint="light" intensity={80} style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB46gm67qu2hnbS2JZO89nhPyG01G7XJ9wZ18A3wZAu65w3yF-POdUGEXmkw08J-GmlMbo_3qBrFVfihDNvv940JYlGdg8HX65mB9uZRTtUx3tSxwMNE5uRrydpdJQdPLB6LzA6O4hNQOanQ7sBWlG4utmwzZNBxjrFfkfizsVN18vd7JwnnXw1bxppWhABlqNDXy15d815IlFxngTyTdi_zxFT4nlq6KnzLq_7EphssRF8HhAwxFovAuQpkTQil1G9Z8WbDWLY9_8' }} style={styles.avatarPfp} />
          <Text style={styles.logoText}>SkillPath</Text>
        </View>
        <MaterialIcons name="settings" size={24} color="#ea580c" />
      </BlurView>

      <BottomNav activeTab="analytics" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  bgBlob: { position: 'absolute', opacity: 0.8 },
  scrollContent: { paddingTop: 100, paddingBottom: 140, paddingHorizontal: 24, zIndex: 10 },
  
  heroCard: { backgroundColor: THEME.surface, borderRadius: 28, padding: 24, shadowColor: THEME.onSurface, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 30, elevation: 5, marginBottom: 24 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 },
  heroLabel: { fontSize: 10,  fontWeight: '800', color: THEME.tertiary, letterSpacing: 0.5 },
  heroTitle: { fontSize: 40, fontWeight: '900', color: THEME.onSurface, marginTop: 4, letterSpacing: -1 },
  heroSub: { fontSize: 14, color: THEME.onSurfaceVariant, marginTop: 8 },
  badge: { backgroundColor: 'rgba(145, 247, 142, 0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 6, borderColor: 'rgba(0, 117, 31, 0.1)', borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: THEME.tertiary },
  chartContainer: { height: 180, marginTop: 40, position: 'relative' },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, marginTop: 8 },
  chartLbl: { fontSize: 10, fontWeight: '500', color: THEME.onSurfaceVariant },

  bentoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32 },
  bentoCard: { width: '100%', borderRadius: 28, padding: 24, shadowColor: THEME.onSurface, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 30, elevation: 4 },
  bentoIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  bentoIconLight: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  bentoTitle: { fontSize: 12, fontWeight: '600', color: THEME.onSurfaceVariant },
  bentoVal: { fontSize: 28, fontWeight: '900', color: THEME.onSurface, marginTop: 4 },
  bentoSub: { fontSize: 10, fontWeight: 'bold', marginTop: 8 },
  bentoProgressTrack: { height: 6, backgroundColor: THEME.surfaceHighest, borderRadius: 3, marginTop: 12, overflow: 'hidden' },
  bentoProgressFill: { height: '100%', borderRadius: 3 },

  skillsSection: { marginBottom: 32 },
  skillsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 },
  skillsTitle: { fontSize: 24, fontWeight: '900', color: THEME.onSurface },
  skillsSub: { fontSize: 14, color: THEME.onSurfaceVariant },
  skillsLink: { fontSize: 12, fontWeight: 'bold', color: THEME.tertiary },
  skillsList: { gap: 24, marginBottom: 40 },
  skillRowHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  skillName: { fontSize: 14, fontWeight: 'bold', color: THEME.onSurface },
  skillVal: { fontSize: 14, fontWeight: 'bold' },
  skillTrack: { height: 16, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 999, padding: 4 },
  skillFill: { height: '100%', borderRadius: 999 },

  insightCard: { backgroundColor: THEME.surfaceHighest, padding: 24, borderRadius: 32, transform: [{ rotateZ: '2deg' }], shadowColor: THEME.onSurface, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)', overflow: 'hidden' },
  insightIconBox: { position: 'absolute', top: -16, right: -16, width: 64, height: 64, backgroundColor: THEME.tertiary, borderRadius: 16, transform: [{ rotateZ: '12deg' }], justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  insightTitle: { fontSize: 20, fontWeight: 'bold', color: THEME.onSurface, marginBottom: 12 },
  insightBody: { fontSize: 14, color: THEME.onSurfaceVariant, lineHeight: 22, paddingRight: 30 },
  insightBtn: { backgroundColor: THEME.onSurface, paddingVertical: 16, borderRadius: 999, alignItems: 'center', marginTop: 24 },
  insightBtnText: { color: THEME.surface, fontWeight: 'bold', fontSize: 14 },

  // Shared Fixed Header & Footer
  topHeader: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', zIndex: 100 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarPfp: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: THEME.primaryContainer },
  logoText: { fontSize: 20, fontWeight: '900', color: '#ea580c' }
});
