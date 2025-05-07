import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trash } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Interface for Knowledge Item
interface KnowledgeItem {
  id: number;
  content: string;
  createdAt: string;
}

export default function KnowledgeManager() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Fetch knowledge items on component mount
  useEffect(() => {
    fetchKnowledgeItems();
  }, []);
  
  // Function to fetch all knowledge items
  const fetchKnowledgeItems = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("GET", "/api/knowledge");
      const data = await response.json();
      setKnowledgeItems(data);
    } catch (error) {
      console.error("Error fetching knowledge items:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu kiến thức.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to add a new knowledge item
  const addKnowledgeItem = async () => {
    if (!newItem.trim()) {
      toast({
        title: "Thông báo",
        description: "Vui lòng nhập nội dung kiến thức.",
        variant: "default"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/knowledge", { content: newItem });
      const data = await response.json();
      
      setKnowledgeItems([...knowledgeItems, data]);
      setNewItem("");
      
      toast({
        title: "Thành công",
        description: "Đã thêm mục kiến thức mới.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error adding knowledge item:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm mục kiến thức.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to clear all knowledge items
  const clearKnowledgeItems = async () => {
    if (knowledgeItems.length === 0) return;
    
    if (!window.confirm("Bạn có chắc chắn muốn xóa tất cả mục kiến thức?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      await apiRequest("DELETE", "/api/knowledge");
      
      setKnowledgeItems([]);
      
      toast({
        title: "Thành công",
        description: "Đã xóa tất cả mục kiến thức.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error clearing knowledge items:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa mục kiến thức.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Quản lý dữ liệu kiến thức
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Thêm mục kiến thức mới
          </label>
          <Textarea
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Nhập thông tin kiến thức mới tại đây..."
            className="w-full resize-none"
            disabled={isLoading}
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <Button 
              onClick={addKnowledgeItem} 
              disabled={isLoading || !newItem.trim()}
            >
              Thêm mục
            </Button>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium">Danh sách kiến thức ({knowledgeItems.length})</h3>
            {knowledgeItems.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={clearKnowledgeItems}
                disabled={isLoading}
              >
                <Trash className="h-4 w-4 mr-1" />
                Xóa tất cả
              </Button>
            )}
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto p-1">
            {knowledgeItems.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Chưa có mục kiến thức nào. Hãy thêm mục mới!
              </div>
            ) : (
              knowledgeItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3 border rounded-md bg-muted/30"
                >
                  <p>{item.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: {item.id} • Thêm vào: {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
        <p>Dữ liệu kiến thức này sẽ được ưu tiên sử dụng khi trợ lý AI trả lời câu hỏi.</p>
      </CardFooter>
    </Card>
  );
}