import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Placeholder questions
const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "London", "Rome"],
    correctAnswer: "Paris",
  },
  {
    question: "Which is a prime number?",
    options: ["9", "15", "17", "21"],
    correctAnswer: "17",
  },
  {
    question: "Past tense of 'run'?",
    options: ["runned", "ran", "running", "runs"],
    correctAnswer: "ran",
  },
  {
    question: "5 + 7 = ?",
    options: ["10", "12", "14", "11"],
    correctAnswer: "12",
  },
  {
    question: "Which planet is closest to the sun?",
    options: ["Venus", "Earth", "Mercury", "Mars"],
    correctAnswer: "Mercury",
  },
];

export default function EndlessQuizScreen() {
  const navigation = useNavigation();
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex % questions.length];

  const handleAnswer = (option) => {
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert("❌ Game Over", `Your Score: ${score}`, [
        {
          text: "Play Again",
          onPress: () => {
            setScore(0);
            setCurrentIndex(0);
          },
        },
        {
          text: "Back to Menu",
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧠 Endless Quiz</Text>
      <Text style={styles.score}>🔥 Score: {score}</Text>
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
