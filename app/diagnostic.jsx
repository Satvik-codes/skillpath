import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Image,
  TextInput, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown, FadeIn, ZoomIn, useSharedValue,
  useAnimatedStyle, withTiming, withDelay
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

const TOTAL = 10;

// Simple diagnostic progression questions
const DIAG_QUESTIONS = [
  { q: '5 + 2 = ?', a: '7', topic: 'Quick Math' },
  { q: '9 - 4 = ?', a: '5', topic: 'Quick Math' },
  { q: '3 × 4 = ?', a: '12', topic: 'Multiplication' },
  { q: '20 ÷ 4 = ?', a: '5', topic: 'Division' },
  { q: '15 + 28 = ?', a: '43', topic: 'Addition' },
  { q: '7 × 8 = ?', a: '56', topic: 'Multiplication' },
  { q: '100 - 37 = ?', a: '63', topic: 'Subtraction' },
  { q: '½ of 24 = ?', a: '12', topic: 'Fractions' },
  { q: '6² = ?', a: '36', topic: 'Powers' },
  { q: '√49 = ?', a: '7', topic: 'Roots' },
];

const COACH_MESSAGES = [
  "You're doing amazing! Focus on the numbers and let your brain do the magic. 🌟",
  "Great job so far! Take a deep breath and try your best. 🧠",
  "Almost halfway! You're doing brilliantly. 💪",
  "Keep going, you're a star! Every answer teaches me about you. ⭐",
];

export default function DiagnosticScreen() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [completed, setCompleted] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef(null);

  const growAnim = useSharedValue(0);
  useEffect(() => {
    growAnim.value = withDelay(300, withTiming((currentIdx / TOTAL), { duration: 600 }));
  }, [currentIdx]);

  const progressStyle = useAnimatedStyle(() => ({ width: `${growAnim.value * 100}%` }));

  const q = DIAG_QUESTIONS[currentIdx];
  const coachMsg = COACH_MESSAGES[Math.floor(currentIdx / 3)];

  const advance = (wasCorrect) => {
    if (wasCorrect) setCompleted(c => [...c, currentIdx]);
    else setSkipped(s => [...s, currentIdx]);
    setAnswer('');
    if (currentIdx + 1 >= TOTAL) {
      setShowResult(true);
    } else {
      setCurrentIdx(i => i + 1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // -------- RESULT SCREEN --------
  if (showResult) {
    const score = completed.length;
    let level = score <= 3 ? 'Level A – Beginner' : score <= 6 ? 'Level B – Intermediate' : 'Level C – Advanced';
    return (
      <View style={styles.container}>
        <View style={styles.blobTL} />
        <View style={styles.blobBR} />
        <ScrollView contentContainerStyle={styles.resultScroll} showsVerticalScrollIndicator={false}>
          <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.resultBadge}>
            <LinearGradient colors={[THEME.secondary, '#6816f0']} style={styles.resultBadgeGrad}>
              <MaterialIcons name="psychology" size={56} color="#fff" />
            </LinearGradient>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={styles.resultTitle}>Placement Complete! 🎉</Text>
            <Text style={styles.resultLevel}>{level}</Text>
            <Text style={styles.resultSub}>
              You answered {score}/{TOTAL} correctly. We've personalized your learning path!
            </Text>
            <View style={styles.resultStats}>
              <View style={styles.resultStat}>
                <Text style={styles.resultStatNum}>{score}</Text>
                <Text style={styles.resultStatLabel}>Correct</Text>
              </View>
              <View style={[styles.resultStat, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: THEME.surfaceHighest }]}>
                <Text style={[styles.resultStatNum, { color: THEME.primary }]}>{TOTAL - score}</Text>
                <Text style={styles.resultStatLabel}>Skipped</Text>
              </View>
              <View style={styles.resultStat}>
                <Text style={[styles.resultStatNum, { color: THEME.secondary }]}>{Math.round(score / TOTAL * 100)}%</Text>
                <Text style={styles.resultStatLabel}>Score</Text>
              </View>
            </View>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(400)}>
            <Pressable onPress={() => router.replace('/')} style={styles.resultCta}>
              <LinearGradient colors={[THEME.primary, THEME.primaryContainer]} style={styles.resultCtaGrad}>
                <Text style={styles.resultCtaText}>Start Learning!</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#fff" />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // -------- DIAGNOSTIC QUESTION SCREEN --------
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.blobTL} />
      <View style={styles.blobBR} />

      {/* Header */}
      <BlurView tint="light" intensity={80} style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarBox}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNgICRAawHfmOewKAgPD_zqR1LId95Jbzs9RG9osYxR6oICHPP8LSeAxPoMKFi4XiOGsIP1RTDJGeiDWvjcYLEKrMEAi3HizHQ4RnoCjS2y_MrpuoxlrSGBq80ddH2StNSZ4AbHVB6qGH-lNP05rYk2yli-TZenCSlcOpSuT-hRPkeH349gbZYJuy6f0sqoUX3qOcy4ZvGmqwNlmySGPFwZAhCPFGaVYx379KSuSFz9_Ppaf_NMG1-yuDj_E3X6VDIdEoWmExehhQ' }}
              style={styles.avatarImg}
            />
          </View>
          <Text style={styles.logoText}>SkillPath</Text>
        </View>
        <View style={styles.qCountPill}>
          <MaterialIcons name="timer" size={14} color={THEME.primary} />
          <Text style={styles.qCountText}>Question {currentIdx + 1}/{TOTAL}</Text>
        </View>
        <Pressable onPress={() => router.replace('/')} style={styles.closebtn}>
          <MaterialIcons name="close" size={22} color={THEME.onSurfaceVariant} />
        </Pressable>
      </BlurView>

      <ScrollView contentContainerStyle={styles.mainContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Segmented Progress */}
        <View style={styles.segmentRow}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <View key={i} style={styles.segmentTrack}>
              {i < currentIdx ? (
                <View style={[styles.segmentFill, { width: '100%', backgroundColor: THEME.primary }]} />
              ) : i === currentIdx ? (
                <Animated.View style={[styles.segmentFill, progressStyle, { backgroundColor: THEME.primaryContainer }]} />
              ) : null}
            </View>
          ))}
        </View>

        {/* Hero Text */}
        <Animated.View key={currentIdx} entering={FadeInDown.duration(400)} style={styles.heroText}>
          <Text style={styles.heroTitle}>Let's find your starting point 🚀</Text>
          <Text style={styles.heroSub}>Don't worry, just do your best!</Text>
        </Animated.View>

        {/* Main 2-column like layout */}
        <View style={styles.bodyLayout}>
          {/* Left: Question + Canvas */}
          <View style={styles.leftCol}>
            {/* Question Card */}
            <Animated.View key={`q-${currentIdx}`} entering={FadeIn.delay(100)} style={styles.qCard}>
              <View style={styles.qCardBlob} />
              <Text style={styles.qTopic}>Quick Math</Text>
              <Text style={styles.qText}>{q.q}</Text>
            </Animated.View>

            {/* Canvas / Input */}
            <View style={styles.canvas}>
              <View style={styles.canvasHint}>
                <View style={styles.canvasHintIcon}>
                  <MaterialIcons name="edit" size={20} color={THEME.primary} />
                </View>
                <Text style={styles.canvasHintText}>Write your answer here...</Text>
              </View>
              {/* Large ghost answer */}
              <TextInput
                ref={inputRef}
                style={styles.canvasInput}
                value={answer}
                onChangeText={setAnswer}
                keyboardType="number-pad"
                maxLength={5}
                placeholder="?"
                placeholderTextColor={THEME.surfaceHighest}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={() => advance(answer.trim() === q.a)}
              />
              {/* Canvas tools */}
              <BlurView tint="light" intensity={70} style={styles.canvasTools}>
                <Pressable style={styles.toolBtnPrimary}>
                  <MaterialIcons name="brush" size={20} color="#fff" />
                </Pressable>
                <Pressable style={styles.toolBtnSecondary} onPress={() => setAnswer('')}>
                  <MaterialIcons name="cleaning-services" size={20} color={THEME.onSurfaceVariant} />
                </Pressable>
                <View style={styles.toolDivider} />
                <Pressable style={styles.clearBtn} onPress={() => setAnswer('')}>
                  <Text style={styles.clearBtnText}>Clear</Text>
                </Pressable>
              </BlurView>
            </View>
          </View>

          {/* Right: AI Coach */}
          <View style={styles.rightCol}>
            {/* Coach Card */}
            <Animated.View entering={FadeIn.delay(300)} style={styles.coachCard}>
              <LinearGradient colors={[THEME.secondary, '#5500cd']} style={styles.coachGrad}>
                <View style={styles.coachBlob} />
                <View style={styles.coachAvatarBox}>
                  <Animated.View style={styles.coachPulse} />
                  <Image
                    source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaF39NPvAjx5SRrjYiHe9ZjLY1R1NIff-3EBPmianJ4WDmQn7EjzHcb0vkcbyXLqcQQI36nGjp8UTxWabIKG0KVs5mkNtlb2PsGQsokISoNbXz00MBKH8MTNKkX3H2R2nLsoQH_quI5gi0dtGk6-ZiUDR4qJn5XQpJayuhK462foTbnHelCgoO1ZiSm8ShrEpNTqQICpfOoEes7PvB8jSDeJbjBVPWklDOTUXJh74M-w4hrqBun7RUcdING3tSonTEIEkD-VISyzk' }}
                    style={styles.coachAvatar}
                  />
                </View>
                <Text style={styles.coachTitle}>Coach Pixel says:</Text>
                <View style={styles.speechBubble}>
                  <Text style={styles.speechText}>"{coachMsg}"</Text>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Action Card */}
            <View style={styles.actionCard}>
              <Pressable
                style={styles.submitBtn}
                onPress={() => advance(answer.trim() === q.a)}
              >
                <LinearGradient colors={[THEME.primary, THEME.primaryContainer]} style={styles.submitGrad}>
                  <Text style={styles.submitText}>Submit Answer</Text>
                </LinearGradient>
              </Pressable>
              <Pressable style={styles.skipBtn} onPress={() => advance(false)}>
                <Text style={styles.skipText}>I'm not sure yet</Text>
              </Pressable>
            </View>

            {/* Tip Card */}
            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <MaterialIcons name="lightbulb" size={22} color={THEME.tertiary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tipLabel}>QUICK TIP</Text>
                <Text style={styles.tipText}>Use your fingers if you need to! Counting is a great strategy.</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  blobTL: { position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(217,202,255,0.12)' },
  blobBR: { position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255,120,81,0.08)' },

  header: { paddingTop: 52, paddingBottom: 14, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarBox: { width: 38, height: 38, borderRadius: 19, overflow: 'hidden', borderWidth: 2, borderColor: THEME.primaryContainer },
  avatarImg: { width: '100%', height: '100%' },
  logoText: { fontSize: 17, fontWeight: '900', color: '#ea580c' },
  qCountPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(235,231,228,0.7)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999 },
  qCountText: { fontSize: 12, fontWeight: 'bold', color: THEME.onSurface },
  closebtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: THEME.surfaceHighest, justifyContent: 'center', alignItems: 'center' },

  mainContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },

  segmentRow: { flexDirection: 'row', gap: 6, marginBottom: 28 },
  segmentTrack: { flex: 1, height: 10, backgroundColor: THEME.surfaceHighest, borderRadius: 999, overflow: 'hidden' },
  segmentFill: { height: '100%', borderRadius: 999 },

  heroText: { marginBottom: 20, alignItems: 'center' },
  heroTitle: { fontSize: 22, fontWeight: '900', color: THEME.onSurface, textAlign: 'center', letterSpacing: -0.3 },
  heroSub: { fontSize: 15, color: THEME.onSurfaceVariant, marginTop: 6, textAlign: 'center' },

  bodyLayout: { gap: 16 },
  leftCol: { gap: 16 },
  rightCol: { gap: 14 },

  qCard: { backgroundColor: THEME.surface, borderRadius: 20, padding: 28, alignItems: 'center', shadowColor: THEME.onSurface, shadowOpacity: 0.07, shadowRadius: 20, elevation: 4, overflow: 'hidden', position: 'relative' },
  qCardBlob: { position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: THEME.secondaryContainer, opacity: 0.2 },
  qTopic: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, color: THEME.primary, marginBottom: 10 },
  qText: { fontSize: 52, fontWeight: '900', color: THEME.onSurface, letterSpacing: -2 },

  canvas: { backgroundColor: THEME.surface, borderRadius: 20, minHeight: 200, borderWidth: 2, borderColor: 'rgba(188,185,182,0.2)', borderStyle: 'dashed', overflow: 'hidden', position: 'relative', shadowColor: THEME.onSurface, shadowOpacity: 0.06, shadowRadius: 16, elevation: 3 },
  canvasHint: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, position: 'absolute', top: 0, left: 0 },
  canvasHintIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(186,50,0,0.08)', justifyContent: 'center', alignItems: 'center' },
  canvasHintText: { fontSize: 14, color: THEME.onSurfaceVariant, fontWeight: '500' },
  canvasInput: { fontSize: 110, fontWeight: 'bold', fontStyle: 'italic', color: 'rgba(57,56,54,0.12)', textAlign: 'center', paddingVertical: 30 },
  canvasTools: { position: 'absolute', bottom: 14, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 999, gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  toolBtnPrimary: { width: 44, height: 44, borderRadius: 22, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center' },
  toolBtnSecondary: { width: 44, height: 44, borderRadius: 22, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center' },
  toolDivider: { width: 1, height: 28, backgroundColor: 'rgba(0,0,0,0.08)' },
  clearBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: THEME.surface, borderRadius: 999 },
  clearBtnText: { fontSize: 13, fontWeight: 'bold', color: THEME.primary },

  coachCard: { borderRadius: 20, overflow: 'hidden', shadowColor: THEME.secondary, shadowOpacity: 0.25, shadowRadius: 15, elevation: 6 },
  coachGrad: { padding: 20, alignItems: 'center', position: 'relative' },
  coachBlob: { position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.08)' },
  coachAvatarBox: { width: 80, height: 80, marginBottom: 12, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  coachPulse: { position: 'absolute', width: '100%', height: '100%', borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.15)' },
  coachAvatar: { width: 72, height: 72, borderRadius: 36 },
  coachTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 10 },
  speechBubble: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  speechText: { fontSize: 13, color: 'rgba(255,255,255,0.95)', lineHeight: 20, fontWeight: '500', textAlign: 'center' },

  actionCard: { backgroundColor: THEME.surfaceHighest, borderRadius: 20, padding: 16, gap: 12 },
  submitBtn: { shadowColor: THEME.primary, shadowOpacity: 0.25, shadowRadius: 12, elevation: 5 },
  submitGrad: { height: 56, borderRadius: 999, justifyContent: 'center', alignItems: 'center' },
  submitText: { fontSize: 16, fontWeight: '900', color: '#fff' },
  skipBtn: { height: 48, borderRadius: 999, justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.surface, borderWidth: 1, borderColor: 'rgba(188,185,182,0.2)' },
  skipText: { fontSize: 14, fontWeight: '600', color: THEME.onSurface },

  tipCard: { backgroundColor: 'rgba(145,247,142,0.15)', borderRadius: 16, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'flex-start', borderWidth: 1, borderColor: 'rgba(0,117,31,0.1)' },
  tipIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,117,31,0.12)', justifyContent: 'center', alignItems: 'center' },
  tipLabel: { fontSize: 9, fontWeight: '800', color: THEME.tertiary, letterSpacing: 1, marginBottom: 4 },
  tipText: { fontSize: 12, color: THEME.onSurface, lineHeight: 18, fontWeight: '500' },

  // Result screen
  resultScroll: { paddingHorizontal: 24, paddingTop: 80, paddingBottom: 60, alignItems: 'center' },
  resultBadge: { marginBottom: 28, shadowColor: THEME.secondary, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  resultBadgeGrad: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  resultTitle: { fontSize: 30, fontWeight: '900', color: THEME.onSurface, textAlign: 'center', letterSpacing: -0.5, marginBottom: 8 },
  resultLevel: { fontSize: 20, fontWeight: '800', color: THEME.secondary, textAlign: 'center', marginBottom: 12 },
  resultSub: { fontSize: 15, color: THEME.onSurfaceVariant, textAlign: 'center', lineHeight: 24, marginBottom: 28 },
  resultStats: { flexDirection: 'row', backgroundColor: THEME.surface, borderRadius: 20, paddingVertical: 20, marginBottom: 32, shadowColor: THEME.onSurface, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4 },
  resultStat: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  resultStatNum: { fontSize: 30, fontWeight: '900', color: THEME.onSurface },
  resultStatLabel: { fontSize: 11, color: THEME.onSurfaceVariant, marginTop: 4, fontWeight: '600' },
  resultCta: { width: '100%', shadowColor: THEME.primary, shadowOpacity: 0.3, shadowRadius: 15, elevation: 6 },
  resultCtaGrad: { height: 60, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  resultCtaText: { fontSize: 18, fontWeight: '900', color: '#fff' },
});
