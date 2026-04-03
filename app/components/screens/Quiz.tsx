'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, Button, Badge } from '../ui/Basic';
import { ProgressBar } from '../ui/Navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';
import { COLORS } from '../../utils/colors';

interface QuizScreenProps {
  onComplete?: () => void;
  onBack?: () => void;
}

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What does a stock represent?',
    options: [
      'Ownership in a company',
      'A loan to a company',
      'A bond issued by a company',
      'Cash held by a bank',
    ],
    correctAnswer: 0,
    explanation: 'A stock represents a share of ownership in a company.',
  },
  {
    id: 2,
    question: 'What is a dividend?',
    options: [
      'A stock price increase',
      'Money paid by a company to its shareholders',
      'A trading fee',
      'A tax on stocks',
    ],
    correctAnswer: 1,
    explanation: 'A dividend is a distribution of profits paid to shareholders.',
  },
  {
    id: 3,
    question: 'What does P/E ratio measure?',
    options: [
      'Price to Earnings ratio',
      'Profit per Employee',
      'Price per Equipment',
      'Payment Efficiency',
    ],
    correctAnswer: 0,
    explanation: 'P/E ratio measures how much investors are willing to pay per dollar of earnings.',
  },
];

export const QuizScreen: React.FC<QuizScreenProps> = ({ onComplete, onBack }) => {
  const { theme } = useTheme();
  const { addPoints } = useAppContext();
  const isDark = theme === 'dark';
  const textColor = isDark ? COLORS.dark.text : COLORS.light.text;
  const bgColor = isDark ? COLORS.dark.bg : COLORS.light.bg;
  const textSecondary = isDark ? COLORS.dark.textSecondary : COLORS.light.textSecondary;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleSelectAnswer = (index: number) => {
    if (!answered) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    setAnswered(true);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setCompleted(true);
      addPoints(50); // Reward for completing quiz
    }
  };

  if (completed) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4"
        style={{
          backgroundColor: bgColor,
        }}
      >
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: textColor }}>
          Quiz Complete!
        </h1>
        <div className="text-4xl font-bold mb-6" style={{ color: COLORS.primary }}>
          {score}/{QUIZ_QUESTIONS.length}
        </div>
        <p className="text-center mb-6 max-w-sm" style={{ color: textSecondary }}>
          Great job! You've earned 50 bonus points for completing the quiz.
        </p>
        <Button
          onClick={() => {
            onComplete?.();
            setCurrentQuestion(0);
            setScore(0);
            setCompleted(false);
          }}
          variant="primary"
        >
          Done
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div className="w-full max-w-md mb-5">
        <button
          onClick={onBack}
          className="p-1 rounded-lg -ml-1"
          style={{ color: textSecondary }}
          aria-label="Back"
        >
          <ArrowLeft size={26} />
        </button>
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <ProgressBar
          progress={currentQuestion + 1}
          total={QUIZ_QUESTIONS.length}
        />
      </div>

      {/* Question */}
      <div className="w-full max-w-md mb-6">
        <h2 className="text-2xl font-bold" style={{ color: textColor }}>
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="w-full max-w-md mb-6 grid gap-3">
        {question.options.map((option, index) => (
          <Card
            key={index}
            onClick={() => handleSelectAnswer(index)}
            className="p-4 cursor-pointer transition-all"
            style={{
              outline:
                selectedAnswer === index
                  ? `2px solid ${isCorrect ? '#10b981' : '#ef4444'}`
                  : 'none',
            }}
          >
            <div
              className="flex items-center gap-3"
              style={{
                opacity: selectedAnswer === null || selectedAnswer === index ? 1 : 0.5,
              }}
            >
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor:
                    selectedAnswer === index
                      ? isCorrect
                        ? '#10b981'
                        : '#ef4444'
                      : COLORS.primary,
                  backgroundColor:
                    answered && selectedAnswer === index
                      ? isCorrect
                        ? '#10b98120'
                        : '#ef444420'
                      : 'transparent',
                }}
              >
                {answered && selectedAnswer === index && (isCorrect ? '✓' : '✗')}
              </div>
              <span style={{ color: textColor }}>{option}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Explanation */}
      {answered && (
        <Card className="w-full max-w-md mb-6 p-4" style={{
          backgroundColor: isCorrect ? '#10b98110' : '#ef444410',
        }}>
          <div
            className="text-sm"
            style={{
              color: isCorrect ? '#059669' : '#dc2626',
            }}
          >
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </div>
          <div className="text-sm mt-2" style={{ color: textColor }}>
            {question.explanation}
          </div>
        </Card>
      )}

      {/* Action Button */}
      {!answered ? (
        <Button
          onClick={handleSubmit}
          variant="primary"
          disabled={selectedAnswer === null}
          fullWidth
          className="max-w-md"
        >
          Submit Answer
        </Button>
      ) : (
        <Button
          onClick={handleNext}
          variant="primary"
          fullWidth
          className="max-w-md"
        >
          {currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'Finish' : 'Next Question'}
        </Button>
      )}
    </div>
  );
};
