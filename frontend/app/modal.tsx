import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';

export default function ModalScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Modal</Text>
      <View style={{ marginVertical: 30, height: 1, width: '80%', backgroundColor: '#eee' }} />
      <EditScreenInfo path="app/modal.tsx" />
    </View>
  );
}