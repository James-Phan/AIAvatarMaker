import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [language, setLanguage] = useState("vi-VN");
  const [speechRate, setSpeechRate] = useState([1.0]);

  const handleSaveSettings = () => {
    // In a real implementation, this would save to localStorage or similar
    // and update speech synthesis settings
    localStorage.setItem("speechLanguage", language);
    localStorage.setItem("speechRate", speechRate[0].toString());
    onClose();
  };

  return (
    <Card className="bg-surface rounded-xl shadow-lg p-6 mt-4">
      <CardContent className="p-0">
        <h3 className="text-lg font-medium mb-4">Cài đặt</h3>
        
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1" htmlFor="voice-select">Giọng đọc:</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="voice-select" className="w-full">
              <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vi-VN">Tiếng Việt</SelectItem>
              <SelectItem value="en-US">Tiếng Anh (US)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-1" htmlFor="speed-range">Tốc độ đọc:</Label>
          <Slider
            id="speed-range"
            min={0.5}
            max={2}
            step={0.1}
            value={speechRate}
            onValueChange={setSpeechRate}
            className="w-full h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Chậm</span>
            <span>Bình thường</span>
            <span>Nhanh</span>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            Lưu cài đặt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
