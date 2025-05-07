import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SettingsPanel from "@/components/settings-panel";

interface AvatarSectionProps {
  isListening: boolean;
  isSpeaking: boolean;
  statusText: string;
  toggleMicrophone: () => void;
  clearConversation: () => void;
}

export default function AvatarSection({
  isListening,
  isSpeaking,
  statusText,
  toggleMicrophone,
  clearConversation,
}: AvatarSectionProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="md:col-span-2 order-2 md:order-1">
      <Card className="shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="avatar-container relative mx-auto" data-state={isListening ? "listening" : isSpeaking ? "speaking" : "idle"}>
            {/* Main avatar visualization */}
            <div className="avatar-circle w-48 h-48 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden relative">
              {/* A friendly, modern AI assistant avatar with blue accent colors */}
              <img 
                src="https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80" 
                alt="AI Assistant Avatar" 
                className="w-40 h-40 object-cover rounded-full border-4 border-primary/20"
              />
              
              {/* Voice wave animation overlay */}
              <div className={`voice-waves absolute inset-0 transition-opacity duration-300 ${(isListening || isSpeaking) ? 'opacity-100' : 'opacity-0'}`}>
                <div className="wave-circle absolute inset-0 border-4 border-primary/40 rounded-full animate-ping"></div>
                <div className="wave-circle absolute inset-0 border-2 border-primary/30 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="status-indicator text-sm font-medium text-muted-foreground">
              <span>{statusText}</span>
            </div>
            
            {/* Microphone button */}
            <Button
              onClick={toggleMicrophone}
              size="lg"
              className="mt-6 bg-primary hover:bg-primary/90 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-md hover:shadow-lg transition-all duration-300"
              aria-label={isListening ? "Dừng ghi âm" : "Bắt đầu nói"}
            >
              <span className="material-icons text-2xl">
                {isListening ? "stop" : "mic"}
              </span>
            </Button>
            
            <div className="speech-controls mt-4 flex justify-center space-x-3">
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="ghost"
                size="sm"
                className="p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/10 transition-colors duration-200"
                aria-label="Cài đặt"
              >
                <span className="material-icons">settings</span>
              </Button>
              <Button
                onClick={clearConversation}
                variant="ghost"
                size="sm" 
                className="p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/10 transition-colors duration-200"
                aria-label="Xóa cuộc hội thoại"
              >
                <span className="material-icons">delete_outline</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
}
