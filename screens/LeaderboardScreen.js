import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';

const placeholderData = [
  { id: '1', name: 'Blue House', score: 250 },
  { id: '2', name: 'Black House', score: 220 },
  { id: '3', name: 'Yellow House', score: 200 },
  { id: '4', name: 'Red House', score: 180 },
  { id: '5', name: 'Green House', score: 160 },
];


export default function LeaderboardScreen() {
  const navigation = useNavigation();
    const route = useRoute();

  const playClickSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/click.mp3')
    );
    await sound.playAsync();
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.score}>{item.score} pts</Text>
    </View>
  );


  return (
  
    <View style={{ flex: 1 }}>

<SafeAreaView style={styles.container1}>
      <Text style={styles.header}>🏆 House Leaderboard</Text>
      <FlatList
        data={placeholderData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>

      <View style={styles.navBar}>
              <TouchableOpacity
                onPress={() => {
                    playClickSound();
                    navigation.navigate('Revision');
                    }}
                    style={[
                        styles.navButton,
                        route.name === 'Revision' && styles.activeButton
                    ]}
        >
          <Image source={require('../assets/icon_revision.png')} style={styles.iconr} />
        </TouchableOpacity>
        
        <TouchableOpacity
                onPress={() => {
                    playClickSound();
                    navigation.navigate('Home');
                    }}
                    style={[
                        styles.navButton,
                        route.name === 'Home' && styles.activeButton
                    ]}
        >
          <Image source={require('../assets/icon_battle.png')} style={styles.iconr} />
        </TouchableOpacity>
        
        <TouchableOpacity
                onPress={() => {
                    playClickSound();
                    navigation.navigate('Leaderboard');
                    }}
                    style={[
                        styles.navButton,
                        route.name === 'Leaderboard' && styles.activeButton
                    ]}
        >
          <Image source={require('../assets/icon_leaderboard.png')} style={styles.iconr} />
        </TouchableOpacity>
      </View>

    </View>

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container1: {
    flex: 1,
    backgroundColor: '#0a0a23',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  navBar: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  icon: {
    width: 80,
    height: 105,
    resizeMode: 'contain'
  },
  iconr: {
    width: 80,
    height: 93,
    marginTop: 10,
    resizeMode: 'contain'
  },
  icons: {
    width: 60,
    height: 60,
    resizeMode: 'contain'
  },
  navButton: {
    borderRadius: 10,
    padding: 5,
  },
  
  activeButton: {
    backgroundColor: 'rgba(58, 110, 178, 0.64)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1e1e2e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  rank: {
    color: '#ffe066',
    fontSize: 18,
    fontWeight: 'bold',
    width: 60,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    flex: 1,
  },
  score: {
    color: '#00ffcc',
    fontSize: 18,
    width: 80,
    textAlign: 'right',
  },
  header: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});