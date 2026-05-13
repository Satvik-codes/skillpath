import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Pressable,
  TextInput, KeyboardAvoidingView, Platform,
  Vibration, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSequence,
  withSpring, FadeIn, FadeInUp, SlideInDown, SlideOutUp,
  ZoomIn, ZoomOut, runOnJS
} from 'react-native-reanimated';
import BottomNav from '../components/BottomNav';

const { width, height } = Dimensions.get('window');

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

// 20 progressive math questions
const QUESTIONS = [
  { id: 1, a: 24, b: 13, op: '+', answer: 37, topic: 'Mental Addition' },
  { id: 2, a: 45, b: 21, op: '+', answer: 66, topic: 'Mental Addition' },
  { id: 3, a: 58, b: 34, op: '+', answer: 92, topic: 'Mental Addition' },
  { id: 4, a: 73, b: 18, op: '+', answer: 91, topic: 'Mental Addition' },
  { id: 5, a: 36, b: 24, op: '+', answer: 60, topic: 'Tens & Ones' },
  { id: 6, a: 52, b: 27, op: '-', answer: 25, topic: 'Subtraction' },
  { id: 7, a: 84, b: 39, op: '-', answer: 45, topic: 'Subtraction' },
  { id: 8, a: 67, b: 43, op: '-', answer: 24, topic: 'Subtraction' },
  { id: 9, a: 6, b: 7, op: '×', answer: 42, topic: 'Multiplication' },
  { id: 10, a: 8, b: 9, op: '×', answer: 72, topic: 'Multiplication' },
  { id: 11, a: 7, b: 8, op: '×', answer: 56, topic: 'Multiplication' },
  { id: 12, a: 9, b: 6, op: '×', answer: 54, topic: 'Multiplication' },
  { id: 13, a: 48, b: 6, op: '÷', answer: 8, topic: 'Division' },
  { id: 14, a: 63, b: 7, op: '÷', answer: 9, topic: 'Division' },
  { id: 15, a: 35, b: 5, op: '÷', answer: 7, topic: 'Division' },
  { id: 16, a: 12, b: 13, op: '+', answer: 25, topic: 'Mental Maths' },
  { id: 17, a: 99, b: 54, op: '-', answer: 45, topic: 'Mental Maths' },
  { id: 18, a: 11, b: 12, op: '×', answer: 132, topic: 'Challenge' },
  { id: 19, a: 144, b: 12, op: '÷', answer: 12, topic: 'Challenge' },
  { id: 20, a: 125, b: 75, op: '+', answer: 200, topic: 'Final Boss' },
];

const HINTS = {
  '+': (a, b) => `Add the tens first (${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} = ${Math.floor(a/10)*10 + Math.floor(b/10)*10}), then the ones (${a%10} + ${b%10} = ${(a%10)+(b%10)}).`,
  '-': (a, b) => `Count up from ${b} to ${a}. You cross ${b + (10 - b%10)} first. How many steps?`,
  '×': (a, b) => `Think of ${a} × ${b} as ${a} groups of ${b}. Or use ${a} × ${Math.floor(b/2)*2} and add extras.`,
  '÷': (a, b) => `Ask: what times ${b} gives ${a}? Try counting by ${b}s: ${b}, ${b*2}, ${b*3}...`,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WorksheetExperience() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timer, setTimer] = useState(0); // per-question timer
  const inputRef = useRef(null);

  const q = QUESTIONS[currentIdx];
  const progress = (currentIdx / QUESTIONS.length);

  // Per-question timer
  useEffect(() => {
    if (finished) return;
    setTimer(0);
    const t = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [currentIdx, finished]);

  // Total elapsed
  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [finished]);

  // Animations
  const cardScale = useSharedValue(1);
  const cardShake = useSharedValue(0);
  const shimmerX = useSharedValue(-width);

  useEffect(() => {
    shimmerX.value = withSequence(
      withTiming(width, { duration: 2000 }),
      withTiming(-width, { duration: 0 })
    );
    const interval = setInterval(() => {
      shimmerX.value = withSequence(
        withTiming(width, { duration: 2000 }),
        withTiming(-width, { duration: 0 })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIdx]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }, { translateX: cardShake.value }]
  }));
  const shimmerStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shimmerX.value }] }));

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const userAns = parseInt(answer.trim(), 10);
    const isCorrect = userAns === q.answer;

    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 1);
      cardScale.value = withSequence(withSpring(1.05), withSpring(1));
      // Move to next after short delay
      setTimeout(() => {
        setFeedback(null);
        setAnswer('');
        setShowHint(false);
        if (currentIdx + 1 >= QUESTIONS.length) {
          setFinished(true);
        } else {
          setCurrentIdx(i => i + 1);
        }
        inputRef.current?.focus();
      }, 900);
    } else {
      setFeedback('wrong');
      Vibration.vibrate(300);
      cardShake.value = withSequence(
        withTiming(-12, { duration: 60 }),
        withTiming(12, { duration: 60 }),
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const handleSkip = () => {
    setAnswer('');
    setShowHint(false);
    setFeedback(null);
    if (currentIdx + 1 >= QUESTIONS.length) {
      setFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
    }
  };

  // ---- FINISHED SCREEN ----
  if (finished) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#fff8f6', '#f7f3ef']} style={StyleSheet.absoluteFill} />
        <View style={[styles.bgBlob, { top: -60, left: -60, backgroundColor: 'rgba(255, 120, 81, 0.15)' }]} />
        <View style={[styles.bgBlob, { bottom: -80, right: -80, backgroundColor: 'rgba(217, 202, 255, 0.25)', width: 400, height: 400 }]} />

        <ScrollView contentContainerStyle={styles.finishScroll} showsVerticalScrollIndicator={false}>
          <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.finishBadge}>
            <LinearGradient colors={['#f97316', '#ea580c']} style={styles.finishBadgeGrad}>
              <MaterialIcons name={pct >= 70 ? 'emoji-events' : 'school'} size={64} color="#fff" />
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200)}>
            <Text style={styles.finishTitle}>{pct >= 90 ? '🎉 Incredible!' : pct >= 70 ? '🌟 Well done!' : '💪 Keep going!'}</Text>
            <Text style={styles.finishSubtitle}>You completed all 20 questions</Text>

            <View style={styles.finishStatsRow}>
              <View style={styles.finishStat}>
                <Text style={styles.finishStatNum}>{score}</Text>
                <Text style={styles.finishStatLabel}>Correct</Text>
              </View>
              <View style={[styles.finishStat, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: THEME.surfaceHighest }]}>
                <Text style={styles.finishStatNum}>{pct}%</Text>
                <Text style={styles.finishStatLabel}>Score</Text>
              </View>
              <View style={styles.finishStat}>
                <Text style={styles.finishStatNum}>{formatTime(elapsed)}</Text>
                <Text style={styles.finishStatLabel}>Time</Text>
              </View>
            </View>

            {/* XP Bar */}
            <View style={styles.xpSection}>
              <View style={styles.xpLabel}>
                <Text style={styles.xpText}>XP Earned</Text>
                <Text style={[styles.xpText, { color: THEME.tertiary, fontWeight: 'bold' }]}>+{score * 50} XP</Text>
              </View>
              <View style={styles.xpTrack}>
                <Animated.View entering={FadeIn.delay(600)} style={[styles.xpFill, { width: `${pct}%` }]}>
                  <LinearGradient colors={[THEME.tertiary, THEME.tertiaryContainer]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                </Animated.View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={SlideInDown.delay(400)} style={{ gap: 12, marginTop: 32 }}>
            <Pressable onPress={() => { setCurrentIdx(0); setScore(0); setFinished(false); setElapsed(0); setAnswer(''); }} style={styles.restartBtn}>
              <LinearGradient colors={['#f97316', '#ea580c']} style={styles.restartGrad}>
                <MaterialIcons name="replay" size={24} color="#fff" />
                <Text style={styles.restartText}>Try Again</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </ScrollView>
        <BottomNav activeTab="school" />
      </View>
    );
  }

  // ---- QUIZ SCREEN ----
  const feedbackColor = feedback === 'correct' ? THEME.tertiary : feedback === 'wrong' ? THEME.primary : null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Background blobs */}
      <View style={[styles.bgBlob, { top: height * 0.18, left: -80, backgroundColor: 'rgba(255, 237, 213, 0.5)' }]} />
      <View style={[styles.bgBlob, { bottom: height * 0.2, right: -100, backgroundColor: 'rgba(217, 202, 255, 0.35)', width: 380, height: 380 }]} />

      {/* Top Progress Bar */}
      <View style={styles.progressBarBg}>
        <Animated.View style={[styles.progressBarFill, { width: `${(currentIdx / QUESTIONS.length) * 100}%` }]} />
      </View>

      {/* Fixed Header */}
      <BlurView tint="light" intensity={80} style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrap}>
            <MaterialIcons name="face" size={24} color={THEME.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Question {currentIdx + 1} of {QUESTIONS.length}</Text>
            <Text style={styles.headerSubtitle}>Topic: {q.topic}</Text>
          </View>
        </View>
        <View style={styles.timerPill}>
          <MaterialIcons name="schedule" size={16} color={THEME.primary} />
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
      </BlurView>

      {/* Main */}
      <ScrollView
        contentContainerStyle={styles.mainContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Equation Display */}
        <Animated.View
          key={currentIdx}
          entering={FadeInUp.duration(500).springify()}
          style={styles.equationSection}
        >
          <Text style={styles.equationText}>
            <Text>{q.a} </Text>
            <Text style={{ color: THEME.primaryContainer }}>{q.op} </Text>
            <Text>{q.b} </Text>
            <Text style={{ color: THEME.primaryContainer }}>= </Text>
            <Text style={{ color: answer ? THEME.primary : THEME.surfaceHighest }}>
              {answer || '?'}
            </Text>
          </Text>
        </Animated.View>

        {/* Canvas / Input Area */}
        <Animated.View key={`canvas-${currentIdx}`} entering={FadeIn.delay(150)} style={styles.canvasOuter}>
          <Animated.View style={[styles.canvasInner, cardStyle,
            feedback === 'correct' && styles.canvasCorrect,
            feedback === 'wrong' && styles.canvasWrong
          ]}>
            {/* Feedback overlay */}
            {feedback && (
              <Animated.View entering={ZoomIn.duration(200)} style={styles.feedbackOverlay}>
                <MaterialIcons
                  name={feedback === 'correct' ? 'check-circle' : 'cancel'}
                  size={80}
                  color={feedback === 'correct' ? THEME.tertiary : THEME.primary}
                />
                <Text style={[styles.feedbackText, { color: feedbackColor }]}>
                  {feedback === 'correct' ? 'Correct! 🎉' : `Answer: ${q.answer}`}
                </Text>
              </Animated.View>
            )}

            {/* Huge invisible input styled as handwriting */}
            <TextInput
              ref={inputRef}
              style={[styles.handwritingInput, { color: answer ? THEME.onSurface : THEME.surfaceHighest }]}
              value={answer}
              onChangeText={setAnswer}
              keyboardType="number-pad"
              maxLength={4}
              placeholder="?"
              placeholderTextColor={THEME.surfaceHighest}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            {/* Canvas tool buttons */}
            <View style={styles.canvasTools}>
              <Pressable style={styles.toolBtn} onPress={() => setAnswer('')}>
                <MaterialIcons name="backspace" size={22} color={THEME.onSurfaceVariant} />
              </Pressable>
              <Pressable style={styles.toolBtn} onPress={() => setShowHint(h => !h)}>
                <MaterialIcons name="lightbulb" size={22} color={showHint ? THEME.secondary : THEME.onSurfaceVariant} />
              </Pressable>
              <Pressable style={styles.toolBtn} onPress={handleSkip}>
                <MaterialIcons name="skip-next" size={22} color={THEME.onSurfaceVariant} />
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>

        {/* Hint Card */}
        {showHint && (
          <Animated.View entering={SlideInDown.springify()} style={styles.hintCard}>
            <View style={styles.hintIconBox}>
              <MaterialIcons name="lightbulb" size={24} color={THEME.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hintTitle}>Let's try breaking it down!</Text>
              <Text style={styles.hintBody}>{HINTS[q.op](q.a, q.b)}</Text>
            </View>
            <Pressable onPress={() => setShowHint(false)}>
              <MaterialIcons name="close" size={18} color={THEME.onSurfaceVariant} />
            </Pressable>
          </Animated.View>
        )}

        {/* Score mini indicator */}
        <View style={styles.scoreRow}>
          <Text style={styles.scoreText}>Score: {score}/{currentIdx} </Text>
          <View style={styles.streakDots}>
            {QUESTIONS.slice(0, Math.min(currentIdx, 10)).map((_, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: THEME.tertiary }]} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <AnimatedPressable onPress={handleSubmit} style={styles.submitBtn}>
          <LinearGradient colors={['#f97316', '#ea580c']} style={styles.submitGradient}>
            <Text style={styles.submitText}>Submit Answer</Text>
            <MaterialIcons name="arrow-forward" size={28} color="#fff" />
            <Animated.View style={[styles.shimmerEffect, shimmerStyle]}>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.35)', 'transparent']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </LinearGradient>
        </AnimatedPressable>
      </View>

      <BottomNav activeTab="school" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  bgBlob: { position: 'absolute', width: 320, height: 320, borderRadius: 160 },

  progressBarBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: THEME.surfaceHighest, zIndex: 100 },
  progressBarFill: { height: '100%', backgroundColor: THEME.primary, borderTopRightRadius: 4, borderBottomRightRadius: 4, shadowColor: THEME.primary, shadowOpacity: 0.5, shadowRadius: 5 },

  topHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 50, paddingBottom: 16
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,120,81,0.15)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#ea580c' },
  headerSubtitle: { fontSize: 12, fontWeight: '500', color: THEME.onSurfaceVariant },
  timerPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  timerText: { color: THEME.primary, fontWeight: '900', fontSize: 14, letterSpacing: -0.5 },

  mainContent: { paddingTop: 120, paddingBottom: 200, paddingHorizontal: 20, alignItems: 'center' },

  equationSection: { paddingVertical: 28, alignItems: 'center' },
  equationText: { fontSize: 64, fontWeight: '900', color: THEME.onSurface, letterSpacing: -2 },

  canvasOuter: { width: '100%', maxWidth: 600, marginBottom: 20 },
  canvasInner: {
    width: '100%', minHeight: 220, backgroundColor: THEME.surface, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative',
    shadowColor: THEME.onSurface, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 30, elevation: 5
  },
  canvasCorrect: { borderWidth: 2, borderColor: THEME.tertiary, shadowColor: THEME.tertiary, shadowOpacity: 0.2 },
  canvasWrong: { borderWidth: 2, borderColor: THEME.primary, shadowColor: THEME.primary, shadowOpacity: 0.2 },

  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center', zIndex: 10, gap: 8
  },
  feedbackText: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },

  handwritingInput: {
    fontSize: 120, fontWeight: 'bold', fontStyle: 'italic',
    width: '100%', textAlign: 'center', paddingVertical: 20,
    color: THEME.onSurface
  },

  canvasTools: { position: 'absolute', bottom: 16, right: 16, flexDirection: 'row', gap: 10 },
  toolBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4
  },

  hintCard: {
    width: '100%', maxWidth: 600, backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'flex-start',
    gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: THEME.secondary, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4, marginBottom: 16
  },
  hintIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: THEME.secondaryContainer, justifyContent: 'center', alignItems: 'center' },
  hintTitle: { fontSize: 14, fontWeight: 'bold', color: THEME.onSurface, marginBottom: 4 },
  hintBody: { fontSize: 13, color: THEME.onSurfaceVariant, lineHeight: 20 },

  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  scoreText: { fontSize: 13, fontWeight: '700', color: THEME.onSurfaceVariant },
  streakDots: { flexDirection: 'row', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },

  footer: { position: 'absolute', bottom: 100, left: 0, right: 0, paddingHorizontal: 24, alignItems: 'center', zIndex: 60 },
  submitBtn: { width: '100%', maxWidth: 480, shadowColor: THEME.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 30, elevation: 10 },
  submitGradient: { height: 72, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, overflow: 'hidden', position: 'relative' },
  submitText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  shimmerEffect: { position: 'absolute', top: 0, bottom: 0, width: '100%' },

  // Finish Screen
  finishScroll: { paddingTop: 80, paddingBottom: 160, paddingHorizontal: 24, alignItems: 'center' },
  finishBadge: { marginBottom: 32, shadowColor: '#ea580c', shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
  finishBadgeGrad: { width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center' },
  finishTitle: { fontSize: 36, fontWeight: '900', color: THEME.onSurface, textAlign: 'center', letterSpacing: -1 },
  finishSubtitle: { fontSize: 16, color: THEME.onSurfaceVariant, textAlign: 'center', marginTop: 8, marginBottom: 32 },
  finishStatsRow: { flexDirection: 'row', backgroundColor: THEME.surface, borderRadius: 20, paddingVertical: 24, marginBottom: 32, shadowColor: THEME.onSurface, shadowOpacity: 0.06, shadowRadius: 20, elevation: 4 },
  finishStat: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  finishStatNum: { fontSize: 32, fontWeight: '900', color: THEME.onSurface },
  finishStatLabel: { fontSize: 12, color: THEME.onSurfaceVariant, marginTop: 4, fontWeight: '600' },
  xpSection: { width: '100%' },
  xpLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  xpText: { fontSize: 14, color: THEME.onSurfaceVariant },
  xpTrack: { height: 16, backgroundColor: THEME.surfaceHighest, borderRadius: 8, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 8 },
  restartBtn: { width: '100%', maxWidth: 480, shadowColor: THEME.primary, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8 },
  restartGrad: { height: 64, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  restartText: { fontSize: 20, fontWeight: '900', color: '#fff' },
});
