import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Typography, Glass } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBookings, Mission } from '@/lib/api';
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PlanningScreen() {
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadMissions = async () => {
    try {
      const data = await getBookings();
      // On affiche tout le planning (missions à venir ou en cours)
      setMissions(data.filter(m => m.status !== 'completed' && m.status !== 'cancelled'));
    } catch (e) {
      console.error('Failed to load missions:', e);
    }
  };

  useEffect(() => {
    loadMissions();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMissions();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Mission }) => (
    <TouchableOpacity 
      style={styles.missionCard}
      onPress={() => router.push(`/mission/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.timeInfo}>
          <Clock size={16} color={Colors.accent} />
          <Text style={styles.timeText}>
            {new Date(item.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: Colors.accentMuted }]}>
          <Text style={styles.statusText}>{item.formula.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.locationInfo}>
          <MapPin size={14} color={Colors.text.secondary} />
          <Text style={styles.distanceText}>Cotonou, Bénin</Text>
        </View>
        <ChevronRight size={20} color={Colors.text.secondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Planning du jour</Text>
        
        <FlatList
          data={missions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucune mission assignée pour aujourd'hui.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: Spacing.xl },
  title: { 
    fontFamily: 'RightGrotesk', 
    fontSize: Typography.h1, 
    lineHeight: Typography.lineHeight.h1, 
    marginBottom: Spacing.xl, 
    color: Colors.text.primary,
    marginTop: Spacing.md,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  missionCard: {
    ...Glass.card,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontFamily: 'RightGrotesk',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: 'RightGrotesk',
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  addressText: {
    fontFamily: 'RightGrotesk',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distanceText: {
    fontFamily: 'RightGrotesk',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
  emptyText: { 
    fontFamily: 'RightGrotesk', 
    fontSize: 16, 
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
