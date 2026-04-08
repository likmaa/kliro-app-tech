import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, Radius, Glass } from '@/constants/theme';
import { Button } from '@/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, Phone, CheckSquare } from 'lucide-react-native';
import { getBooking, sendTechnicianLocation, updateBookingStatus } from '@/lib/api';

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [status, setStatus] = useState<'pending'|'en_route'|'on_site'|'washing'|'completed'>('pending');
  const [address, setAddress] = useState('Chargement...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checklist, setChecklist] = useState({
    pneus: false,
    carrosserie: false,
    interieur: false,
  });
  const [photosTaken, setPhotosTaken] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;
        const booking = await getBooking(String(id));
        setAddress(booking.address || 'Adresse indisponible');
        if (['pending', 'en_route', 'on_site', 'washing', 'completed'].includes(booking.status)) {
          setStatus(booking.status as 'pending' | 'en_route' | 'on_site' | 'washing' | 'completed');
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Impossible de charger la mission.';
        setError(message);
      }
    };
    void load();
  }, [id]);

  const getNextAction = () => {
    switch (status) {
      case 'pending': return { title: 'Partir vers le client', next: 'en_route' as const, variant: 'primary' };
      case 'en_route': return { title: 'Je suis sur place', next: 'on_site' as const, variant: 'secondary' };
      case 'on_site': {
        const canStart = checklist.pneus && checklist.carrosserie && checklist.interieur && photosTaken >= 2;
        return { 
          title: canStart ? 'Démarrer le lavage' : 'Compléter le protocole', 
          next: 'washing' as const, 
          variant: 'primary',
          disabled: !canStart
        };
      }
      case 'washing': return { title: "Terminer l'intervention", next: 'completed' as const, variant: 'primary' };
      case 'completed': return { title: 'Retour au Hub', next: 'done' as const, variant: 'secondary' };
      default: return { title: 'Retour', next: 'done' as const, variant: 'ghost' };
    }
  };

  const currentAction = getNextAction();

  const handleAction = async () => {
    if (currentAction.next === 'done') {
      router.replace('/(tabs)/planning');
    } else {
      if ((currentAction as any).disabled) {
        setError("Veuillez remplir la checklist et prendre au moins 2 photos.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        if (id) {
          await updateBookingStatus(String(id), currentAction.next);
          // Simulation de position
          await sendTechnicianLocation({ booking_id: Number(id), lat: 6.367, lng: 2.419 });
        }
        setStatus(currentAction.next as 'pending' | 'en_route' | 'on_site' | 'washing' | 'completed');
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Mise à jour impossible.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const takePhoto = () => {
    // Simulation
    setPhotosTaken(prev => prev + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mission #{id}</Text>
        <TouchableOpacity style={styles.phoneButton}>
          <Phone size={20} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoCard}>
          <Text style={styles.clientName}>Mission terrain</Text>
          <Text style={styles.vehicleInfo}>Véhicule client</Text>
          <Text style={styles.plateInfo}>Immatriculation : BJ-4523-RB</Text>
          <Text style={styles.address}>{address}</Text>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.sectionTitle}>État de l'intervention</Text>
        
        <View style={styles.statusTimeline}>
          {['pending', 'en_route', 'on_site', 'washing', 'completed'].map((step, idx) => {
            const stepNames = ['En file', 'En route', 'Sur place', 'Lavage', 'Terminé'];
            const isActive = status === step;
            const isPassed = ['pending', 'en_route', 'on_site', 'washing', 'completed'].indexOf(status) > idx;
            
            return (
              <View key={step} style={styles.timelineItem}>
                <View style={[styles.timelineDot, isActive || isPassed ? styles.timelineDotActive : null]} />
                <Text style={[styles.timelineText, isActive ? styles.timelineTextActive : null]}>
                  {stepNames[idx]}
                </Text>
              </View>
            );
          })}
        </View>

        {status === 'on_site' || status === 'washing' ? (
          <View style={styles.protocolSection}>
            <Text style={styles.sectionTitle}>Protocole Obligatoire</Text>
            
            <View style={styles.checklistCard}>
              <TouchableOpacity style={styles.checkItem} onPress={() => toggleCheck('pneus')}>
                <CheckSquare size={20} color={checklist.pneus ? Colors.accent : Colors.text.secondary} />
                <Text style={[styles.checkText, checklist.pneus && styles.checkTextActive]}>État des pneus & jantes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkItem} onPress={() => toggleCheck('carrosserie')}>
                <CheckSquare size={20} color={checklist.carrosserie ? Colors.accent : Colors.text.secondary} />
                <Text style={[styles.checkText, checklist.carrosserie && styles.checkTextActive]}>Scan des rayures (Carrosserie)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkItem} onPress={() => toggleCheck('interieur')}>
                <CheckSquare size={20} color={checklist.interieur ? Colors.accent : Colors.text.secondary} />
                <Text style={[styles.checkText, checklist.interieur && styles.checkTextActive]}>Intérieur : Objets de valeur</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Camera size={24} color={Colors.text.primary} />
              <Text style={styles.photoButtonText}>Prendre une photo ({photosTaken}/4)</Text>
            </TouchableOpacity>
          </View>
        ) : null}

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title={currentAction.title}
          onPress={handleAction} 
          variant={currentAction.variant as any} 
          loading={loading}
          disabled={(currentAction as any).disabled && status !== 'completed'}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backButton: { padding: Spacing.xs },
  phoneButton: { padding: Spacing.xs, backgroundColor: Colors.surface, borderRadius: 20 },
  headerTitle: { fontFamily: 'RightGrotesk', fontSize: 16, fontWeight: 'bold', color: Colors.text.primary },
  container: { padding: Spacing.xl, paddingBottom: 100 },
  infoCard: { ...Glass.card, padding: Spacing.lg, borderRadius: Radius.md, marginBottom: Spacing.xl },
  clientName: { fontFamily: 'RightGrotesk', fontSize: 24, color: Colors.text.primary, marginBottom: 4 },
  vehicleInfo: { fontFamily: 'RightGrotesk', fontSize: 16, color: Colors.text.secondary, marginBottom: 4 },
  plateInfo: { fontFamily: 'RightGrotesk', fontSize: 14, fontWeight: 'bold', color: Colors.text.primary, marginBottom: 8 },
  address: { fontFamily: 'RightGrotesk', fontSize: 14, color: Colors.text.secondary },
  sectionTitle: { fontFamily: 'RightGrotesk', fontSize: 18, fontWeight: 'bold', color: Colors.text.primary, marginBottom: Spacing.md },
  statusTimeline: { marginBottom: Spacing.xl, paddingLeft: Spacing.md },
  timelineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.border, marginRight: Spacing.md },
  timelineDotActive: { backgroundColor: Colors.accent },
  timelineText: { fontFamily: 'RightGrotesk', fontSize: 16, color: Colors.text.secondary },
  timelineTextActive: { color: Colors.text.primary, fontWeight: 'bold' },
  protocolSection: { marginTop: Spacing.lg },
  checklistCard: {
    ...Glass.card,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  checkText: {
    fontFamily: 'RightGrotesk',
    fontSize: 16,
    color: Colors.text.secondary,
  },
  checkTextActive: {
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photoButtonText: {
    fontFamily: 'RightGrotesk',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.xl, ...Glass.footer },
  errorText: { fontFamily: 'RightGrotesk', color: Colors.error, marginBottom: Spacing.md },
});
