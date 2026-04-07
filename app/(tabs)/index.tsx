import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Navigation, Clock, CheckCircle } from 'lucide-react-native';
import { getBookings, Mission } from '@/lib/api';

export default function TechHubScreen() {
  const router = useRouter();
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadMissions = useCallback(async () => {
    try {
      setError(null);
      const bookings = await getBookings();
      setActiveMissions(bookings);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Impossible de charger les missions.';
      setError(message);
    }
  }, []);

  useEffect(() => {
    void loadMissions();
  }, [loadMissions]);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 6.3670,
            longitude: 2.4190,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {activeMissions.map((mission, idx) => (
            <Marker
              key={mission.id}
              coordinate={{ latitude: 6.3653 + idx * 0.002, longitude: 2.4183 + idx * 0.002 }}
              title={`Mission #${mission.id}`}
              description={mission.address}
            />
          ))}
        </MapView>
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.sheetTitle}>File du jour ({activeMissions.length})</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <FlatList
          data={activeMissions}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: Spacing.xl }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.missionCard}
              onPress={() => router.push(`/mission/${String(item.id)}`)}
              activeOpacity={0.8}
            >
              <View style={styles.missionHeader}>
                <Text style={styles.clientName}>Mission #{item.id}</Text>
                <View style={styles.timeBadge}>
                  <Clock size={12} color={Colors.accent} />
                  <Text style={styles.timeText}>{new Date(item.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              </View>
              <Text style={styles.vehicleText}>{item.address}</Text>
              
              <View style={styles.cardFooter}>
                <View style={styles.statusBadge}>
                  <CheckCircle size={14} color={Colors.text.primary} />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
                <View style={styles.navigateButton}>
                  <Navigation size={16} color="#FFFFFF" />
                  <Text style={styles.navigateText}>Go</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  mapContainer: { flex: 1 },
  bottomSheet: { height: '50%', backgroundColor: Colors.background, borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg, padding: Spacing.lg, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  sheetTitle: { fontFamily: 'Tusker', fontSize: 24, color: Colors.text.primary, marginBottom: Spacing.md },
  missionCard: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  missionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  clientName: { fontFamily: 'RightGrotesk', fontSize: 18, fontWeight: 'bold', color: Colors.text.primary },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  timeText: { fontFamily: 'RightGrotesk', fontSize: 12, fontWeight: 'bold', color: Colors.accent },
  vehicleText: { fontFamily: 'RightGrotesk', fontSize: 16, color: Colors.text.secondary, marginBottom: Spacing.md },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusText: { fontFamily: 'RightGrotesk', fontSize: 14, color: Colors.text.primary },
  navigateButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.text.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.sm },
  navigateText: { color: '#FFFFFF', fontFamily: 'RightGrotesk', fontSize: 14, fontWeight: 'bold' },
  errorText: { fontFamily: 'RightGrotesk', color: Colors.error, marginBottom: Spacing.sm },
});
