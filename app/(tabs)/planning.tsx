import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlanningScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Planning</Text>
        <Text style={styles.emptyText}>Aucune mission planifiée pour les prochains jours.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl },
  title: { fontFamily: 'Tusker', fontSize: 32, marginBottom: Spacing.xl, color: Colors.text.primary },
  emptyText: { fontFamily: 'RightGrotesk', fontSize: 16, color: Colors.text.secondary },
});
