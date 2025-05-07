import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export function useSpeech() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("Sẵn sàng lắng nghe...");
  const [interimText, setInterimText] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  
  // References to Web Speech API objects
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  // Initialize speech recognition
  const initialize = useCallback(() => {
    if (isInitialized) return;
    
    try {
      // Check if browser supports speech recognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error("Trình duyệt không hỗ trợ nhận diện giọng nói");
      }
      
      // Create recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition
      recognitionInstance.lang = 'vi-VN';
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      
      // Set up event handlers
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setStatusText("Đang lắng nghe...");
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInterimText(transcript);
        
        // If this is a final result
        if (event.results[0].isFinal) {
          processUserInput(transcript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setStatusText(`Lỗi: ${event.error}`);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        if (!isSpeaking) {
          setStatusText("Sẵn sàng lắng nghe...");
        }
      };
      
      setRecognition(recognitionInstance);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      setStatusText("Không thể khởi tạo nhận diện giọng nói");
    }
  }, [isInitialized, isSpeaking]);
  
  // Process user input (either from speech or text)
  const processUserInput = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message to conversation
    const userMessage: Message = {
      id: uuidv4(),
      sender: "user",
      text: text
    };
    
    setConversation(prev => [...prev, userMessage]);
    setInterimText("");
    setIsProcessing(true);
    setStatusText("Đang xử lý...");
    
    try {
      // Send to backend
      const response = await apiRequest("POST", "/api/chat", { question: text });
      const data = await response.json();
      
      // Add AI response to conversation
      const aiMessage: Message = {
        id: uuidv4(),
        sender: "ai",
        text: data.answer
      };
      
      setConversation(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      
      // Speak the response
      speakText(data.answer);
    } catch (error) {
      console.error('Error processing query:', error);
      setIsProcessing(false);
      setStatusText("Sẵn sàng lắng nghe...");
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        sender: "ai",
        text: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại."
      };
      
      setConversation(prev => [...prev, errorMessage]);
    }
  };
  
  // Text to speech function
  const speakText = (text: string) => {
    if (!text) return;
    
    try {
      setIsSpeaking(true);
      setStatusText("Đang nói...");
      
      // Get stored speech settings
      const lang = localStorage.getItem("speechLanguage") || "vi-VN";
      const rate = parseFloat(localStorage.getItem("speechRate") || "1.0");
      
      // Break text into sentences for more natural animation
      const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
      let currentIndex = 0;
      
      const speakNextSentence = () => {
        if (currentIndex >= sentences.length) {
          setIsSpeaking(false);
          setStatusText("Sẵn sàng lắng nghe...");
          return;
        }
        
        const currentSentence = sentences[currentIndex] + ".";
        
        // Create and configure utterance
        const utterance = new SpeechSynthesisUtterance(currentSentence);
        utterance.lang = lang;
        utterance.rate = rate;
        
        // Try to find a matching voice
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(voice => voice.lang === lang);
        if (voice) {
          utterance.voice = voice;
        }
        
        // Update status with current sentence for better visual feedback
        setStatusText(`Đang nói: "${currentSentence.substring(0, 30)}${currentSentence.length > 30 ? '...' : ''}"`);
        
        // Handle speech events
        utterance.onstart = () => {
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          currentIndex++;
          speakNextSentence();
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error', event);
          setIsSpeaking(false);
          setStatusText("Sẵn sàng lắng nghe...");
        };
        
        // Start speaking
        window.speechSynthesis.speak(utterance);
      };
      
      // Start the speaking process
      speakNextSentence();
    } catch (error) {
      console.error('Error with speech synthesis:', error);
      setIsSpeaking(false);
      setStatusText("Sẵn sàng lắng nghe...");
    }
  };
  
  // Toggle microphone
  const toggleMicrophone = () => {
    if (!recognition) {
      initialize();
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      
      setInterimText("");
      recognition.start();
    }
  };
  
  // Clear conversation
  const clearConversation = () => {
    setConversation([]);
  };
  
  // Submit text query (from text input)
  const submitTextQuery = (text: string) => {
    if (text.trim()) {
      processUserInput(text);
    }
  };
  
  // Cleanup function for useEffect
  const cleanup = () => {
    if (recognition) {
      try {
        recognition.abort();
      } catch (e) {
        console.error('Error cleaning up speech recognition:', e);
      }
    }
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };
  
  // First-time load voices for speech synthesis
  useEffect(() => {
    if (window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length === 0) {
        const loadVoices = () => {
          window.speechSynthesis.getVoices();
          window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        };
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      }
    }
  }, []);

  return {
    initialize,
    cleanup,
    isListening,
    isSpeaking,
    isProcessing,
    statusText,
    interimText,
    conversation,
    toggleMicrophone,
    clearConversation,
    submitTextQuery,
    speakText
  };
}
