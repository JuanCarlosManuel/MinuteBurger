"use client";
import React, { useEffect, useState, useRef } from "react";

interface SpeechSearchProps {
  onSearchChange: (searchQuery: string) => void;
  placeholder?: string;
}

function SpeechSearch({ onSearchChange, placeholder = "Search menu items..." }: SpeechSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setSearchQuery(transcript.toLowerCase().trim());
          onSearchChange(transcript.toLowerCase().trim());
        } else {
          interimTranscript += transcript;
        }
      }
      setTranscript(interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setTranscript("");
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onSearchChange]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setSearchQuery("");
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearchChange("");
  };

  const handleManualSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    onSearchChange(query);
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3 text-yellow-400 text-sm mb-4">
        Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleManualSearch}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        />
        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            isListening
              ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
              : "bg-amber-600 hover:bg-amber-700 text-white"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 16.91c-.6 0-1.14.37-1.35.94C14.97 18.95 13.25 20 11 20c-1.25 0-2.45-.5-3.35-1.15-.42-.32-1.02-.27-1.36.1-.4.4-.45 1.03-.12 1.49.98 1.37 2.65 2.27 4.5 2.27 3.04 0 5.5-2.46 5.5-5.5 0-.04-.01-.07-.01-.11.17.66.82 1.15 1.52 1.15 1.1 0 2-1.34 2-3 0-1.66-.9-3-2-3z" />
          </svg>
          {isListening ? "Listening..." : "Speak"}
        </button>
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 rounded-lg font-semibold bg-gray-600 hover:bg-gray-700 text-white transition-all"
          >
            Clear
          </button>
        )}
      </div>
      {transcript && (
        <div className="text-sm text-gray-300 px-1">
          Listening: <span className="text-amber-400">{transcript}</span>
        </div>
      )}
    </div>
  );
}

export default SpeechSearch;
