"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { Mic, Play, Stars } from "lucide-react"
import VoiceVisualizer from "@/components/voice-visualizer"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use.mobile"

// Declare SpeechRecognition type
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
    SpeechSynthesis: any
  }
}

export default function Home() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const isMobile = useMobile()

  useEffect(() => {
    // Initialize speech recognition and synthesis
    if (typeof window !== "undefined") {
      if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("")

          setTranscript(transcript)
          handleInputChange({ target: { value: transcript } } as React.ChangeEvent<HTMLInputElement>)
        }

        recognitionRef.current.onend = () => {
          if (isListening) {
            recognitionRef.current?.start()
          }
        }
      }

      if ("speechSynthesis" in window) {
        synthRef.current = window.speechSynthesis
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [handleInputChange])

  // Speak the latest assistant message when it arrives
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.role === "assistant" && synthRef.current && !isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(lastMessage.content)
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      synthRef.current.speak(utterance)
    }
  }, [messages, isSpeaking])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)

      if (transcript) {
        handleSubmit(new Event("submit") as any)
        setTranscript("")
      }
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const playLastResponse = () => {
    if (synthRef.current && messages.length > 0) {
      const assistantMessages = messages.filter((m) => m.role === "assistant")
      if (assistantMessages.length > 0) {
        const lastAssistantMessage = assistantMessages[assistantMessages.length - 1]
        const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.content)
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        synthRef.current.speak(utterance)
      }
    }
  }

  const getStarted = () => {
    if (messages.length === 0) {
      handleInputChange({ target: { value: "Hello, I'd like to get started." } } as React.ChangeEvent<HTMLInputElement>)
      handleSubmit(new Event("submit") as any)
    }
  }

  const lastAssistantMessage =
    messages.filter((m) => m.role === "assistant").pop()?.content || "How can I help you today?"

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0f0f2d] p-4 relative overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Stars className="absolute top-10 left-10 text-blue-300 opacity-40" size={20} />
        <Stars className="absolute top-1/4 right-1/4 text-blue-300 opacity-30" size={16} />
        <Stars className="absolute bottom-1/3 left-1/3 text-blue-300 opacity-50" size={24} />
        <Stars className="absolute bottom-1/4 right-1/2 text-blue-300 opacity-40" size={18} />
      </div>

      {/* Info text for larger screens */}
      {!isMobile && (
        <div className="absolute left-8 top-1/3 max-w-xs text-blue-200 opacity-70 text-sm">
          <p>Enable your AI voice module to enjoy intuitive interactions and personalized support.</p>
          <p className="mt-2">Experience smarter communication and unlock new features with voice control.</p>
        </div>
      )}

      {/* Main chat interface */}
      <div className="w-full max-w-md bg-[#0c0c20]/80 backdrop-blur-md rounded-3xl overflow-hidden border border-[#2a2a4a] shadow-2xl relative">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-[#2a2a4a]">
          <div className="flex items-center">
            <div className="text-blue-400 font-semibold">hifai.ai</div>
          </div>
          <div className="h-1 w-1 rounded-full bg-blue-400"></div>
        </div>

        {/* Chat area */}
        <div className="p-6 min-h-[400px] flex flex-col items-center justify-between">
          {/* Greeting */}
          <div className="text-center mb-8">
            <p className="text-blue-400 text-sm mb-2">Hi John</p>
            <h1 className="text-blue-300 text-2xl font-light">{lastAssistantMessage}</h1>
          </div>

          {/* Voice button */}
          <div className="relative">
            <button
              onClick={toggleListening}
              className={`h-20 w-20 rounded-full flex items-center justify-center transition-all ${
                isListening ? "bg-blue-500 shadow-lg shadow-blue-500/50" : "bg-blue-400/20 border border-blue-400/50"
              }`}
            >
              <Mic className={`h-8 w-8 ${isListening ? "text-white" : "text-blue-400"}`} />
            </button>

            {isListening && <VoiceVisualizer />}
          </div>

          {/* Transcript */}
          {transcript && <div className="mt-4 text-blue-200 text-sm max-w-full overflow-hidden">{transcript}</div>}
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-center space-x-4">
          <Button
            onClick={playLastResponse}
            variant="outline"
            className="bg-transparent border border-blue-400/30 text-blue-400 hover:bg-blue-400/10 rounded-full px-6"
          >
            <Play className="mr-2 h-4 w-4" /> Play
          </Button>

          <Button onClick={getStarted} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6">
            Get started
          </Button>
        </div>
      </div>

      {/* Hidden form for AI SDK */}
      <form onSubmit={handleSubmit} className="hidden">
        <input value={input} onChange={handleInputChange} />
      </form>
    </main>
  )
}
