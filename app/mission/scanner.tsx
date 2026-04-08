import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Focus } from 'lucide-react-native';

export default function ScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permText}>Caméra requise pour scanner la plaque.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permButton}>
          <Text style={styles.permButtonText}>Autoriser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <View style={styles.overlay}>
          <SafeAreaView style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft size={32} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan Plaque</Text>
            <View style={{width:32}}/>
          </SafeAreaView>
          
          <View style={styles.scanArea}>
            <Focus size={200} color={Colors.accent} strokeWidth={1} />
            <Text style={styles.scanText}>Placez la plaque dans le cadre</Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'space-between' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md },
  backButton: { padding: Spacing.xs },
  headerTitle: { fontFamily: 'RightGrotesk', fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  scanArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanText: { fontFamily: 'RightGrotesk', color: '#FFF', fontSize: 18, marginTop: Spacing.lg },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  permText: { fontFamily: 'RightGrotesk', fontSize: 16, marginBottom: Spacing.md },
  permButton: { backgroundColor: Colors.accent, padding: Spacing.md, borderRadius: 8 },
  permButtonText: { color: '#FFF', fontFamily: 'RightGrotesk', fontWeight: 'bold' }
});
