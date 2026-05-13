import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BottomNav({ activeTab }) {
  const router = useRouter();

  const NAV_ITEMS = [
    { route: '/', icon: 'school', label: 'Learn', id: 'school' },
    { route: '/journey', icon: 'map', label: 'Map', id: 'map' },
    { route: '/leaderboard', icon: 'leaderboard', label: 'Rank', id: 'leaderboard' },
    { route: '/progress', icon: 'analytics', label: 'Growth', id: 'analytics' },
    { route: '/parent-dashboard', icon: 'family-restroom', label: 'Parent', id: 'family-restroom' }
  ];

  return (
    <View style={styles.navContainer} pointerEvents="box-none">
      {/* The background Blur layer, restricted to the bottom safe area to allow overlap above it */}
      <BlurView tint="light" intensity={90} style={styles.blurBackground} />
      
      <View style={styles.navContent} pointerEvents="box-none">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          
          if (isActive) {
            return (
              <Pressable key={item.id} style={styles.navItemMain} onPress={() => router.navigate(item.route)}>
                <LinearGradient colors={['#f97316', '#ea580c']} style={styles.navMainGradient}>
                  <MaterialIcons name={item.icon} size={28} color="#fff" />
                  <Text style={styles.navMainText}>{item.label}</Text>
                </LinearGradient>
              </Pressable>
            );
          }

          return (
            <Pressable key={item.id} style={styles.navItemContainer} onPress={() => router.navigate(item.route)}>
              <MaterialIcons name={item.icon} size={24} color="#a8a29e" />
              <Text style={styles.navText}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0, 
    height: 100, // Make it taller to fit the active icon overlap
    paddingHorizontal: 16,
    zIndex: 100
  },
  blurBackground: {
    position: 'absolute',
    top: 20, bottom: 0, left: 16, right: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden'
  },
  navContent: { 
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', 
    height: '100%', paddingBottom: 24 
  },
  navItemContainer: { alignItems: 'center', justifyContent: 'center', padding: 8 },
  navText: { fontSize: 10, fontWeight: '500', color: '#a8a29e', marginTop: 4, fontFamily: 'sans-serif' },
  
  navItemMain: { 
    // Shift up exactly by the amount that allows it to float above the blur top edge
    transform: [{ translateY: -16 }] 
  },
  navMainGradient: { 
    padding: 12, borderRadius: 999, alignItems: 'center', 
    shadowColor: '#ea580c', shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 
  },
  navMainText: { fontSize: 10, fontWeight: '600', color: '#fff', marginTop: 2 }
});
