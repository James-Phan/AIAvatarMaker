import { Card, CardContent } from "@/components/ui/card";

export default function InfoCards() {
  return (
    <div className="grid md:grid-cols-3 gap-4 mt-8">
      <Card className="bg-surface rounded-lg shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center mb-2 text-[#34A853]">
            <span className="material-icons mr-2">info</span>
            <h3 className="font-medium">Về Công ty ABC</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Thành lập năm 2010, chuyên cung cấp phần mềm quản lý bán hàng với các sản phẩm POS, CRM, và báo cáo tự động.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-surface rounded-lg shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center mb-2 text-[#34A853]">
            <span className="material-icons mr-2">support_agent</span>
            <h3 className="font-medium">Hỗ trợ kỹ thuật</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Chúng tôi cung cấp hỗ trợ kỹ thuật 24/7 qua hotline 1900-1234 và chính sách bảo hành 12 tháng.
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-surface rounded-lg shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center mb-2 text-[#34A853]">
            <span className="material-icons mr-2">tips_and_updates</span>
            <h3 className="font-medium">Mẹo sử dụng</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Nói rõ ràng và ngắn gọn. Bạn có thể hỏi về sản phẩm, dịch vụ hoặc bất kỳ thông tin nào khác.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
