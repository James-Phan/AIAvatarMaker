import { storage } from "./storage";

// Danh sách các câu trả lời mẫu
const predefinedResponses: Record<string, string> = {
  default: "Xin chào! Tôi là trợ lý ảo của Công ty ABC. Bạn có thể hỏi tôi về sản phẩm, dịch vụ của chúng tôi.",
  greeting: "Xin chào! Rất vui được gặp bạn. Tôi có thể giúp gì cho bạn hôm nay?",
  company: "Công ty ABC được thành lập vào năm 2010, chuyên cung cấp các giải pháp phần mềm quản lý bán hàng. Chúng tôi đã phục vụ hơn 1000 khách hàng trên toàn quốc.",
  products: "Sản phẩm chính của Công ty ABC gồm phần mềm POS (quản lý bán hàng), CRM (quản lý khách hàng), và hệ thống báo cáo tự động giúp doanh nghiệp phân tích dữ liệu kinh doanh.",
  warranty: "Công ty ABC cung cấp chính sách bảo hành 12 tháng cho tất cả các sản phẩm phần mềm của chúng tôi. Trong thời gian này, bạn sẽ được hỗ trợ kỹ thuật và cập nhật miễn phí.",
  support: "Đội ngũ hỗ trợ kỹ thuật của chúng tôi hoạt động 24/7 và có thể liên hệ qua hotline 1900-1234. Chúng tôi cam kết phản hồi mọi yêu cầu hỗ trợ trong vòng 4 giờ làm việc.",
  contact: "Bạn có thể liên hệ với Công ty ABC qua hotline 1900-1234, email support@abc.com, hoặc ghé thăm văn phòng của chúng tôi tại 123 Đường Lê Lợi, Quận 1, TP.HCM.",
  price: "Giá cả sản phẩm của chúng tôi phụ thuộc vào quy mô doanh nghiệp và nhu cầu sử dụng. Vui lòng liên hệ bộ phận kinh doanh qua số 1900-1234 để được tư vấn chi tiết và nhận báo giá phù hợp nhất.",
  demo: "Công ty ABC cung cấp phiên bản dùng thử miễn phí trong 14 ngày cho tất cả các sản phẩm. Bạn có thể đăng ký dùng thử trên website của chúng tôi hoặc liên hệ bộ phận kinh doanh."
};

export async function generateChatResponse(question: string): Promise<string> {
  try {
    // Lấy dữ liệu từ cơ sở kiến thức
    const knowledgeItems = await storage.getAllKnowledgeItems();
    
    // Tạo chuỗi dữ liệu từ tất cả các mục trong cơ sở kiến thức
    const knowledgeData = knowledgeItems.map(item => `- ${item.content}`).join('\n');
    
    // Chuyển câu hỏi về chữ thường để dễ so sánh
    const lowerQuestion = question.toLowerCase();
    
    // Tìm kiếm trong cơ sở kiến thức
    let foundInKnowledge = false;
    let bestMatch = "";
    
    for (const item of knowledgeItems) {
      const content = item.content.toLowerCase();
      if (content.includes(lowerQuestion) || 
          lowerQuestion.includes(content.substring(0, Math.min(content.length, 10)))) {
        foundInKnowledge = true;
        bestMatch = item.content;
        break;
      }
    }
    
    // Nếu tìm thấy trong cơ sở kiến thức, ưu tiên trả lời từ đó
    if (foundInKnowledge && bestMatch) {
      return `Dựa trên dữ liệu của chúng tôi: ${bestMatch}`;
    }
    
    // Kiểm tra xem câu hỏi có chứa từ khóa nào trong các chủ đề đã định nghĩa không
    if (lowerQuestion.includes("xin chào") || lowerQuestion.includes("chào") || lowerQuestion.includes("hello") || lowerQuestion.includes("hi")) {
      return predefinedResponses.greeting;
    } else if (lowerQuestion.includes("công ty") || lowerQuestion.includes("thành lập")) {
      return predefinedResponses.company;
    } else if (lowerQuestion.includes("sản phẩm") || lowerQuestion.includes("phần mềm") || lowerQuestion.includes("pos") || lowerQuestion.includes("crm")) {
      return predefinedResponses.products;
    } else if (lowerQuestion.includes("bảo hành")) {
      return predefinedResponses.warranty;
    } else if (lowerQuestion.includes("hỗ trợ") || lowerQuestion.includes("kỹ thuật")) {
      return predefinedResponses.support;
    } else if (lowerQuestion.includes("liên hệ") || lowerQuestion.includes("hotline") || lowerQuestion.includes("email")) {
      return predefinedResponses.contact;
    } else if (lowerQuestion.includes("giá") || lowerQuestion.includes("chi phí") || lowerQuestion.includes("báo giá")) {
      return predefinedResponses.price;
    } else if (lowerQuestion.includes("demo") || lowerQuestion.includes("dùng thử") || lowerQuestion.includes("thử nghiệm")) {
      return predefinedResponses.demo;
    }
    
    // Nếu không tìm thấy từ khóa nào phù hợp, trả về câu trả lời mặc định
    return "Xin lỗi, tôi không có thông tin về câu hỏi của bạn. Vui lòng hỏi về công ty ABC, sản phẩm, dịch vụ hỗ trợ hoặc chính sách bảo hành của chúng tôi.";
  } catch (error) {
    console.error("Error generating response:", error);
    return "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
  }
}
