import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay, withRepeat, withSequence, withSpring,
  FadeIn, FadeInDown, ZoomIn, BounceIn
} from 'react-native-reanimated';

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

export default function LevelUpScreen() {
  const router = useRouter();

  // Trophy "breathing" glow
  const haloScale = useSharedValue(1.3);
  // Floating confetti icons
  const float1 = useSharedValue(0);
  const float2 = useSharedValue(0);
  const float3 = useSharedValue(0);

  useEffect(() => {
    haloScale.value = withRepeat(
      withSequence(withTiming(1.6, { duration: 1200 }), withTiming(1.2, { duration: 1200 })),
      -1, true
    );
    float1.value = withRepeat(withSequence(withTiming(-12, { duration: 1800 }), withTiming(0, { duration: 1800 })), -1, true);
    float2.value = withRepeat(withSequence(withTiming(10, { duration: 2200 }), withTiming(-4, { duration: 2200 })), -1, true);
    float3.value = withRepeat(withSequence(withTiming(-8, { duration: 1500 }), withTiming(6, { duration: 1500 })), -1, true);
  }, []);

  const haloStyle = useAnimatedStyle(() => ({ transform: [{ scale: haloScale.value }], opacity: 0.25 }));
  const f1Style = useAnimatedStyle(() => ({ transform: [{ translateY: float1.value }] }));
  const f2Style = useAnimatedStyle(() => ({ transform: [{ translateY: float2.value }, { rotate: '12deg' }] }));
  const f3Style = useAnimatedStyle(() => ({ transform: [{ translateY: float3.value }, { rotate: '-12deg' }] }));

  return (
    <View style={styles.container}>
      {/* Blurred backdrop blobs */}
      <View style={styles.blobTL} />
      <View style={styles.blobBR} />
      <View style={styles.blobCenter} />

      {/* Corner accents */}
      <View style={styles.cornerTL} />
      <View style={styles.cornerBR} />

      {/* Floating confetti */}
      <Animated.View style={[styles.confetti, { top: 80, left: 30 }, f1Style]}>
        <MaterialIcons name="celebration" size={36} color={THEME.primary} />
      </Animated.View>
      <Animated.View style={[styles.confetti, { top: 60, right: 50 }, f2Style]}>
        <MaterialIcons name="auto-awesome" size={28} color={THEME.secondary} />
      </Animated.View>
      <Animated.View style={[styles.confetti, { bottom: 200, left: 20 }, f3Style]}>
        <MaterialIcons name="star" size={40} color={THEME.tertiary} />
      </Animated.View>

      {/* Trophy Badge */}
      <Animated.View entering={ZoomIn.duration(800).springify().damping(10)} style={styles.trophyWrapper}>
        {/* Halo */}
        <Animated.View style={[styles.halo, haloStyle]} />
        {/* Badge Image */}
        <Image
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJnqZKuEqzwESo3VU8VZSGi4rtSqP47j0QoXdjB9gp6YmNHjo5M64GJ0RDFTFbgNsYxEOZvz5KAr5qLrC7l3TmKPMCKmk9ET3ayzKvu6KGdOpCQffebTYiHmbygkAs_A-z0LT5MObMhOiURGSQgIfvwhA9jAZqFAGv0bzgAWYyM9xgd7Uy7Y---1n7fJLOuUF0v4wEO4rHupStx1mDD9JR0rX5LNNL8dH2ov3iY3vbdK3DQZ0fkQktzJXXpd8sabGAB8QFoOrXTk8' }}
          style={styles.trophyImage}
        />
        {/* Premium overlay icon */}
        <View style={styles.trophyBadgeIcon}>
          <MaterialIcons name="workspace-premium" size={36} color={THEME.primary} />
        </View>
      </Animated.View>

      {/* Text Content */}
      <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.textBlock}>
        <Text style={styles.levelBadge}>LEVEL B MASTER</Text>
        <Text style={styles.mainTitle}>
          Amazing! You reached{' '}
          <Text style={styles.titleGradient}>Level C!</Text>
        </Text>
        <Text style={styles.subtitle}>
          You've unlocked new exploration paths and earned 500 Path Points!
        </Text>
      </Animated.View>

      {/* Stats Bar */}
      <Animated.View entering={FadeIn.delay(700)} style={styles.statsBar}>
        <BlurView tint="light" intensity={60} style={styles.statsBlur}>
          <View style={[styles.statItem, { borderRightWidth: 1, borderRightColor: 'rgba(0,0,0,0.08)' }]}>
            <Text style={styles.statLabel}>Lessons</Text>
            <Text style={styles.statValue}>24/24</Text>
          </View>
          <View style={[styles.statItem, { borderRightWidth: 1, borderRightColor: 'rgba(0,0,0,0.08)' }]}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={[styles.statValue, { color: THEME.tertiary }]}>12 Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Rank</Text>
            <Text style={[styles.statValue, { color: THEME.secondary }]}>#4</Text>
          </View>
        </BlurView>
      </Animated.View>

      {/* CTAs */}
      <Animated.View entering={BounceIn.delay(900)} style={styles.ctaBlock}>
        <Pressable onPress={() => router.replace('/')} style={styles.mainCta}>
          <LinearGradient colors={[THEME.primary, THEME.primaryContainer]} style={styles.mainCtaGradient}>
            <Text style={styles.mainCtaText}>Keep Going!</Text>
            <MaterialIcons name="arrow-forward" size={26} color="#fff" />
          </LinearGradient>
        </Pressable>
        <Pressable style={styles.shareBtn}>
          <MaterialIcons name="share" size={18} color={THEME.onSurfaceVariant} />
          <Text style={styles.shareBtnText}>Share Achievement</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 40 },

  blobTL: { position: 'absolute', top: '20%', left: -80, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,120,81,0.2)' },
  blobBR: { position: 'absolute', bottom: '20%', right: -100, width: 360, height: 360, borderRadius: 180, backgroundColor: 'rgba(217,202,255,0.15)' },
  blobCenter: { position: 'absolute', top: '40%', left: '20%', width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(145,247,142,0.08)' },

  cornerTL: { position: 'absolute', top: 40, left: 24, width: 80, height: 80, borderTopWidth: 3, borderLeftWidth: 3, borderColor: 'rgba(186,50,0,0.15)', borderTopLeftRadius: 12 },
  cornerBR: { position: 'absolute', bottom: 40, right: 24, width: 80, height: 80, borderBottomWidth: 3, borderRightWidth: 3, borderColor: 'rgba(116,47,252,0.15)', borderBottomRightRadius: 12 },

  confetti: { position: 'absolute', opacity: 0.6, zIndex: 1 },

  trophyWrapper: { position: 'relative', width: 220, height: 220, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  halo: { position: 'absolute', width: '100%', height: '100%', borderRadius: 110, backgroundColor: THEME.primaryContainer },
  trophyImage: { width: 200, height: 200, borderRadius: 100, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)', shadowColor: THEME.primary, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.3, shadowRadius: 40, elevation: 12 },
  trophyBadgeIcon: { position: 'absolute', bottom: 12, right: 12, backgroundColor: THEME.surface, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 6 },

  textBlock: { alignItems: 'center', marginBottom: 28 },
  levelBadge: { fontSize: 11, fontWeight: '800', color: THEME.primary, letterSpacing: 2, marginBottom: 10 },
  mainTitle: { fontSize: 32, fontWeight: '900', color: THEME.onSurface, textAlign: 'center', lineHeight: 40, letterSpacing: -0.5, marginBottom: 12 },
  titleGradient: { color: THEME.primary },
  subtitle: { fontSize: 16, color: THEME.onSurfaceVariant, textAlign: 'center', lineHeight: 24, maxWidth: 280 },

  statsBar: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 32, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', shadowColor: THEME.onSurface, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  statsBlur: { flexDirection: 'row', paddingVertical: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 11, color: THEME.onSurfaceVariant, fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '900', color: THEME.onSurface },

  ctaBlock: { width: '100%', gap: 16 },
  mainCta: { shadowColor: THEME.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  mainCtaGradient: { height: 64, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  mainCtaText: { fontSize: 20, fontWeight: '900', color: '#fff' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  shareBtnText: { fontSize: 14, color: THEME.onSurfaceVariant, fontWeight: '600' },
});
