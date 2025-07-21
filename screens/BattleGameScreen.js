import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Animated } from 'react-native';

const mcqQuestion = {
  question: "What is the past tense of 'go'?",
  options: ["goed", "went", "gone", "going"],
  correctAnswer: "went",
};

export default function BattleGameScreen() {
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [mana, setMana] = useState(0);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [turnMessage, setTurnMessage] = useState('');
  const counterActive = useRef(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const getCritMultiplier = () => (Math.random() < 0.2 ? 2 : 1);

  const startQuestion = () => {
    setShowQuestion(true);
    setTurnMessage("🧠 Answer the question below!");
  };

  const checkAnswer = (option) => {
    if (option === mcqQuestion.correctAnswer) {
      setMana(m => m + 20);
      setTurnMessage('✅ Correct! +20 Mana!');
      setQuestionAnswered(true);
    } else {
      setTurnMessage('❌ Wrong answer! You lost your turn.');
      setQuestionAnswered(false);
      setIsPlayerTurn(false); // 👈 Immediately prevent button from showing
      setTimeout(() => {
        endPlayerTurn(); 
      }, 1000);
    }
    setShowQuestion(false);
    setSelectedOption(null);
  };
  

  const endPlayerTurn = () => {
    setIsPlayerTurn(false);
    setQuestionAnswered(false);
    setTimeout(enemyTurn, 1500);
  };

  const enemyTurn = () => {
    const moveType = Math.random() < 0.7 ? 'attack' : 'defend';

    if (moveType === 'attack') {
      const enemyMoves = [
        { name: 'Scratch', damage: 10, critChance: 0.2 },
        { name: 'Bite', damage: 20, critChance: 0.1 },
        { name: 'Dark Pulse', damage: 15, critChance: 0.3 }
      ];
      const move = enemyMoves[Math.floor(Math.random() * enemyMoves.length)];
      const crit = Math.random() < move.critChance ? 2 : 1;
      const dmg = move.damage * crit;

      setPlayerHP(hp => Math.max(hp - dmg, 0));
      flashCharacter('player', 'red');

      let msg = crit === 2
        ? `💥 Enemy used *${move.name}* — Critical hit for ${dmg} damage!`
        : `👾 Enemy used *${move.name}* and dealt ${dmg} damage!`;

      if (counterActive.current) {
        const counterDmg = 10;
        setEnemyHP(h => Math.max(h - counterDmg, 0));
        msg += `\n🔁 Your Counter Stance retaliated with ${counterDmg} damage!`;
        counterActive.current = false;
      }

      setTurnMessage(msg);
    } else {
      const enemyDefends = [
        { name: 'Hide', heal: 10 },
        { name: 'Shadow Cloak', heal: 5 }
      ];
      const move = enemyDefends[Math.floor(Math.random() * enemyDefends.length)];
      setEnemyHP(h => Math.min(h + move.heal, 100));
      flashCharacter('enemy', 'green');
      setTurnMessage(`🛡 Enemy used *${move.name}* and healed ${move.heal} HP.`);
    }

    setIsPlayerTurn(true);
  };

  const quickStrike = () => {
    if (mana >= 10) {
      const crit = getCritMultiplier();
      const dmg = 15 * crit;
      setMana(m => m - 10);
      setEnemyHP(h => Math.max(h - dmg, 0));
      setTurnMessage(crit === 2 ? `💥 Critical Quick Strike! ${dmg} damage!` : `⚔️ Quick Strike hit for ${dmg} damage!`);
    flashCharacter('enemy', 'red');
      endPlayerTurn();
    }
  };

  const powerSmash = () => {
    if (mana >= 25) {
      const crit = getCritMultiplier();
      const dmg = 35 * crit;
      setMana(m => m - 25);
      setEnemyHP(h => Math.max(h - dmg, 0));
      setTurnMessage(crit === 2 ? `💥 Critical Power Smash! ${dmg} damage!` : `🪓 Power Smash hit for ${dmg} damage!`);
      flashCharacter('enemy', 'red');
      
      endPlayerTurn();
    }
  };

  const lifeDrain = () => {
    if (mana >= 20) {
      const dmg = 10;
      const heal = 10;
      setMana(m => m - 20);
      setEnemyHP(h => Math.max(h - dmg, 0));
      setPlayerHP(h => Math.min(h + heal, 100));
      setTurnMessage(`🩸 Life Drain: You dealt ${dmg} and healed ${heal}!`);
      flashCharacter('enemy', 'red');
      flashCharacter('player', 'green')
      endPlayerTurn();
    }
  };

  const healGuard = () => {
    if (mana >= 10) {
      const heal = 15;
      setMana(m => m - 10);
      setTurnMessage(`🛡 Heal Guard: You healed ${heal} HP!`);
      setPlayerHP(h => Math.min(h + heal, 100));
      flashCharacter('player', 'green');
      endPlayerTurn();
    }
  };

  const counterStance = () => {
    if (mana >= 15) {
      const heal = 0;
      const dmg = 0
      setMana(m => m - 15);
      setPlayerHP(h => Math.min(h + 5, 100));
      counterActive.current = true;
      setTurnMessage('🛡 Counter Stance activated! You’ll strike back next turn!');
      setPlayerHP(h => Math.min(h + heal, 100));
      flashCharacter('player', 'green');
      setEnemyHP(h => Math.max(h - dmg, 0));
      flashCharacter('enemy', 'red');
      endPlayerTurn();
    }
  };

  const skipTurn = () => {
    setTurnMessage('⏭ You skipped your turn!');
    endPlayerTurn();
  };

const playerFlashColor = useRef(new Animated.Value(0)).current;
const enemyFlashColor = useRef(new Animated.Value(0)).current;

const [playerFlashTint, setPlayerFlashTint] = useState('red');
const [enemyFlashTint, setEnemyFlashTint] = useState('red');

const flashCharacter = (target, color = 'red') => {
  const animRef = target === 'player' ? playerFlashColor : enemyFlashColor;

  // Set color state
  if (target === 'player') setPlayerFlashTint(color);
  else setEnemyFlashTint(color);

  Animated.sequence([
    Animated.timing(animRef, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }),
    Animated.timing(animRef, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }),
  ]).start();
};
  

  useEffect(() => {
    if (enemyHP <= 0) Alert.alert('Victory!', '🎉 You defeated your opponent!');
    if (playerHP <= 0) Alert.alert('Defeat!', '💀 You lost the battle!');
  }, [playerHP, enemyHP]);

  const HealthBar = ({ current, max, color }) => {
    const percentage = (current / max) * 100;
  
    return (
      <View style={styles.healthBarContainer}>
        <View style={[styles.healthBar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚔️ Battle Arena</Text>

      {/* Character Display Section */}
      <View style={styles.battleField}>

      <View style={styles.playerContainer}>
  <Image source={require('../assets/player.png')} style={styles.playerImage} />
  <Animated.View
  style={[
    styles.flashOverlay,
    {
      opacity: playerFlashColor,
      backgroundColor: playerFlashTint,
    },
  ]}
/>
  <HealthBar current={playerHP} max={100} color="#00ff00" />
  <Text style={styles.healthText}>HP: {playerHP}/100</Text>
</View>

      <View style={styles.enemyContainer}>
  <Image source={require('../assets/enemy.png')} style={styles.enemyImage} />
  <Animated.View
  style={[
    styles.flashOverlay,
    {
      opacity: enemyFlashColor,
      backgroundColor: enemyFlashTint,
    },
  ]}
/>
  <HealthBar current={enemyHP} max={100} color="#ff0000" />
  <Text style={styles.healthText}>HP: {enemyHP}/100</Text>
</View>

</View>


      {/* Stats & Message */}
      <View style={styles.stats}>
        <Text></Text>
        <Text style={styles.stat}>💧 Mana: {mana}</Text>
        <Text style={styles.turn}>{isPlayerTurn ? '🎮 Your Turn' : '🤖 Enemy Turn'}</Text>
        <Text style={styles.message}>{turnMessage}</Text>
      </View>

      {/* Question Section */}
      {isPlayerTurn && !questionAnswered && !showQuestion && (
        <TouchableOpacity style={styles.button} onPress={startQuestion}>
          <Text style={styles.buttonText}>🧠 Answer Question</Text>
        </TouchableOpacity>
      )}

      {showQuestion && (
        <View style={styles.quizContainer}>
          <Text style={styles.quizQuestion}>{mcqQuestion.question}</Text>
          {mcqQuestion.options.map((option, idx) => (
  <TouchableOpacity
    key={idx}
    style={styles.option}
    onPress={() => {
      setSelectedOption(option);
      setTimeout(() => checkAnswer(option), 100); // slight delay to ensure state updates
    }}
  >
    <Text style={styles.buttonText}>{option}</Text>
  </TouchableOpacity>
))}
        </View>
      )}

      {/* Action Section */}
      {isPlayerTurn && questionAnswered && (
        <>
          <Text style={styles.subheader}>⚔️ Attacks</Text>
          <TouchableOpacity style={[styles.button, styles.attack]} onPress={quickStrike}>
            <Text style={styles.buttonText}>Quick Strike (10 MP)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.attack]} onPress={powerSmash}>
            <Text style={styles.buttonText}>Power Smash (25 MP)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.attack]} onPress={lifeDrain}>
            <Text style={styles.buttonText}>Life Drain (20 MP)</Text>
          </TouchableOpacity>

          <Text style={styles.subheader}>🛡 Defenses</Text>
          <TouchableOpacity style={[styles.button, styles.defend]} onPress={healGuard}>
            <Text style={styles.buttonText}>Heal Guard (10 MP)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.defend]} onPress={counterStance}>
            <Text style={styles.buttonText}>Counter Stance (15 MP)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#888' }]} onPress={skipTurn}>
            <Text style={styles.buttonText}>⏭ Skip Turn</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    // Overall container
    container: {
      flex: 1,
      backgroundColor: '#0a0a23',
      alignItems: 'center',
      paddingTop: 40,
    },
  
    // Header title
    header: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 10,
    },
  
    // Battlefield layout
    battleField: {
      width: '100%',
      flexDirection: 'row',  // ✅ changed from 'column'
      justifyContent: 'space-around', // or 'space-between'
      alignItems: 'center',
      marginVertical: 10,
    },
  
    enemyContainer: {
      marginTop: 10,
      marginBottom: 80, // Push enemy higher
      alignItems: 'center',
    },
  
    playerContainer: {
      marginTop: 40,
      alignItems: 'center',
    },
  
    enemyImage: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
    },
  
    playerImage: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
    },
  
    // Stats & turn display
    stats: {
      alignItems: 'center',
      marginBottom: 10,
    },
  
    stat: {
      color: '#fff',
      fontSize: 18,
    },
  
    turn: {
      color: '#ffe066',
      fontSize: 18,
      marginTop: 4,
    },
  
    message: {
      color: '#ffffff',
      fontSize: 16,
      fontStyle: 'italic',
      textAlign: 'center',
      marginVertical: 8,
      paddingHorizontal: 10,
    },
  
    // Subheader for attack/defense sections
    subheader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      marginTop: 10,
    },
  
    // Buttons
    button: {
      backgroundColor: '#3a86ff',
      padding: 12,
      borderRadius: 10,
      marginVertical: 6,
      width: '90%',
      alignItems: 'center',
    },
  
    attack: {
      backgroundColor: '#ef233c',
    },
  
    defend: {
      backgroundColor: '#06d6a0',
    },
  
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  
    // Quiz styles
    quizContainer: {
      backgroundColor: '#2d2d44',
      padding: 20,
      borderRadius: 10,
      marginVertical: 10,
      width: '90%',
    },
  
    quizQuestion: {
      color: '#fff',
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 'bold',
    },
  
    option: {
      backgroundColor: '#1e90ff',
      padding: 10,
      marginVertical: 5,
      borderRadius: 8,
    },
    flashOverlay: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 10,
        zIndex: 2,
      },
      healthBarContainer: {
        width: 150,
        height: 15,
        backgroundColor: '#333',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        overflow: 'hidden',
      },
      
      healthBar: {
        height: '100%',
        borderRadius: 8,
      },
      healthText: {
  color: '#fff',
  fontSize: 14,
  marginBottom: 4,
  textAlign: 'center',
      },
  });
  