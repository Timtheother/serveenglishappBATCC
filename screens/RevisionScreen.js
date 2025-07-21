import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';

export default function RevisionScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const playClickSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/click.mp3')
    );
    await sound.playAsync();
  };

  const handleItemPress = (label) => {
    playClickSound();
    alert(`Coming soon: ${label}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a23' }}>
      <SafeAreaView style={styles.safeContainer}>
        <Text style={styles.header}>📚 Revision Centre</Text>

        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity
            style={styles.revisionCard}
            onPress={() => handleItemPress('MCQ Practice')}
          >
            <Text style={styles.cardText}>🧠 MCQ Practice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.revisionCard}
            onPress={() => handleItemPress('Vocabulary Review')}
          >
            <Text style={styles.cardText}>📝 Vocabulary Review</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.revisionCard}
            onPress={() => handleItemPress('Grammar Tips')}
          >
            <Text style={styles.cardText}>🔤 Grammar Tips</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => {
            playClickSound();
            navigation.navigate('Revision');
          }}
          style={[
            styles.navButton,
            route.name === 'Revision' && styles.activeButton,
          ]}
        >
          <Image
            source={require('../assets/icon_revision.png')}
            style={styles.iconr}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            playClickSound();
            navigation.navigate('Home');
          }}
          style={[
            styles.navButton,
            route.name === 'Home' && styles.activeButton,
          ]}
        >
          <Image
            source={require('../assets/icon_battle.png')}
            style={styles.iconr}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            playClickSound();
            navigation.navigate('Leaderboard');
          }}
          style={[
            styles.navButton,
            route.name === 'Leaderboard' && styles.activeButton,
          ]}
        >
          <Image
            source={require('../assets/icon_leaderboard.png')}
            style={styles.iconr}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    paddingBottom: 40,
  },
  revisionCard: {
    backgroundColor: '#1e1e2e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 20,
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
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  iconr: {
    width: 80,
    height: 93,
    marginTop: 10,
    resizeMode: 'contain',
  },
  navButton: {
    borderRadius: 10,
    padding: 5,
  },
  activeButton: {
    backgroundColor: 'rgba(58, 110, 178, 0.64)',
  },
});
