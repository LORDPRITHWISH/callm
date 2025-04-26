"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Share2, Brain, Activity, ChevronDown, ChevronUp } from "lucide-react";

export default function ResultsScreen() {
  const [expandedSuggestions, setExpandedSuggestions] = useState({});
  const [assessmentData, setAssessmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API endpoint
        const response = await fetch("/api/summary");

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Assuming the API returns data in the same format as before
        // If needed, parse the data appropriately
        if (data && data.analysis && data.analysis.result) {
          try {
            const parsedData = JSON.parse(data.analysis.result);
            setAssessmentData(parsedData);
          } catch (parseError) {
            console.error("Error parsing API response:", parseError);
            setError("Failed to parse assessment data");
          }
        } else {
          setAssessmentData(data); // If the API already returns parsed data
        }
      } catch (fetchError) {
        console.error("Error fetching assessment data:", fetchError);
        setError("Failed to load assessment data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSuggestion = (index) => {
    setExpandedSuggestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const shareResults = async () => {
    if (!assessmentData) return;

    try {
      const shareText = `My personality assessment results:
      
Rating: ${assessmentData.rating}/10

Traits:
${assessmentData.traits.map((t) => `${t.trait}: ${t.score}/10`).join("\n")}

Analysis:
${assessmentData.analysis}

Suggestions:
${assessmentData.suggestions.join("\n")}`;

      if (navigator.share) {
        await navigator.share({
          title: "My Personality Assessment",
          text: shareText,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(shareText);
        alert("Results copied to clipboard!");
      }
    } catch (error) {
      console.error("Sharing failed", error);
      alert("Could not share results");
    }
  };

  const startChatSession = () => {
    router.push(
      `/chat?initialMessage=I just saw my assessment results and I'd like to talk about them...`
    );
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "#4AE3B5"; // neon cyan
    if (score >= 6) return "#FFD166"; // amber
    return "#FF6B8B"; // pinkish red
  };

  const getRatingDescription = (rating) => {
    if (rating >= 8)
      return "Excellent! Your neural patterns show optimal harmony.";
    if (rating >= 6)
      return "Satisfactory. Your cognitive framework has growth potential.";
    return "Let's enhance your neural programming together.";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400">Scanning neural patterns...</p>
        </div>
      </div>
    );
  }

  if (error || !assessmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md px-4">
          <div className="text-red-400 text-5xl mb-4">!</div>
          <h2 className="text-xl font-bold text-cyan-400 mb-2">
            Neural Interface Error
          </h2>
          <p className="text-gray-300 mb-4">
            {error || "Failed to process assessment data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-cyan-500 bg-opacity-20 text-cyan-400 py-2 px-4 rounded-full border border-cyan-500 hover:bg-opacity-30 transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { rating, traits, suggestions, analysis } = assessmentData;
  const ratingPercentage = Math.min(100, rating * 10);

  return (
    <div className="min-h-screen bg-gray-900 pb-24 relative">
      {/* Futuristic grid background */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#4AE3B5_0,_transparent_70%)]"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, #12121220 1px, transparent 1px), linear-gradient(to bottom, #12121220 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-cyan-400">
            Neural Interface Analysis
          </h1>
          <p className="text-gray-400 mt-2">Psychometric pattern V.25.04</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg border border-gray-700 backdrop-blur-sm bg-opacity-80">
          <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
            <Activity className="mr-2" size={20} />
            Consciousness Harmony Index
          </h2>
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold text-cyan-400 mb-2">
              {rating}
              <span className="text-2xl text-gray-400">/10</span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full mb-2 overflow-hidden">
              <div
                className="h-full rounded-full relative"
                style={{
                  width: `${ratingPercentage}%`,
                  backgroundColor: getScoreColor(rating),
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30"></div>
              </div>
            </div>
            <p className="text-gray-300 italic text-center mt-2">
              {getRatingDescription(rating)}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg border border-gray-700 backdrop-blur-sm bg-opacity-80">
          <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center">
            <Brain className="mr-2" size={20} />
            Neural Pattern Metrics
          </h2>
          {traits.map((trait, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-300">{trait.trait}</span>
                <span className="font-semibold text-cyan-400">
                  {trait.score}/10
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full relative"
                  style={{
                    width: `${trait.score * 10}%`,
                    backgroundColor: getScoreColor(trait.score),
                  }}
                >
                  <div
                    className="absolute inset-0 animate-pulse opacity-50"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                      animation: "shimmer 2s infinite",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {analysis && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg border border-gray-700 backdrop-blur-sm bg-opacity-80">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">
              Cognitive Analysis
            </h2>
            <p className="text-gray-300 leading-relaxed">{analysis}</p>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg border border-gray-700 backdrop-blur-sm bg-opacity-80">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-cyan-400">
              Neural Enhancement Protocols
            </h2>
            <button
              onClick={shareResults}
              className="bg-cyan-500 bg-opacity-20 text-cyan-400 py-2 px-4 rounded-full flex items-center border border-cyan-500 hover:bg-opacity-30 transition-all"
            >
              <Share2 size={16} className="mr-1" />
              <span className="text-sm">Share</span>
            </button>
          </div>

          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => toggleSuggestion(index)}
              className="mb-4 cursor-pointer"
            >
              <div className="flex items-center justify-between bg-gray-700 bg-opacity-50 p-3 rounded-lg hover:bg-opacity-70 transition-all">
                <div className="flex items-start flex-1 mr-2">
                  <span className="text-cyan-400 text-xl mr-2 mt-0.5">•</span>
                  <p
                    className={`text-gray-300 leading-relaxed ${
                      !expandedSuggestions[index] ? "line-clamp-2" : ""
                    }`}
                  >
                    {suggestion}
                  </p>
                </div>
                {expandedSuggestions[index] ? (
                  <ChevronUp
                    size={18}
                    className="text-cyan-400 flex-shrink-0"
                  />
                ) : (
                  <ChevronDown
                    size={18}
                    className="text-cyan-400 flex-shrink-0"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 px-4 z-50 ">
        <button
          onClick={() => router.push("/chat")}
          className="w-full max-w-2xl mx-auto bg-cyan-500 text-gray-900 py-4 px-6 rounded-lg font-semibold shadow-lg flex justify-center items-center hover:bg-cyan-400 transition-colors"
        >
          Start Chat session
        </button>
      </div>
    </div>
  );
}
