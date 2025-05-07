import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Dữ liệu nội bộ mẫu
const internalData = `
- Công ty ABC thành lập năm 2010, chuyên cung cấp phần mềm quản lý bán hàng.
- Sản phẩm chính gồm phần mềm POS, CRM, và báo cáo tự động.
- Chính sách bảo hành: 12 tháng với mọi sản phẩm.
- Hỗ trợ kỹ thuật 24/7 qua hotline 1900-1234.
`;

export async function generateChatResponse(question: string): Promise<string> {
  try {
    const prompt = `
    Bạn là trợ lý ảo thông minh, thân thiện, giúp trả lời các câu hỏi dựa trên dữ liệu nội bộ sau đây và kiến thức chung trên internet.

    Dữ liệu nội bộ:
    ${internalData}

    Khi trả lời, bạn hãy ưu tiên sử dụng dữ liệu nội bộ nếu câu hỏi liên quan, nếu không, hãy trả lời dựa trên kiến thức chung.

    Hãy trả lời câu hỏi sau đây của người dùng một cách ngắn gọn, dễ hiểu và lịch sự:

    ${question}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using the latest model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate response from OpenAI");
  }
}
