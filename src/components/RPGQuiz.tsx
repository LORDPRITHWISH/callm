"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Main Quiz Component
interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface RPGQuizProps {
  questions: Question[];
  previousanswers?: string[];
  onComplete?: (answers: string[]) => void;
}

export default function RPGQuiz({
  questions,
  previousanswers,
  onComplete = () => {},
}: RPGQuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<string[]>([]);
  const [direction, setDirection] = useState(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const totalSteps = questions.length;

  const getNextUnansweredQuestion = React.useCallback(() => {
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === undefined) {
        return i + 1;
      }
    }
    return currentStep;
  }, [answers, questions, currentStep]);

  useEffect(() => {
    if (previousanswers) {
      setAnswers(previousanswers);
      setCurrentStep(getNextUnansweredQuestion());
    }
  }, [previousanswers, getNextUnansweredQuestion]);

  // Calculate current score
  const score = answers.filter(
    (answer, index) => answer === questions[index].correctAnswer
  ).length;

  const handleAnswerSelect = (selectedAnswer: string) => {
    // Check if this question has already been answered
    if (answers[currentStep - 1] !== undefined) {
      return; // Don't allow changing previous answers
    }

    const newAnswers = [...answers];
    newAnswers[currentStep - 1] = selectedAnswer;
    setAnswers(newAnswers);

    setShowFeedback(true);

    // Wait to show feedback before advancing
    setTimeout(() => {
      setShowFeedback(false);
      if (currentStep < totalSteps) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsCompleted(true);
        onComplete(newAnswers);
      }
    }, 1800);
  };

  const handleStepChange = (step: number) => {
    if (step <= answers.length + 1 && step <= totalSteps) {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
    }
  };

  // Determine if we can navigate to a specific step
  const isStepNavigable = (step: number) => {
    return step <= answers.length + 1 && step !== currentStep;
  };

  // Check if current question is already answered (for review mode)
  const isCurrentQuestionAnswered = answers[currentStep - 1] !== undefined;

  // Go to next unanswered question
  const goToNextUnanswered = () => {
    const nextStep = getNextUnansweredQuestion();
    handleStepChange(nextStep);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center p-4 relative">
      {/* Main Quiz Container */}
      <motion.div
        className="mx-auto w-full max-w-3xl rounded-lg shadow-xl overflow-hidden bg-gray-950/90 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow:
            "0 0 25px rgba(99, 102, 241, 0.3), 0 0 5px rgba(79, 70, 229, 0.5)",
        }}
      >
        <div className="relative bg-gray-950/90 py-4 px-8 border-b border-indigo-800/80 z-10">
          <motion.div
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
          />

          <div className="flex items-center justify-center space-x-2">
            {questions.map((_, idx) => {
              const stepNum = idx + 1;
              const isAnswered = answers[idx] !== undefined;
              const isCorrect = answers[idx] === questions[idx].correctAnswer;

              return (
                <React.Fragment key={stepNum}>
                  <StepIndicator
                    step={stepNum}
                    currentStep={currentStep}
                    isAnswered={isAnswered}
                    isCorrect={isCorrect}
                    onClickStep={handleStepChange}
                    isNavigable={isStepNavigable(stepNum)}
                  />

                  {idx < questions.length - 1 && (
                    <ProgressConnector
                      isCompleted={stepNum < answers.length + 1}
                      isCorrect={isAnswered && isCorrect}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        {isCompleted ? (
          <CompleteScreen
            score={score}
            totalQuestions={totalSteps}
            answers={answers}
            questions={questions}
          />
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
                  showFeedback={showFeedback || isCurrentQuestionAnswered}
                  selectedAnswer={answers[currentStep - 1]}
                  isReviewMode={isCurrentQuestionAnswered && !showFeedback}
                  isDisabled={showFeedback || isCurrentQuestionAnswered}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Review Mode Banner with Continue Button - shows when viewing answered questions */}
        {isCurrentQuestionAnswered && !showFeedback && !isCompleted && (
          <div
            className="bg-gradient-to-r from-indigo-900/70 via-purple-900/70 to-indigo-900/70 border-t border-indigo-700/80 p-3 flex justify-between items-center z-50 relative"
            style={{ boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)" }}
          >
            <div className="flex items-center">
              <span className="text-yellow-300 text-xl inline-block mr-2">
                ★
              </span>
              <span className="text-indigo-200 font-medium">
                REVIEW MODE
                <span className="ml-2 text-indigo-200/80">
                  You cannot change your answer
                </span>
              </span>
            </div>
            <button
              onClick={goToNextUnanswered}
              className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <span>Continue Quest</span>
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
        <div className="bg-gray-950/90 border-t border-indigo-800/80 p-4 flex justify-between items-center z-10">
          <div className="text-indigo-400 font-mono">
            <span className="text-indigo-500">QUERY</span>: {currentStep} /{" "}
            {totalSteps}
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
          </div>

          <div className="text-indigo-400 font-mono">
            <span className="text-indigo-500">SCORE</span>: {score} /{" "}
            {answers.length}
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
  showFeedback: boolean;
  selectedAnswer: string | undefined;
  isDisabled: boolean;
  isReviewMode: boolean;
}

function Question({
  questionData,
  onAnswerSelect,
  questionNumber,
  showFeedback,
  selectedAnswer,
  isDisabled,
  isReviewMode,
}: QuestionProps) {
  const { question, options, correctAnswer } = questionData;

  return (
    <div className="space-y-6">
      <div className="relative pb-2 mb-8">
        <h2 className="text-xl font-bold text-indigo-300 mb-2">
          <span className="text-indigo-400">[{questionNumber}]</span> {question}
        </h2>
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-700"></div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === correctAnswer;
          let optionStyle =
            "border border-indigo-800 bg-gray-900 text-gray-200";
          let glowEffect = "";

          // When showing feedback or in review mode, highlight correct/incorrect
          if ((showFeedback || isReviewMode) && isSelected) {
            optionStyle = isCorrect
              ? "border-2 border-green-600 bg-gradient-to-br from-green-900/50 to-green-950 text-green-300"
              : "border-2 border-red-600 bg-gradient-to-br from-red-900/50 to-red-950 text-red-300";
            glowEffect = isCorrect
              ? "0 0 15px rgba(16, 185, 129, 0.5)"
              : "0 0 15px rgba(239, 68, 68, 0.5)";
          } else if ((showFeedback || isReviewMode) && isCorrect) {
            optionStyle =
              "border-2 border-green-600 bg-gradient-to-br from-green-900/50 to-green-950 text-green-300";
            glowEffect = "0 0 15px rgba(16, 185, 129, 0.5)";
          } else if (isSelected) {
            glowEffect = "0 0 10px rgba(99, 102, 241, 0.4)";
          }

          return (
            <motion.button
              key={idx}
              className={`p-4 rounded-md text-left hover:bg-gray-800 hover:border-indigo-500 transition-colors ${optionStyle} ${
                isDisabled && !isSelected && !isCorrect ? "opacity-70" : ""
              } relative overflow-hidden`}
              onClick={() => !isDisabled && onAnswerSelect(option)}
              disabled={isDisabled}
              whileHover={{ scale: isDisabled ? 1 : 1.01 }}
              style={{
                boxShadow: glowEffect,
              }}
            >
              <div className="flex items-center relative z-10">
                <div className="flex-shrink-0 mr-3">
                  <span
                    className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gray-800 border border-indigo-600 text-indigo-300"
                    style={{
                      boxShadow: "0 0 5px rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                </div>
                <span>{option}</span>

                {/* Show feedback icons */}
                {(showFeedback || isReviewMode) && isSelected && (
                  <motion.span
                    className="ml-auto"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {isCorrect ? (
                      <SuccessIcon className="h-6 w-6 text-green-500 drop-shadow-glow-green" />
                    ) : (
                      <FailIcon className="h-6 w-6 text-red-500 drop-shadow-glow-red" />
                    )}
                  </motion.span>
                )}

                {/* Always show correct answer in review mode */}
                {(showFeedback || isReviewMode) && !isSelected && isCorrect && (
                  <motion.span
                    className="ml-auto"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <SuccessIcon className="h-6 w-6 text-green-500 drop-shadow-glow-green" />
                  </motion.span>
                )}
              </div>

              {/* Subtle hover effect overlay */}
              {!isDisabled && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Answer legend in review mode */}
      {isReviewMode && (
        <motion.div
          className="mt-6 p-4 rounded bg-gray-800/80 border border-indigo-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            boxShadow: "0 0 15px rgba(99, 102, 241, 0.2)",
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-sm">
              <div
                className="w-4 h-4 mr-2 rounded-full bg-green-600"
                style={{ boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)" }}
              ></div>
              <span className="text-green-300">
                Correct Answer: {correctAnswer}
              </span>
            </div>
            {selectedAnswer !== correctAnswer && (
              <div className="flex items-center text-sm">
                <div
                  className="w-4 h-4 mr-2 rounded-full bg-red-600"
                  style={{ boxShadow: "0 0 8px rgba(239, 68, 68, 0.6)" }}
                ></div>
                <span className="text-red-300">
                  Your Answer: {selectedAnswer}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Step Indicator Component with simplified effects
function StepIndicator({
  step,
  currentStep,
  isAnswered,
  isCorrect,
  onClickStep,
  isNavigable,
}: {
  step: number;
  currentStep: number;
  isAnswered: boolean;
  isCorrect: boolean;
  onClickStep: (step: number) => void;
  isNavigable: boolean;
}) {
  let bgColor = "bg-gray-800"; // Default unanswered
  let textColor = "text-gray-400";
  let borderColor = "border-gray-700";
  let glowEffect = "";

  if (step === currentStep) {
    bgColor = "bg-indigo-900";
    textColor = "text-indigo-300";
    borderColor = "border-indigo-500";
    glowEffect = "0 0 8px rgba(99, 102, 241, 0.7)";
  } else if (isAnswered) {
    if (isCorrect) {
      bgColor = "bg-green-900";
      textColor = "text-green-300";
      borderColor = "border-green-600";
      glowEffect = "0 0 8px rgba(16, 185, 129, 0.6)";
    } else {
      bgColor = "bg-red-900";
      textColor = "text-red-300";
      borderColor = "border-red-600";
      glowEffect = "0 0 8px rgba(239, 68, 68, 0.6)";
    }
  }

  const handleClick = () => {
    if (isNavigable) {
      onClickStep(step);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-center h-8 w-8 rounded-full border-2 ${borderColor} ${bgColor} ${textColor} ${
        isNavigable
          ? "cursor-pointer"
          : step === currentStep
          ? "cursor-default"
          : "cursor-not-allowed opacity-70"
      }`}
      style={{ boxShadow: glowEffect }}
    >
      {isAnswered ? (
        isCorrect ? (
          <SuccessIcon className="h-4 w-4 drop-shadow-glow-green" />
        ) : (
          <FailIcon className="h-4 w-4 drop-shadow-glow-red" />
        )
      ) : (
        <span className="text-sm">{step}</span>
      )}
    </div>
  );
}

// Progress Connector with simplified animation
function ProgressConnector({
  isCompleted,
  isCorrect,
}: {
  isCompleted: boolean;
  isCorrect: boolean;
}) {
  return (
    <div className="relative h-1 w-12 bg-gray-800 overflow-hidden rounded-full">
      <motion.div
        className={`absolute inset-0 ${
          isCorrect
            ? "bg-gradient-to-r from-green-600 to-green-500"
            : "bg-gradient-to-r from-indigo-600 to-purple-600"
        }`}
        initial={{ width: 0 }}
        animate={{ width: isCompleted ? "100%" : "0%" }}
        transition={{ duration: 0.5 }}
        style={{
          boxShadow: isCorrect
            ? "0 0 8px rgba(16, 185, 129, 0.6)"
            : "0 0 8px rgba(99, 102, 241, 0.6)",
        }}
      />
    </div>
  );
}

// Simplified Completion Screen
function CompleteScreen({
  score,
  totalQuestions,
  answers,
  questions,
}: {
  score: number;
  totalQuestions: number;
  answers: string[];
  questions: Question[];
}) {
  const percentage = Math.round((score / totalQuestions) * 100);

  // Determine message based on score
  let message = "";
  let messageColor = "";
  let messageBg = "";
  let glowColor = "";

  if (percentage >= 90) {
    message = "Legendary Explorer! The cosmos bends to your will!";
    messageColor = "text-indigo-300";
    messageBg = "bg-indigo-900/30";
    glowColor = "0 0 15px rgba(99, 102, 241, 0.6)";
  } else if (percentage >= 70) {
    message = "Skilled Voyager! The stars guide your path.";
    messageColor = "text-blue-300";
    messageBg = "bg-blue-900/30";
    glowColor = "0 0 15px rgba(59, 130, 246, 0.6)";
  } else if (percentage >= 50) {
    message = "Aspiring Navigator. Keep charting your course.";
    messageColor = "text-blue-300";
    messageBg = "bg-blue-900/30";
    glowColor = "0 0 15px rgba(59, 130, 246, 0.5)";
  } else {
    message = "Space Cadet. The universe has more to teach you.";
    messageColor = "text-gray-300";
    messageBg = "bg-gray-800/30";
    glowColor = "0 0 15px rgba(156, 163, 175, 0.4)";
  }

  return (
    <div className="py-12 px-8 text-center relative">
      <h1
        className="text-3xl font-bold text-indigo-300 mb-6"
        style={{ textShadow: "0 0 10px rgba(99, 102, 241, 0.5)" }}
      >
        Quest Complete!
      </h1>

      <div className="mb-10">
        <div
          className="inline-flex items-center justify-center h-40 w-40 rounded-full bg-gray-800/80 border-4 border-indigo-600 relative"
          style={{ boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)" }}
        >
          <span
            className="text-5xl font-bold text-indigo-300"
            style={{ textShadow: "0 0 10px rgba(99, 102, 241, 0.7)" }}
          >
            {percentage}%
          </span>

          {/* Circular progress */}
          <svg
            className="absolute inset-0"
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient
                id="circleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#4F46E5" />
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
              strokeDasharray={`${percentage * 2.89}, 289`}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "center",
              }}
            />
          </svg>
        </div>
      </div>

      <div
        className={`text-xl ${messageColor} mb-8 p-3 rounded-lg ${messageBg} inline-block`}
        style={{ boxShadow: glowColor }}
      >
        {message}
      </div>

      <div className="text-lg text-indigo-200 mb-8">
        You answered
        <span
          className="text-indigo-400 font-bold mx-1"
          style={{ textShadow: "0 0 5px rgba(99, 102, 241, 0.6)" }}
        >
          {score}
        </span>
        out of
        <span
          className="text-indigo-400 font-bold mx-1"
          style={{ textShadow: "0 0 5px rgba(99, 102, 241, 0.6)" }}
        >
          {totalQuestions}
        </span>
        questions correctly.
      </div>

      {/* Results Summary Table with simplified styling */}
      <div
        className="max-w-lg mx-auto mt-8 bg-gray-800/80 rounded-lg p-4 border border-indigo-700/50 overflow-hidden"
        style={{
          boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)",
          background:
            "linear-gradient(to bottom right, rgba(49, 46, 129, 0.3), rgba(30, 27, 75, 0.8))",
        }}
      >
        <div className="relative">
          <div className="relative z-10">
            <h3
              className="text-lg font-semibold text-indigo-300 mb-4 flex items-center justify-center"
              style={{ textShadow: "0 0 8px rgba(99, 102, 241, 0.6)" }}
            >
              Quest Log
            </h3>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const isCorrect = answers[idx] === q.correctAnswer;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-md border ${
                      isCorrect
                        ? "border-green-600/50 bg-gradient-to-r from-green-900/30 to-green-950/60"
                        : "border-red-600/50 bg-gradient-to-r from-red-900/30 to-red-950/60"
                    }`}
                    style={{
                      boxShadow: isCorrect
                        ? "0 0 10px rgba(16, 185, 129, 0.3)"
                        : "0 0 10px rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {isCorrect ? (
                          <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                            <SuccessIcon className="h-3 w-3 text-green-100" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                            <FailIcon className="h-3 w-3 text-red-100" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-gray-300 font-medium">
                          {q.question}
                        </p>
                        <div className="mt-1 flex justify-between text-xs">
                          <span
                            className={
                              isCorrect ? "text-green-300" : "text-red-300"
                            }
                            style={{
                              textShadow: isCorrect
                                ? "0 0 5px rgba(16, 185, 129, 0.5)"
                                : "0 0 5px rgba(239, 68, 68, 0.5)",
                            }}
                          >
                            Your answer: {answers[idx]}
                          </span>
                          {!isCorrect && (
                            <span
                              className="text-green-300"
                              style={{
                                textShadow: "0 0 5px rgba(16, 185, 129, 0.5)",
                              }}
                            >
                              Correct: {q.correctAnswer}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Try Again Button with simpler styling */}
      <Link href="/home" className="mt-10">
        <button
          className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center mx-auto"
          style={{
            boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
          }}
        >
          <span>Embark Again</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </Link>
    </div>
  );
}

// Success Icon
function SuccessIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      style={{ filter: "drop-shadow(0 0 2px rgba(16, 185, 129, 0.7))" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

// Fail Icon
function FailIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      style={{ filter: "drop-shadow(0 0 2px rgba(239, 68, 68, 0.7))" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
