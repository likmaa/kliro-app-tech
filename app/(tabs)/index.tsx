import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius } from '@/constants/theme';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Navigation, Clock, CheckCircle } from 'lucide-react-native';

export default function TechHubScreen() {
  const router = useRouter();
  
  const activeMissions = [
    { id: '1', client: 'Aïcha', vehicle: 'Toyota RAV4', time: '14:00', status: 'En attente', lat: 6.3653, lng: 2.4183 },
    { id: '2', client: 'Marc', vehicle: 'Hyundai Tucson', time: '16:30', status: 'En attente', lat: 6.3700, lng: 2.4200 },
  ];

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
          {activeMissions.map((mission) => (
            <Marker
              key={mission.id}
              coordinate={{ latitude: mission.lat, longitude: mission.lng }}
              title={mission.client}
              description={mission.vehicle}
            />
          ))}
        </MapView>
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.sheetTitle}>File du jour ({activeMissions.length})</Text>
        
        <FlatList
          data={activeMissions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: Spacing.xl }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.missionCard}
              onPress={() => router.push(`/mission/${item.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.missionHeader}>
                <Text style={styles.clientName}>{item.client}</Text>
                <View style={styles.timeBadge}>
                  <Clock size={12} color={Colors.accent} />
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </View>
              <Text style={styles.vehicleText}>{item.vehicle}</Text>
              
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
});
