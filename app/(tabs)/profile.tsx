import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, Radius, Glass } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, ShieldCheck, LogOut, ChevronRight, Award, Zap, Star } from 'lucide-react-native';

export default function ProfileScreen() {
  const kpis = [
    { label: 'Missions', value: '124', icon: Zap, color: Colors.accent },
    { label: 'Score', value: '4.8', icon: Star, color: '#FFD700' },
    { label: 'Badge', value: 'Pro', icon: Award, color: Colors.seaGreen },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <User size={40} color={Colors.accent} />
          </View>
          <Text style={styles.userName}>Technicien Kliro</Text>
          <View style={styles.badge}>
            <ShieldCheck size={12} color={Colors.seaGreen} />
            <Text style={styles.badgeText}>Certifié Kliro V2</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {kpis.map((kpi, idx) => (
            <View key={idx} style={styles.statCard}>
              <kpi.icon size={20} color={kpi.color} />
              <Text style={styles.statValue}>{kpi.value}</Text>
              <Text style={styles.statLabel}>{kpi.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <User size={20} color={Colors.text.secondary} />
              <Text style={styles.menuItemText}>Mes informations</Text>
            </View>
            <ChevronRight size={18} color={Colors.border} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Zap size={20} color={Colors.text.secondary} />
              <Text style={styles.menuItemText}>Historique des revenus</Text>
            </View>
            <ChevronRight size={18} color={Colors.border} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, paddingBottom: 100 },
  header: { 
    alignItems: 'center', 
    marginBottom: Spacing.xxl,
    marginTop: Spacing.xl,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  userName: {
    fontFamily: 'RightGrotesk',
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: 'RightGrotesk',
    fontSize: 12,
    color: Colors.seaGreen,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  statCard: {
    ...Glass.card,
    width: '30%',
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: 'RightGrotesk',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  statLabel: {
    fontFamily: 'RightGrotesk',
    fontSize: 10,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontFamily: 'RightGrotesk',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuItemText: {
    fontFamily: 'RightGrotesk',
    fontSize: 16,
    color: Colors.text.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.xl,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: '#FFEBEE',
  },
  logoutText: {
    fontFamily: 'RightGrotesk',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.error,
  },
});
