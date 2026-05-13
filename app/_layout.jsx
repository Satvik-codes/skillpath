import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="worksheet" />
      <Stack.Screen name="progress" />
      <Stack.Screen name="journey" />
      <Stack.Screen name="level-up" options={{ presentation: 'modal' }} />
      <Stack.Screen name="leaderboard" />
      <Stack.Screen name="parent-dashboard" />
      <Stack.Screen name="diagnostic" />
      <Stack.Screen name="learning-app" />
    </Stack>
  );
}
