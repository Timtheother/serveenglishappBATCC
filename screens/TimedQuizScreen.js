import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Placeholder question list
const questions = [
  {
    question: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
    correctAnswer: "Tokyo",
  },
  {
    question: "Which number is divisible by 3?",
    options: ["10", "14", "18", "22"],
    correctAnswer: "18",
  },
  {
    question: "Synonym of 'happy'?",
    options: ["sad", "angry", "joyful", "tired"],
    correctAnswer: "joyful",
  },
  {
    question: "9 x 6 = ?",
    options: ["54", "45", "63", "56"],
    correctAnswer: "54",
  },
  {
    question: "Largest planet?",
    options: ["Mars", "Earth", "Jupiter", "Saturn"],
    correctAnswer: "Jupiter",
  },
];

export default function TimedQuizScreen() {
  const navigation = useNavigation();
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);

  const currentQuestion = questions[currentIndex % questions.length];

  useEffect(() => {
    // Start countdown
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          showGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current); // Cleanup
  }, []);

  const handleAnswer = (option) => {
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setCurrentIndex(currentIndex + 1);
  };

  const showGameOver = () => {
    Alert.alert("⏰ Time's up!", `Your Score: ${score}`, [
      {
        text: "Play Again",
        onPress: () => {
          setScore(0);
          setCurrentIndex(0);
          setTimeLeft(60);
          // restart timer
          timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
              if (prev <= 1) {
                clearInterval(timerRef.current);
                showGameOver();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      },
      {
        text: "Back to Menu",
        onPress: () => navigation.goBack(),
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⏱ Timed Quiz</Text>
      <Text style={styles.score}>🔥 Score: {score}</Text>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>

      <View style={styles.card}>
        <Text style={styles.question}>{currentQuestion.question}</Text>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0a0a23',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    header: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 20,
    },
    score: {
      fontSize: 20,
      color: '#00ffcc',
      marginBottom: 10,
    },
    timer: {
      fontSize: 20,
      color: '#ff6666',
      marginBottom: 20,
    },
    card: {
      backgroundColor: '#2d2d44',
      borderRadius: 12,
      padding: 20,
      width: '100%',
    },
    question: {
      fontSize: 20,
      color: '#fff',
      marginBottom: 15,
      fontWeight: 'bold',
    },
    option: {
      backgroundColor: '#1e90ff',
      padding: 12,
      borderRadius: 8,
      marginVertical: 6,
    },
    optionText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
    },
  });
  