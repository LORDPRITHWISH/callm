"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Main Quiz Component
interface Question {
  id: string; // Added ID field for each question
  question: string;
  options: string[];
  correctAnswer: string;
}

interface RPGQuizProps {
  questions: Question[];
  previousAnswers?: Record<string, string>; // Changed from array to object with id keys
  onComplete?: (answers: Record<string, string>) => void; // Changed return type
}

export default function RPGQuiz({ 
  questions, 
  previousAnswers = {}, 
  onComplete = () => {} 
}: RPGQuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // Changed from array to object
  const [direction, setDirection] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const totalSteps = questions.length;

  const getNextUnansweredQuestion = React.useCallback(() => {
    for (let i = 0; i < questions.length; i++) {
      if (!answers[questions[i].id]) {
        return i + 1;
      }
    }
    return totalSteps;
  }, [answers, questions, totalSteps]);

  useEffect(() => {
    if (previousAnswers && Object.keys(previousAnswers).length > 0) {
      setAnswers(previousAnswers);
      setCurrentStep(getNextUnansweredQuestion());
    }
  }, [previousAnswers, getNextUnansweredQuestion]);

  // Calculate completion percentage
  const completionPercentage = (Object.keys(answers).length / totalSteps) * 100;

  const handleAnswerSelect = (selectedAnswer: string) => {
    const questionId = questions[currentStep - 1].id;
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
    setIsReviewMode(false);

    // Automatically advance to next question
    setTimeout(() => {
      if (currentStep < totalSteps) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsCompleted(true);
        onComplete(answers);
      }
    }, 600);
  };

  const handleStepChange = (step: number) => {
    // Only allow navigation to answered questions or the next unanswered question
    const nextUnanswered = getNextUnansweredQuestion();
    if (step < nextUnanswered || step === nextUnanswered) {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);

      // If it's a previous question that was already answered, we're in review mode
      const questionId = questions[step - 1].id;
      if (answers[questionId] !== undefined && step !== nextUnanswered) {
        setIsReviewMode(true);
      } else {
        setIsReviewMode(false);
      }
    }
  };

  // Go to next unanswered question
  const goToNextUnanswered = () => {
    const nextStep = getNextUnansweredQuestion();
    handleStepChange(nextStep);
    setIsReviewMode(false);
  };

  // Determine if we can navigate to a specific step
  const isStepNavigable = (step: number) => {
    // Can only navigate to already answered questions or the next unanswered one
    const nextUnanswered = getNextUnansweredQuestion();
    return step < nextUnanswered || step === nextUnanswered;
  };

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center p-4 relative">
      {/* Main Quiz Container */}
      <motion.div
        className="mx-auto w-full max-w-3xl rounded-lg overflow-hidden bg-gradient-to-r from-slate-800 to-indigo-900 relative z-10 border border-indigo-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: "0 0 25px rgba(99, 102, 241, 0.3), 0 0 5px rgba(99, 102, 241, 0.2)",
        }}
      >
        <div className="relative bg-gradient-to-r from-slate-900 to-indigo-950 py-4 px-8 border-b border-indigo-500/30 z-10">
          <motion.div
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          />

          <div className="flex items-center justify-center space-x-2">
            {questions.map((_, idx) => {
              const stepNum = idx + 1;
              const questionId = questions[idx].id;
              const isAnswered = answers[questionId] !== undefined;
              const canNavigate = isStepNavigable(stepNum);

              return (
                <React.Fragment key={stepNum}>
                  <StepIndicator step={stepNum} currentStep={currentStep} isAnswered={isAnswered} onClickStep={handleStepChange} isNavigable={canNavigate} />

                  {idx < questions.length - 1 && <ProgressConnector isCompleted={isAnswered} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        {isCompleted ? (
          <QuizComplete answers={answers} questions={questions} />
        ) : (
          <div className="relative min-h-[24rem] z-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full mx-auto p-8"
              >
                <Question
                  questionData={questions[currentStep - 1]}
                  onAnswerSelect={handleAnswerSelect}
                  questionNumber={currentStep}
                  selectedAnswer={answers[questions[currentStep - 1].id]}
                  isReviewMode={isReviewMode}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Review Banner - only shows in review mode */}
        {isReviewMode && !isCompleted && (
          <div
            className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-t border-indigo-500/30 p-3 flex justify-between items-center z-50 relative"
            style={{ boxShadow: "0 0 10px rgba(99, 102, 241, 0.2)" }}
          >
            <div className="flex items-center">
              <span className="text-indigo-400 text-xl inline-block mr-2">✓</span>
              <span className="text-blue-200 font-medium">
                You've already answered this question
                <span className="ml-2 text-blue-300/80">Feel free to change your response if needed</span>
              </span>
            </div>
            <button onClick={goToNextUnanswered} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
              <span>Continue Quiz</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border-t border-indigo-500/30 p-4 flex justify-between items-center z-10">
          <div className="text-blue-200 font-medium">
            <span className="text-indigo-400">Question</span>: {currentStep} / {totalSteps}
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          </div>

          <div className="text-blue-200 font-medium">
            <span className="text-indigo-400">Completed</span>: {Math.round(completionPercentage)}%
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Question Component
interface QuestionProps {
  questionData: Question;
  onAnswerSelect: (selectedAnswer: string) => void;
  questionNumber: number;
  selectedAnswer: string | undefined;
  isReviewMode: boolean;
}

function Question({ questionData, onAnswerSelect, questionNumber, selectedAnswer, isReviewMode }: QuestionProps) {
  const { question, options } = questionData;

  return (
    <div className="space-y-6">
      <div className="relative pb-2 mb-8">
        <h2 className="text-xl font-bold text-blue-100 mb-2">
          <span className="text-indigo-400">{questionNumber}.</span> {question}
        </h2>
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          let optionStyle = "border border-indigo-500/30 bg-slate-800/50 text-blue-200";
          let glowEffect = "";

          if (isSelected) {
            optionStyle = "border-2 border-indigo-500 bg-gradient-to-br from-slate-800 to-indigo-900 text-blue-100";
            glowEffect = "0 0 10px rgba(99, 102, 241, 0.4)";
          }

          return (
            <motion.button
              key={idx}
              className={`p-4 rounded-md text-left hover:bg-indigo-900/30 transition-colors ${optionStyle} relative overflow-hidden`}
              onClick={() => onAnswerSelect(option)}
              whileHover={{ scale: 1.01 }}
              style={{
                boxShadow: glowEffect,
              }}
            >
              <div className="flex items-center relative z-10">
                <div className="flex-shrink-0 mr-3">
                  <span
                    className={`inline-flex items-center justify-center h-7 w-7 rounded-full border text-sm ${
                      isSelected ? "bg-indigo-600 border-indigo-500 text-white" : "bg-slate-800 border-indigo-500/50 text-blue-200"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                </div>
                <span>{option}</span>
              </div>

              {/* Subtle hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Step Indicator Component with simplified effects
function StepIndicator({
  step,
  currentStep,
  isAnswered,
  onClickStep,
  isNavigable,
}: {
  step: number;
  currentStep: number;
  isAnswered: boolean;
  onClickStep: (step: number) => void;
  isNavigable: boolean;
}) {
  let bgColor = "bg-slate-800"; // Default unanswered
  let textColor = "text-blue-300";
  let borderColor = "border-indigo-500/30";
  let glowEffect = "";
  let opacity = isNavigable ? "opacity-100" : "opacity-50";
  let cursor = isNavigable ? "cursor-pointer" : "cursor-not-allowed";

  if (step === currentStep) {
    bgColor = "bg-indigo-600";
    textColor = "text-white";
    borderColor = "border-indigo-400";
    glowEffect = "0 0 8px rgba(99, 102, 241, 0.7)";
    opacity = "opacity-100";
  } else if (isAnswered) {
    bgColor = "bg-indigo-900";
    textColor = "text-indigo-300";
    borderColor = "border-indigo-500/50";
    glowEffect = "0 0 4px rgba(99, 102, 241, 0.4)";
  }

  const handleClick = () => {
    if (isNavigable) {
      onClickStep(step);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-center h-8 w-8 rounded-full border-2 ${borderColor} ${bgColor} ${textColor} ${cursor} ${opacity}`}
      style={{ boxShadow: glowEffect }}
    >
      {isAnswered ? <CheckIcon className="h-4 w-4" /> : <span className="text-sm">{step}</span>}
    </div>
  );
}

// Progress Connector with simplified animation
function ProgressConnector({ isCompleted }: { isCompleted: boolean }) {
  return (
    <div className="relative h-1 w-12 bg-slate-700 overflow-hidden rounded-full">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-500"
        initial={{ width: 0 }}
        animate={{ width: isCompleted ? "100%" : "0%" }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: "0 0 8px rgba(99, 102, 241, 0.4)",
        }}
      />
    </div>
  );
}

// Quiz Complete Screen
function QuizComplete({ answers, questions }: { answers: Record<string, string>; questions: Question[] }) {
  // Calculate score
  const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;
  
  return (
    <div className="py-12 px-8 text-center relative">
      <h1 className="text-3xl font-bold text-blue-100 mb-6" style={{ textShadow: "0 0 10px rgba(99, 102, 241, 0.3)" }}>
        Quiz Complete
      </h1>

      <div className="mb-10">
        <div
          className="inline-flex items-center justify-center h-40 w-40 rounded-full bg-indigo-900/50 border-4 border-indigo-500 relative"
          style={{ boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" }}
        >
          <span className="text-5xl font-bold text-blue-100" style={{ textShadow: "0 0 10px rgba(99, 102, 241, 0.5)" }}>
            100%
          </span>

          {/* Circular progress */}
          <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#circleGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="289, 289"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "center",
              }}
            />
          </svg>
        </div>
      </div>

      <div className="text-xl text-blue-100 mb-6 p-3 rounded-lg bg-indigo-900/30 inline-block" style={{ boxShadow: "0 0 15px rgba(99, 102, 241, 0.2)" }}>
        Congratulations! You've completed the quiz
      </div>

      <div className="text-lg text-blue-200 mb-8">Your responses have been recorded. Here's how you did:</div>

      {/* Results Summary */}
      <div className="max-w-2xl mx-auto space-y-8">
        <div
          className="bg-slate-800/50 rounded-lg p-6 border border-indigo-500/30 overflow-hidden"
          style={{
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.1)",
          }}
        >
          <h3 className="text-lg font-semibold text-indigo-300 mb-4 text-left">Your Answers</h3>

          <div className="space-y-4">
            {questions.map((question, idx) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              return (
                <div 
                  key={idx} 
                  className={`p-3 rounded-md border ${isCorrect ? 'border-green-500/30' : 'border-red-500/30'} bg-gradient-to-r ${
                    isCorrect ? 'from-slate-800 to-green-900/20' : 'from-slate-800 to-red-900/20'
                  } text-left`}
                >
                  <p className="text-sm text-blue-200 font-medium">{question.question}</p>
                  <div className="mt-2 text-sm flex justify-between">
                    <span className="text-blue-300">Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{userAnswer}</span></span>
                    {!isCorrect && <span className="text-green-400">Correct answer: {question.correctAnswer}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Score Summary */}
          <div className="mt-6 p-4 rounded-lg bg-indigo-900/30 border border-indigo-500/30">
            <div className="flex justify-between items-center">
              <span className="text-blue-200 font-medium">Total Score:</span>
              <span className="text-xl font-bold text-blue-100">
                {correctCount} / {questions.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/dashboard" className="mx-2">
          <button
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            style={{
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)",
            }}
          >
            <span>View Dashboard</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </Link>

        <Link href="/resources" className="mx-2">
          <button
            className="bg-slate-800 border border-indigo-500 text-blue-200 hover:bg-indigo-900/30 px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            style={{
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.2)",
            }}
          >
            <span>Try Again</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}

// Check Icon
function CheckIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}