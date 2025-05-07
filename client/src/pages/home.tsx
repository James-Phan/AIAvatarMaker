import { useEffect } from "react";
import AvatarSection from "@/components/avatar-section";
import ConversationSection from "@/components/conversation-section";
import InfoCards from "@/components/info-cards";
import { useSpeech } from "@/hooks/use-speech";

export default function Home() {
  const speech = useSpeech();

  useEffect(() => {
    // Initialize speech recognition when component mounts
    speech.initialize();
    
    return () => {
      // Cleanup function
      speech.cleanup();
    };
  }, []);

  return (
    <div className="bg-background font-sans text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">AI Trợ Lý Ảo Avatar</h1>
          <p className="text-muted-foreground mb-4">Hỏi đáp thông minh bằng giọng nói</p>
        </header>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Avatar Section */}
          <AvatarSection
            isListening={speech.isListening}
            isSpeaking={speech.isSpeaking}
            statusText={speech.statusText}
            toggleMicrophone={speech.toggleMicrophone}
            clearConversation={speech.clearConversation}
          />

          {/* Conversation Section */}
          <ConversationSection
            conversation={speech.conversation}
            isListening={speech.isListening}
            isSpeaking={speech.isSpeaking}
            isProcessing={speech.isProcessing}
            interimText={speech.interimText}
            submitTextQuery={speech.submitTextQuery}
          />
        </div>
        
        {/* Information Cards */}
        <InfoCards />
        
        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2023 Công ty ABC - Trợ lý ảo AI</p>
        </footer>
      </div>
    </div>
  );
}
