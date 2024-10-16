import React from 'react';
import { Text, View } from 'react-native';

export default function TabAccount() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Account</Text>
      <View style={{ marginVertical: 30, height: 1, width: '80%', backgroundColor: '#eee' }} />
    </View>
  );
}