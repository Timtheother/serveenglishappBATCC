import React from 'react';
import { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'; // 📦 npm install moment


const HomeIslandView = () => {

const [modalVisible, setModalVisible] = React.useState(false);

const [streak, setStreak] = React.useState(0);

useEffect(() => {
  const updateStreak = async () => {
    const today = moment().startOf('day');
    const lastLogin = await AsyncStorage.getItem('lastLoginDate');
    
    const savedStreak = parseInt(await AsyncStorage.getItem('loginStreak') || '0');

    if (lastLogin) {
      const lastDate = moment(lastLogin);
      const diff = today.diff(lastDate, 'days');

      if (diff === 1) {
        // consecutive day
        const newStreak = savedStreak + 1;
        setStreak(newStreak);
        await AsyncStorage.setItem('loginStreak', newStreak.toString());
      } else if (diff > 1) {
        // missed a day
        setStreak(1);
        await AsyncStorage.setItem('loginStreak', '1');
      } else {
        // same day
        setStreak(savedStreak);
      }
    } else {
      setStreak(1);
      await AsyncStorage.setItem('loginStreak', '1');
    }

    await AsyncStorage.setItem('lastLoginDate', today.toISOString());
  };

  updateStreak();
}, []);

  const navigation = useNavigation();
  const route = useRoute();

  const playClickSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/click.mp3')
    );
    await sound.playAsync();
  };

  const playStartSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/start.wav')
    );
    await sound.playAsync();
  };

  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const simulateYesterdayLogin = async () => {
    const yesterday = moment().subtract(1, 'days').startOf('day').toISOString();
    await AsyncStorage.setItem('lastLoginDate', yesterday);
    await AsyncStorage.setItem('loginStreak', '2'); // you can adjust the base streak value here
    alert('Simulated login from yesterday. Restart app to see effect.');
  };

  const simulateMissedLogin = async () => {
    const threeDaysAgo = moment().subtract(3, 'days').startOf('day').toISOString();
    await AsyncStorage.setItem('lastLoginDate', threeDaysAgo);
    await AsyncStorage.setItem('loginStreak', '1'); // resets streak to 1
    alert('Simulated missed login (3 days ago). Restart app to see reset streak.');
  };

  return (
    <ImageBackground
      source={require('../assets/bg_tile_blue.png')}
      style={styles.container}
    >
      <View style={styles.topBar}>
        <View style={styles.currencyRow}>
            <View style={styles.currencyBox}>
                <Text style={styles.coin}>🪙 1250</Text>
            </View>
            <View style={styles.currencyBox}>
                <Text style={styles.gem}>💎 50</Text>
            </View>
        </View>

      

        <TouchableOpacity onPress={()=> {playClickSound(); setModalVisible(true)}}>
          <Image source={require('../assets/icon_settings.png')} style={styles.icons} />
        </TouchableOpacity>


        <Modal
            transparent={true}
            animationType="fade"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                        <View style={styles.topBar1}>
                            <TouchableOpacity onPress={() => {setModalVisible(false); playClickSound()}}>
                                <Image source={require('../assets/icon_close.png')} style={styles.iconc}/>
                            </TouchableOpacity>
                            <Text style={styles.header}>Settings</Text>
                        </View>
                            <Text style={styles.modalText}>Setting 1</Text>
                            <Text style={styles.modalText}>Setting 2</Text>
                            <Text style={styles.modalText}>Setting 3</Text>
                            <Text style={styles.modalText}>Setting 4</Text>
                            <TouchableOpacity onPress={simulateYesterdayLogin}>
                              <Text style={styles.modalText}>[DEV] Simulate Yesterday Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={simulateMissedLogin}>
                              <Text style={styles.modalText}>[DEV] Simulate Missed Login</Text>
                            </TouchableOpacity>

                </View>
            </View>
        </Modal>
      </View>

      <View style={styles.streakTopBar}>
          <Text style={styles.flameIcon}>🔥</Text>
          <Text style={styles.streakText}>Login Streak: {streak} day{streak !== 1 ? 's' : ''}</Text>
        </View>

      <View style={styles.islandWrapper}>
        <Animated.Image
          source={require('../assets/sst_island.png')}
          style={[styles.islandImage, { transform: [{ translateY: floatAnim }] }]}
        />
      </View>

        <TouchableOpacity onPress={() => {
            playStartSound();
            navigation.navigate('Play');
            }} style={{ marginBottom: 170 }}>
          <Image
          source={require('../assets/play_button.png')}
            style={styles.playImage}
          />
      </TouchableOpacity>

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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30
  },
  topBar: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  topBar1: {
    width: '100%',
    paddingHorizontal: 0,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  streakTopBar: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 10
  },
  flameIcon: {
    fontSize: 24,
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  username: {
    fontSize: 18,
    color: '#fff'
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 15
  },
  coin: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: 30
  },
  gem: {
    color: '#00ffff',
    fontWeight: 'bold',
    fontSize: 30
  },
  header: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'left',
    width: '80%'
  },
  islandWrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  islandImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain'
  },
  playText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
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
  iconc: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  playImage: {
    width: 250,
    height: 75,
    resizeMode: 'contain'
  },
  navButton: {
    borderRadius: 10,
    padding: 5,
  },
  currencyBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
    marginHorizontal: 5,
  },
  
  activeButton: {
    backgroundColor: 'rgba(58, 110, 178, 0.64)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBox: {
    width: 360,
    padding: 20,
    backgroundColor: 'rgb(42, 105, 176)',
    borderRadius: 16,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
    paddingVertical: 10,
    color: '#fff    '
  },
  streakText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 5
  },
});

export default HomeIslandView;