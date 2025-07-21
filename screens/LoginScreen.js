import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState('');

  const allowedDomains = ['@sst.edu.sg', '@ssts.edu.sg'];

  const handleLogin = async () => {
    const lowerEmail = email.toLowerCase().trim();
    const isAllowed = allowedDomains.some(domain => lowerEmail.endsWith(domain));

    if (isAllowed) {
      await AsyncStorage.setItem('userLoggedIn', 'true');
      setIsLoggedIn(true); // ✅ Tell App to switch to Home
    } else {
      Alert.alert('Invalid Email', 'Please use your school email.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with School Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter school email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold' },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
