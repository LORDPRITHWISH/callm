"use client";

import { useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <Card className="w-full h-full max-w-6xl max-h-screen flex flex-col shadow-xl border-gray-700">
        <CardHeader className="p-4 border-b border-gray-700 flex flex-row justify-between items-center bg-gray-900 text-white">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-semibold text-lg">Callm Assistant</h3>
          </div>
        </CardHeader>

        <CardContent
          ref={chatContainerRef}
          className="flex-1 p-6 overflow-y-auto bg-black text-white"
        >
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-gray-400">
              <p className="text-lg font-medium">How do you feel today?</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-4 py-3 max-w-[80%] shadow-sm",
                      message.role === "user"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-700 text-white border border-gray-600"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 border-t border-gray-700 bg-gray-900">
          <form onSubmit={handleSubmit} className="flex w-full gap-3">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              className="flex-1 border-gray-600 bg-gray-800 text-white focus-visible:ring-gray-500"
            />
            <Button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
