import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeIslandView from './screens/HomeIslandView';
import RevisionScreen from './screens/RevisionScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import PlayScreen from './screens/PlayScreen';
import LoginScreen from './screens/LoginScreen';
import BattleGameScreen from './screens/BattleGameScreen';
import EndlessQuizScreen from './screens/EndlessQuizScreen';
import TimedQuizScreen from './screens/TimedQuizScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedLogin = await AsyncStorage.getItem('userLoggedIn');
      setIsLoggedIn(storedLogin === 'true');
      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (isLoading) return null; // You can replace with a splash screen later

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Home">
            {(props) => <HomeIslandView {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        )}
        <Stack.Screen name="Revision" component={RevisionScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="Play" component={PlayScreen} />
        <Stack.Screen name="BattleGame" component={BattleGameScreen} />
        <Stack.Screen name="EndlessQuiz" component={EndlessQuizScreen} />
        <Stack.Screen name="TimedQuiz" component={TimedQuizScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
