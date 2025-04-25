"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Main Survey Component
interface Question {
  question: string;
  options: string[];
  category: string; // For categorizing questions (e.g., anxiety, depression)
}

interface MentalHealthSurveyProps {
  questions: Question[];
  previousAnswers?: string[];
  onComplete?: (answers: string[]) => void;
}

export default function MentalHealthSurvey({ questions, previousAnswers, onComplete = () => {} }: MentalHealthSurveyProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<string[]>([]);
  const [direction, setDirection] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const totalSteps = questions.length;

  const getNextUnansweredQuestion = React.useCallback(() => {
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === undefined) {
        return i + 1;
      }
    }
    return totalSteps;
  }, [answers, questions, totalSteps]);

  useEffect(() => {
    if (previousAnswers) {
      setAnswers(previousAnswers);
      setCurrentStep(getNextUnansweredQuestion());
    }
  }, [previousAnswers, getNextUnansweredQuestion]);

  // When the current step changes, check if we're in review mode
  useEffect(() => {
    // We're in review mode if looking at a previously answered question
    // and it's not the next question to be answered
    // const nextUnanswered = getNextUnansweredQuestion();
    // setIsReviewMode(answers[currentStep - 1] !== undefined && currentStep !== nextUnanswered);
  }, [currentStep, answers, getNextUnansweredQuestion]);

  // Calculate completion percentage
  const completionPercentage = (answers.filter((a) => a !== undefined).length / totalSteps) * 100;

  const handleAnswerSelect = (selectedAnswer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep - 1] = selectedAnswer;
    setAnswers(newAnswers);
    setIsReviewMode(false);

    // Automatically advance to next question
    setTimeout(() => {
      if (currentStep < totalSteps) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsCompleted(true);
        onComplete(newAnswers);
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
      if (answers[step - 1] !== undefined && step !== nextUnanswered) {
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
      {/* Main Survey Container */}
      <motion.div
        className="mx-auto w-full max-w-3xl rounded-lg shadow-xl overflow-hidden bg-white relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: "0 0 25px rgba(79, 209, 197, 0.3), 0 0 5px rgba(79, 209, 197, 0.2)",
        }}
      >
        <div className="relative bg-gradient-to-r from-teal-50 to-cyan-50 py-4 px-8 border-b border-teal-100 z-10">
          <motion.div
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          />

          <div className="flex items-center justify-center space-x-2">
            {questions.map((_, idx) => {
              const stepNum = idx + 1;
              const isAnswered = answers[idx] !== undefined;
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
          <SurveyComplete answers={answers} questions={questions} />
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
                  selectedAnswer={answers[currentStep - 1]}
                  isReviewMode={isReviewMode}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Review Banner - only shows in review mode */}
        {isReviewMode && !isCompleted && (
          <div
            className="bg-gradient-to-r from-cyan-50 via-teal-50 to-cyan-50 border-t border-teal-100 p-3 flex justify-between items-center z-50 relative"
            style={{ boxShadow: "0 0 10px rgba(79, 209, 197, 0.2)" }}
          >
            <div className="flex items-center">
              <span className="text-teal-500 text-xl inline-block mr-2">✓</span>
              <span className="text-teal-700 font-medium">
                You've already answered this question
                <span className="ml-2 text-teal-600/80">Feel free to change your response if needed</span>
              </span>
            </div>
            <button onClick={goToNextUnanswered} className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
              <span>Continue Survey</span>
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
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-t border-teal-100 p-4 flex justify-between items-center z-10">
          <div className="text-teal-700 font-medium">
            <span className="text-teal-600">Question</span>: {currentStep} / {totalSteps}
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
          </div>

          <div className="text-teal-700 font-medium">
            <span className="text-teal-600">Completed</span>: {Math.round(completionPercentage)}%
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
  const { question, options, category } = questionData;

  return (
    <div className="space-y-6">
      <div className="relative pb-2 mb-8">
        <h2 className="text-xl font-bold text-teal-800 mb-2">
          <span className="text-teal-600">{questionNumber}.</span> {question}
        </h2>
        <div className="text-sm text-teal-600 italic mb-2">Category: {category}</div>
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-400"></div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          let optionStyle = "border border-gray-200 bg-white text-gray-700";
          let glowEffect = "";

          if (isSelected) {
            optionStyle = "border-2 border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-800";
            glowEffect = "0 0 10px rgba(79, 209, 197, 0.4)";
          }

          return (
            <motion.button
              key={idx}
              className={`p-4 rounded-md text-left hover:bg-teal-50 transition-colors ${optionStyle} relative overflow-hidden`}
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
                      isSelected ? "bg-teal-500 border-teal-600 text-white" : "bg-white border-gray-300 text-gray-600"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                </div>
                <span>{option}</span>
              </div>

              {/* Subtle hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
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
  let bgColor = "bg-white"; // Default unanswered
  let textColor = "text-gray-400";
  let borderColor = "border-gray-300";
  let glowEffect = "";
  let opacity = isNavigable ? "opacity-100" : "opacity-50";
  let cursor = isNavigable ? "cursor-pointer" : "cursor-not-allowed";

  if (step === currentStep) {
    bgColor = "bg-teal-500";
    textColor = "text-white";
    borderColor = "border-teal-600";
    glowEffect = "0 0 8px rgba(79, 209, 197, 0.7)";
    opacity = "opacity-100";
  } else if (isAnswered) {
    bgColor = "bg-teal-100";
    textColor = "text-teal-700";
    borderColor = "border-teal-400";
    glowEffect = "0 0 4px rgba(79, 209, 197, 0.4)";
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
    <div className="relative h-1 w-12 bg-gray-200 overflow-hidden rounded-full">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-400"
        initial={{ width: 0 }}
        animate={{ width: isCompleted ? "100%" : "0%" }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: "0 0 8px rgba(79, 209, 197, 0.4)",
        }}
      />
    </div>
  );
}

// Survey Complete Screen
function SurveyComplete({ answers, questions }: { answers: string[]; questions: Question[] }) {
  // Group answers by category
  const categories = [...new Set(questions.map((q) => q.category))];

  const getAnswersByCategory = (category: string) => {
    return questions.map((q, idx) => ({ question: q, answer: answers[idx] })).filter((item) => item.question.category === category);
  };

  return (
    <div className="py-12 px-8 text-center relative">
      <h1 className="text-3xl font-bold text-teal-700 mb-6" style={{ textShadow: "0 0 10px rgba(79, 209, 197, 0.3)" }}>
        Survey Complete
      </h1>

      <div className="mb-10">
        <div
          className="inline-flex items-center justify-center h-40 w-40 rounded-full bg-teal-50 border-4 border-teal-500 relative"
          style={{ boxShadow: "0 0 20px rgba(79, 209, 197, 0.3)" }}
        >
          <span className="text-5xl font-bold text-teal-700" style={{ textShadow: "0 0 10px rgba(79, 209, 197, 0.5)" }}>
            100%
          </span>

          {/* Circular progress */}
          <svg className="absolute inset-0" width="100%" height="100%" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="50%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#14b8a6" />
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

      <div className="text-xl text-teal-800 mb-6 p-3 rounded-lg bg-teal-50 inline-block" style={{ boxShadow: "0 0 15px rgba(79, 209, 197, 0.2)" }}>
        Thank you for completing this mental health assessment
      </div>

      <div className="text-lg text-gray-700 mb-8">Your responses have been recorded. This information will help us understand your needs better.</div>

      {/* Results Summary by Category */}
      <div className="max-w-2xl mx-auto space-y-8">
        {categories.map((category) => (
          <div
            key={category}
            className="bg-white rounded-lg p-6 border border-teal-100 overflow-hidden"
            style={{
              boxShadow: "0 0 20px rgba(79, 209, 197, 0.1)",
            }}
          >
            <h3 className="text-lg font-semibold text-teal-700 mb-4 text-left">{category}</h3>

            <div className="space-y-4">
              {getAnswersByCategory(category).map((item, idx) => (
                <div key={idx} className="p-3 rounded-md border border-gray-100 bg-gradient-to-r from-teal-50 to-cyan-50 text-left">
                  <p className="text-sm text-gray-700 font-medium">{item.question.question}</p>
                  <div className="mt-2 text-sm">
                    <span className="text-teal-700 font-medium">Your response: {item.answer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/dashboard" className="mx-2">
          <button
            className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center"
            style={{
              boxShadow: "0 0 15px rgba(79, 209, 197, 0.3)",
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
            className="bg-white border border-teal-500 text-teal-700 hover:bg-teal-50 px-6 py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center"
            style={{
              boxShadow: "0 0 15px rgba(79, 209, 197, 0.2)",
            }}
          >
            <span>Explore Resources</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
