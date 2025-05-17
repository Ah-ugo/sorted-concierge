"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X } from "lucide-react";

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Encode the message for WhatsApp URL
      const encodedMessage = encodeURIComponent(message);
      // Open WhatsApp with the pre-filled message
      window.open(
        `https://wa.me/2341234567890?text=${encodedMessage}`,
        "_blank"
      );
      setMessage("");
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* WhatsApp Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`whatsapp-button rounded-full w-14 h-14 flex items-center justify-center ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-80 z-50 shadow-lg">
          <div className="bg-green-500 text-white p-3 rounded-t-lg">
            <h3 className="font-bold">Sorted Concierge</h3>
            <p className="text-sm">We typically reply within minutes</p>
          </div>
          <CardContent className="p-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">
              <p className="text-sm">
                Hello! 👋 How can we assist you today? Send us a message and
                we'll get back to you as soon as possible.
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-2"
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-green-500 hover:bg-green-600"
              >
                <Send size={18} />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
