"use client";
import { useState } from "react";
import RPGQuiz from "@/components/RPGQuiz";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Home() {
  const [qnaSolveDone, setQnaSolveDone] = useState(false);
  const [qnaAnswers, setQnaAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dummy quiz data
  const dummyQuestions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: "Mars",
    },
    {
      question: "What is the largest mammal in the world?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      correctAnswer: "Blue Whale",
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: "William Shakespeare",
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gl", "Au", "Ag"],
      correctAnswer: "Au",
    },
  ];

  const quizSubmissionHandler = async (answers) => {
    // Simulate API call delay
    setLoading(true);
    setTimeout(() => {
      console.log("Quiz submitted with answers:", answers);
      toast.success("Quiz submitted successfully!");
      setQnaSolveDone(true);
      setQnaAnswers(answers);
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="App">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <h1 className="text-4xl font-bold">Loading...</h1>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full bg-transparent text-white font-sans">
            <h1 className="text-4xl font-bold mb-3 mt-8">Welcome to TryHard</h1>
            <p className="text-lg mb-8">Explore the wonders of Knowledge!</p>
            {dummyQuestions.length > 0 && (
              <RPGQuiz
                questions={dummyQuestions}
                onComplete={(answers) => {
                  quizSubmissionHandler(answers);
                }}
                previousanswers={qnaSolveDone ? qnaAnswers : undefined}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
