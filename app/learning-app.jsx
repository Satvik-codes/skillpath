import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, BounceIn } from 'react-native-reanimated';
import { theme } from '../src/constants/theme';

export default function LearningAppScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Animated.View entering={BounceIn.duration(1000)} style={styles.logoContainer}>
        <View style={styles.logo} />
      </Animated.View>

      <Animated.Text entering={FadeIn.delay(500)} style={styles.title}>
        SkillPath
      </Animated.Text>
      
      <Animated.Text entering={FadeIn.delay(700)} style={styles.subtitle}>
        Adaptive Learning for the Future
      </Animated.Text>

      <Animated.View entering={FadeIn.delay(1000)} style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => router.push('/')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  logoContainer: {
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: 30,
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontSize: theme.typography.displayLg.fontSize,
    fontWeight: 'bold',
    color: theme.colors.surface,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.titleMd.fontSize,
    color: theme.colors.surfaceContainerHighest,
    marginBottom: theme.spacing.xxl,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    paddingHorizontal: theme.spacing.xl,
  },
  button: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.pill,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.typography.titleMd.fontSize,
  }
});
