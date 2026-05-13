import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomNav from '../components/BottomNav';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, { FadeIn, SlideInDown, ZoomIn } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const THEME = {
  background: '#f7f3ef', // surface-container
  surface: '#ffffff', // surface-container-lowest
  surfaceLow: '#fdf9f5', // surface-container-low
  surfaceHighest: '#ebe7e4',
  primary: '#ba3200',
  primaryContainer: '#ff7851',
  primaryFixed: '#ff7851',
  secondary: '#742ffc',
  secondaryDim: '#6816f0',
  secondaryContainer: '#d9caff',
  tertiary: '#00751f',
  tertiaryContainer: '#91f78e',
  onSurface: '#393836',
  onSurfaceVariant: '#666462',
  outlineVariant: '#bcb9b6',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Main Highlight Card */}
        <Animated.View entering={FadeIn.duration(800)} style={styles.cardSection}>
          <View style={styles.highlightCard}>
            {/* Context Header */}
            <View style={styles.highlightHeader}>
              <View>
                <Text style={styles.highlightTitle}>Today's Worksheet</Text>
                <View style={styles.estimateBox}>
                  <MaterialIcons name="schedule" size={14} color={THEME.onSurfaceVariant} />
                  <Text style={styles.estimateText}> 15 min estimate</Text>
                </View>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Logic Puzzles</Text>
              </View>
            </View>

            {/* Circular Progress */}
            <View style={styles.progressContainer}>
              <View style={styles.progressRingBox}>
                <Svg width={192} height={192} viewBox="0 0 192 192">
                  <Defs>
                    <SvgLinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor={THEME.primary} />
                      <Stop offset="100%" stopColor={THEME.primaryContainer} />
                    </SvgLinearGradient>
                  </Defs>
                  <Circle cx="96" cy="96" r="80" stroke={THEME.surfaceHighest} strokeWidth="12" fill="transparent" />
                  <Circle 
                    cx="96" cy="96" r="80" 
                    stroke="url(#grad)" 
                    strokeWidth="12" 
                    strokeDasharray="502" 
                    strokeDashoffset="125" 
                    strokeLinecap="round" 
                    fill="transparent" 
                    rotation="-90" 
                    origin="96, 96" 
                  />
                </Svg>
                
                {/* Play Button */}
                <Pressable style={styles.playButtonWrapper} onPress={() => router.push('/worksheet')}>
                  <LinearGradient 
                    colors={[THEME.primary, THEME.primaryContainer]} 
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} 
                    style={styles.playButton}
                  >
                    <MaterialIcons name="play-arrow" size={48} color="#fff" />
                  </LinearGradient>
                </Pressable>
              </View>
              
              <Text style={styles.progressText}>75% Complete</Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View entering={SlideInDown.delay(100)} style={styles.statsRow}>
          <View style={styles.statBox}>
            <View>
              <Text style={styles.statLabel}>Level</Text>
              <Text style={styles.statValue}>Level B</Text>
            </View>
            <View style={[styles.statIconBox, { backgroundColor: THEME.secondaryContainer }]}>
              <MaterialIcons name="stars" size={24} color={THEME.secondary} />
            </View>
          </View>
          
          <View style={styles.statBox}>
            <View>
              <Text style={styles.statLabel}>Streak</Text>
              <Text style={styles.statValue}>5 Days</Text>
            </View>
            <View style={[styles.statIconBox, { backgroundColor: '#ffedd5' }]}>
              <MaterialIcons name="local-fire-department" size={24} color={THEME.primary} />
            </View>
          </View>
        </Animated.View>

        {/* Grid Selection */}
        <Animated.View entering={SlideInDown.delay(200)} style={styles.bentoGrid}>
          {/* Chart Card */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Weekly Progress</Text>
              <MaterialIcons name="trending-up" size={24} color={THEME.tertiary} />
            </View>
            
            <View style={styles.chartBars}>
              {[40, 60, 30, 85, 50, 95, 45].map((val, idx) => (
                <View key={idx} style={[
                  styles.bar, 
                  { height: `${val}%` }, 
                  idx === 3 ? { backgroundColor: THEME.tertiaryContainer } : null,
                  idx === 5 ? { backgroundColor: THEME.tertiary } : null
                ]} />
              ))}
            </View>
            <View style={styles.chartLabels}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, dIdx) => (
                <Text key={dIdx} style={styles.chartLabelText}>{day}</Text>
              ))}
            </View>
          </View>

          {/* Performance Card */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Performance</Text>
              <Text style={styles.perfStat}>+12%</Text>
            </View>
            
            <View style={styles.perfRow}>
              <View style={[styles.perfIcon, { backgroundColor: THEME.secondaryContainer }]}>
                <MaterialIcons name="calculate" size={16} color={THEME.secondary} />
              </View>
              <View style={styles.perfDetails}>
                <View style={styles.perfTextRow}>
                  <Text style={styles.perfName}>Math Skills</Text>
                  <Text style={styles.perfName}>88%</Text>
                </View>
                <View style={styles.perfTrack}>
                  <View style={[styles.perfFill, { width: '88%', backgroundColor: THEME.secondary }]} />
                </View>
              </View>
            </View>

            <View style={styles.perfRow}>
              <View style={[styles.perfIcon, { backgroundColor: THEME.tertiaryContainer }]}>
                <MaterialIcons name="translate" size={16} color={THEME.tertiary} />
              </View>
              <View style={styles.perfDetails}>
                <View style={styles.perfTextRow}>
                  <Text style={styles.perfName}>Reading</Text>
                  <Text style={styles.perfName}>64%</Text>
                </View>
                <View style={styles.perfTrack}>
                  <View style={[styles.perfFill, { width: '64%', backgroundColor: THEME.tertiary }]} />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Bottom Discover */}
        <Animated.View entering={ZoomIn.delay(300)}>
          <LinearGradient colors={[THEME.secondary, THEME.secondaryDim]} style={styles.discoverCard}>
            <View style={styles.discoverTextCol}>
              <Text style={styles.discoverTitle}>Explore Worlds</Text>
              <Text style={styles.discoverSubtitle}>Travel through the Math Nebula and unlock new badges.</Text>
              <Pressable style={styles.discoverBtn} onPress={() => router.push('/journey')}>
                <Text style={styles.discoverBtnText}>Launch Map</Text>
              </Pressable>
            </View>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvl6H0xAt7Bx4vPeNuESI3VfrDLkV4QzTXUo-XqBTxgyoHUpe170iAEfl3aiwEQ1suJrzy75cBut6t3thx_M1gzqSKz0KHbL19D6wbdCT9lIs2a7KW5fmeu1G3K4OBhbGf-rOdxnd3O3muClE6twfVsVW99oR-bTBtx_SA5scROcHE5vHZXG54CUo_RoC-QF-Eoz5n8vMzZem9jkWS1RzqvO6Rke7y_KrmOKHnF5UYdtONCUpCUqoMsqqVLnYbsZAThNp7wPadWis' }} 
              style={styles.discoverImage} 
            />
          </LinearGradient>
        </Animated.View>
      </ScrollView>

      {/* Top Header Blur - Fixed */}
      <BlurView tint="light" intensity={80} style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxzCk0xT-PUerrgK4iNgaWJzBavQz4kztZqhI_SoWVMhwFzQy6YyaoWUmvcmM5leDyCYsOmPZ7kaKCsgb8mRWAaxiO4XGrgZLVOty-I_CJG2_6knKJD4wxKn2uWB12Vv-BLdEim4FWGLVqgN0STxi1MCroUsyoBLxgx47buZ4y-_NF5asXbHE6ndfaJB1BnWSJ0fCDnUE3Jfn04QI24Q95y4TONfUiqsOUNghBi3PNBNuCbYxkW69qVW-skUrnrrwqNlbWF_Yxk_M' }} style={styles.avatarPfp} />
          <View>
            <Text style={styles.headerGreeting}>Welcome back</Text>
            <Text style={styles.headerName}>Hi, Leo 👋</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.logoText}>SkillPath</Text>
          <MaterialIcons name="settings" size={24} color="#ea580c" />
        </View>
      </BlurView>

      <BottomNav activeTab="school" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  scrollContent: { paddingTop: 100, paddingBottom: 120, paddingHorizontal: 24 },
  
  // Header
  topHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 50, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarPfp: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: THEME.primaryFixed },
  headerGreeting: { fontSize: 12, color: THEME.onSurfaceVariant, fontWeight: '500' },
  headerName: { fontSize: 18, color: THEME.onSurface, fontWeight: '800' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#ea580c' },
  
  // Highlight
  cardSection: { marginBottom: 32 },
  highlightCard: {
    backgroundColor: THEME.surface, borderRadius: 24, padding: 24,
    shadowColor: THEME.onSurface, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 30, elevation: 5,
    borderWidth: 1, borderColor: 'rgba(188, 185, 182, 0.15)',
  },
  highlightHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  highlightTitle: { fontSize: 24, fontWeight: 'bold', color: THEME.onSurface },
  estimateBox: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  estimateText: { color: THEME.onSurfaceVariant, fontSize: 14, fontWeight: '500' },
  badge: { backgroundColor: THEME.secondaryContainer, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
  badgeText: { color: THEME.secondary, fontSize: 12, fontWeight: 'bold' },
  progressContainer: { alignItems: 'center', marginVertical: 16 },
  progressRingBox: { position: 'relative', width: 192, height: 192, justifyContent: 'center', alignItems: 'center' },
  playButtonWrapper: { position: 'absolute', width: 96, height: 96 },
  playButton: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 10 },
  progressText: { fontSize: 18, fontWeight: 'bold', color: THEME.primary, marginTop: 24 },
  
  // Stats
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: THEME.surfaceLow, padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(188, 185, 182, 0.1)', shadowColor: THEME.onSurface, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  statLabel: { fontSize: 10, color: THEME.onSurfaceVariant, textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 0.5 },
  statValue: { fontSize: 20, fontWeight: '900', color: THEME.onSurface, marginTop: 4 },
  statIconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  
  // Bento
  bentoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  chartCard: { width: '100%', backgroundColor: THEME.surface, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: 'rgba(188, 185, 182, 0.1)', shadowColor: THEME.onSurface, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 30, elevation: 4 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.onSurface },
  chartBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 96, gap: 8 },
  bar: { flex: 1, backgroundColor: THEME.surfaceHighest, borderTopLeftRadius: 100, borderTopRightRadius: 100 },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 4 },
  chartLabelText: { fontSize: 10, color: THEME.onSurfaceVariant, fontWeight: '600' },
  perfStat: { fontSize: 14, fontWeight: 'bold', color: THEME.tertiary },
  perfRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  perfIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  perfDetails: { flex: 1 },
  perfTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  perfName: { fontSize: 12, fontWeight: 'bold', color: THEME.onSurface },
  perfTrack: { height: 6, backgroundColor: THEME.surfaceHighest, borderRadius: 3, overflow: 'hidden' },
  perfFill: { height: '100%', borderRadius: 3 },
  
  // Discover
  discoverCard: { borderRadius: 24, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: THEME.secondary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 6 },
  discoverTextCol: { maxWidth: '60%' },
  discoverTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  discoverSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 16 },
  discoverBtn: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, alignSelf: 'flex-start' },
  discoverBtnText: { color: THEME.secondary, fontWeight: 'bold', fontSize: 14 },
  discoverImage: { width: 96, height: 96, resizeMode: 'contain', opacity: 0.9 }
});
