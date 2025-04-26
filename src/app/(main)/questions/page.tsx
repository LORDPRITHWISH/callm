"use client";
import { useEffect, useState } from "react";
import RPGQuiz from "@/components/RPGQuiz";
// import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  // const [qnaSolveDone, setQnaSolveDone] = useState(false);
  // const [qnaAnswers, setQnaAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const router = useRouter();

  // Dummy quiz data
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // const formData = new FormData();
        // if (id) {
        //   formData.append("id", id.toString());
        // }

        const res = await axios.get("/api/questions", {
          // withCredentials: true,
        });
        console.log("data is ", res.data);
        setLoading(false);
        setQuestions(res.data.questions);
        // setQnaSolveDone(res.data.isQnaSolveDone);
        // setQnaAnswers(res.data.qnaAnswers);
      } catch (err) {
        console.error("Failed to fetch questions", err);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const quizSubmissionHandler = async (answers: string[]) => {
    console.log("User answers:", answers);
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/questions/submit",
        { answers },
        {
          withCredentials: true,
        }
      );
      console.log("submission response:", response.data);
      toast.success("Initiation submitted successfully!");
    } catch (error) {
      console.error("Failed to submit quiz", error);
      toast.error("Quiz submission failed!");
    } finally {
      // setLoading(false);
      // router.push("/chat");
    }
  };
  // Simulate API call delay

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="App">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <h1 className="text-4xl font-bold">Loading...</h1>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full bg-transparent text-white font-sans">
            <h1 className="text-4xl font-bold mb-3 mt-8">Welcome to Callm</h1>
            <p className="text-lg mb-8">Explore the wonders of Knowledge!</p>
            {questions.length > 0 && (
              <RPGQuiz
                questions={questions}
                onComplete={(answers) => {
                  quizSubmissionHandler(answers);
                }}
                // previousanswers={qnaSolveDone ? qnaAnswers : undefined}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
