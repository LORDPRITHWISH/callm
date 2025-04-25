"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import TurnCards from "@/components/TurnCards";
import MultiLoader from "@/components/loaders/MultiLoader";

export default function Home() {
  const [spaceCards, setSpaceCards] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const formData = new FormData();
        if (id) {
          formData.append("id", id.toString());
        }

        const res = await axios.post("/api/flashcard", formData, {
          withCredentials: true,
        });
        setSpaceCards(res.data.flashcard);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch flashcards", err);
        setLoading(false);
      }
    };

    if (id) fetchCards();
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-center items-center">
      <div className="flex flex-col items-center w-full bg-transparent text-white font-sans mt-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to NoteCard</h1>
        <i className="text-lg">Memorize only bullet points!</i>
      </div>
      {spaceCards.length > 0 ? (
        <TurnCards cardData={spaceCards} />
      ) : (
        // <p>woww</p>
        <MultiLoader />
      )}
    </div>
  );
}
