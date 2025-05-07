import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

interface ConversationSectionProps {
  conversation: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  interimText: string;
  submitTextQuery: (text: string) => void;
}

export default function ConversationSection({
  conversation,
  isListening,
  isSpeaking,
  isProcessing,
  interimText,
  submitTextQuery,
}: ConversationSectionProps) {
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when conversation updates
  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSubmitText = () => {
    if (textInput.trim()) {
      submitTextQuery(textInput);
      setTextInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmitText();
    }
  };

  return (
    <div className="md:col-span-3 order-1 md:order-2">
      <Card className="shadow-lg">
        <CardContent className="p-6 h-[600px] flex flex-col">
          <h2 className="text-xl font-medium mb-4 flex items-center">
            <span className="material-icons mr-2 text-primary">chat</span>
            Cuộc hội thoại
          </h2>
          
          {/* Conversation history */}
          <div 
            ref={conversationContainerRef}
            className="flex-grow overflow-y-auto mb-4 space-y-4 pr-2"
          >
            {conversation.length === 0 ? (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="material-icons text-primary text-sm">smart_toy</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
                  <p className="text-sm text-foreground">
                    Xin chào! Tôi là trợ lý ảo AI của Công ty ABC. Bạn có thể hỏi tôi về sản phẩm, dịch vụ, hoặc bất kỳ thông tin nào khác. Hãy nhấn nút microphone và bắt đầu nói!
                  </p>
                </div>
              </div>
            ) : (
              conversation.map((message) => (
                <div key={message.id} className={`flex items-start ${message.sender === 'user' ? 'justify-end' : ''}`}>
                  {message.sender === 'ai' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="material-icons text-primary text-sm">smart_toy</span>
                    </div>
                  )}
                  <div className={`p-3 max-w-[85%] rounded-lg ${message.sender === 'user' ? 'bg-primary/10' : 'bg-gray-100'}`}>
                    <p className="text-sm text-foreground">
                      {message.text}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ml-3">
                      <span className="material-icons text-muted-foreground text-sm">person</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Current interaction feedback */}
          <div className="border-t border-gray-200 pt-4">
            {isListening && (
              <div className="text-sm text-muted-foreground mb-2 italic">
                Đang nghe: <span>{interimText || "..."}</span>
              </div>
            )}
            
            {isProcessing && (
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="mr-2 flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                </div>
                <span>Đang xử lý...</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span id="recognition-status"></span>
              </div>
              <div>
                <Button
                  onClick={() => setShowTextInput(!showTextInput)}
                  variant="ghost"
                  size="sm"
                  className="p-2 text-muted-foreground hover:text-primary rounded-full hover:bg-primary/10 transition-colors duration-200"
                  aria-label="Nhập bằng bàn phím"
                >
                  <span className="material-icons">keyboard</span>
                </Button>
              </div>
            </div>
            
            {/* Text input */}
            {showTextInput && (
              <div className="mt-3">
                <div className="flex">
                  <Input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nhập câu hỏi của bạn..."
                  />
                  <Button
                    onClick={handleSubmitText}
                    className="bg-primary text-white px-4 rounded-r-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center"
                  >
                    <span className="material-icons">send</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
