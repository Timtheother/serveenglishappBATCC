import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';

export default function PlayScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const playClickSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/click.mp3')
    );
    await sound.playAsync();
  };

  const handleSelectMode = (mode) => {
    playClickSound();
    // Navigate or update state based on mode
    alert(`You selected: ${mode}`);
    // You can use: navigation.navigate('GameModeScreen', { mode })
  };

  return (
    <ImageBackground
      source={require('../assets/bg_tile_blue.png')}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Choose a Game Mode</Text>

        <TouchableOpacity
        style={styles.button} 
        onPress={() => navigation.navigate('TimedQuiz')}>
          <Text style={styles.buttonText}>⏱ Timed Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('EndlessQuiz')}>

          <Text style={styles.buttonText}>♾ Endless Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BattleGame')}
      >
        <Text style={styles.buttonText}>⚔️ Battle Mode</Text>
      </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 2
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
});