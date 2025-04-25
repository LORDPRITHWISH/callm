"use client";

import ExamNotesSummary from "@/components/ExamNotesSummary";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import MultiLoader from "@/components/loaders/MultiLoader";

export default function ConceptNotesPage() {
  const [conceptsData, setconceptsData] = useState(null);
  const [Loading, setLoading] = useState(true);

  const { id } = useParams();
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const formData = new FormData();
        if (id) {
          formData.append("id", id.toString());
        }

        const res = await axios.post("/api/summary", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });


        console.log("data is ", res.data.summary);
        setconceptsData(res.data.summary);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch Summary", err);
      }
    };

    if (id) fetchSummary();
  }, [id]);

  return (
    <div className="min-h-screen">
      {Loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <MultiLoader />
        </div>
      ) : (
        conceptsData &&
        conceptsData.summary.length > 0 && (
          <main className="container mx-auto py-8 px-4">
            <ExamNotesSummary data={conceptsData} />
          </main>
        )
      )}
    </div>
  );
}
