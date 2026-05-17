import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/lifestyleQuiz';
import { useAppStore } from '../../store/useAppStore';
import { QuizInfoModal } from './QuizInfoModal';
import styles from './LifestyleQuiz.module.css';

/**
 * LifestyleQuiz component for guiding users to recommended vehicle categories
 * Requirement: 5.1, 5.2, 5.3, 5.7
 */
interface LifestyleQuizProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const LifestyleQuiz: React.FC<LifestyleQuizProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showInfo, setShowInfo] = useState(false);
  const { setQuizResults } = useAppStore();

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const selectedAnswer = answers[currentQuestion.id];
  const progress = `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%`;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setQuizResults(answers);
    onComplete();
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.progress}>
          <div className={styles.progressBar} style={{ width: progress }} />
        </div>
        <div className={styles.headerActions}>
          <button className={styles.infoButton} onClick={() => setShowInfo(true)} title="How it works">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <button className={styles.closeButton} onClick={onCancel}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.question}>{currentQuestion.question}</div>
        <div className={styles.options}>
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.option} ${selectedAnswer === option.value ? styles.selected : ''}`}
              onClick={() => handleAnswer(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          {currentStep > 0 && (
            <button className={styles.backButton} onClick={handleBack} type="button">
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="label-medium">Back</span>
            </button>
          )}

          <button className={styles.nextButton} onClick={handleNext} type="button" disabled={!selectedAnswer}>
            {currentStep === QUIZ_QUESTIONS.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>

      {showInfo && <QuizInfoModal onClose={() => setShowInfo(false)} />}
    </div>
  );
};
