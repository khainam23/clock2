import { useState } from "react";
import { CohereClientV2 } from "cohere-ai";
import ReactMarkdown from "react-markdown";
import Swal from "sweetalert2";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { marked } from "marked";

const cohere = new CohereClientV2({
  token: import.meta.env.VITE_COHERE_API_KEY,
});

export function Schedule() {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Họp nhóm dự án",
      start: "2025-04-01",
      priority: 3,
      duration: 60,
    },
    {
      id: "2",
      title: "Hoàn thành báo cáo",
      start: "2025-04-02",
      priority: 5,
      duration: 120,
    },
    {
      id: "3",
      title: "Thuyết trình kết quả",
      start: "2025-04-03",
      priority: 4,
      duration: 90,
    },
  ]);

  const handleChat = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await cohere.chat({
        model: "command-a-03-2025",
        messages: [{ role: "user", content: userInput }],
      });

      const aiResponse =
        response?.message?.content?.[0]?.text ||
        "Lỗi: Không nhận được phản hồi từ AI";
      setChatHistory((prev) => [...prev, { user: userInput, ai: aiResponse }]);
    } catch (error) {
      console.error("Lỗi khi gọi API Cohere:", error);
      setError("Không thể kết nối với AI. Vui lòng thử lại sau.");
    }

    setUserInput("");
    setLoading(false);
  };

  const handleEventClick = (clickInfo) => {
    Swal.fire({
      title: "Chỉnh sửa công việc",
      input: "text",
      inputValue: clickInfo.event.title,
      showCancelButton: true,
      confirmButtonText: "Lưu",
      cancelButtonText: "Hủy",
      preConfirm: (newTitle) => {
        if (!newTitle) {
          Swal.showValidationMessage("Nội dung công việc không được để trống!");
        }
        return newTitle;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        clickInfo.event.setProp("title", result.value);
      }
    });
  };

  const evaluateTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const chatTasks = chatHistory.map((chat) => chat.user).join("; ");
      const response = await cohere.chat({
        model: "command-a-03-2025",
        messages: [
          {
            role: "user",
            content: `Đây là lịch trình: ${JSON.stringify(events)}. 
                    Ngoài ra, đây là các công việc từ đoạn chat: ${chatTasks}. 
                    Hãy đánh giá mức độ quan trọng, dự đoán thời gian hoàn thành và đề xuất cách sắp xếp hợp lý. 
                    Đưa ra danh sách các công việc cần ưu tiên trước và những công việc có thể trì hoãn.`,
          },
        ],
      });

      const aiResponse =
        response?.message?.content?.[0]?.text ||
        "Lỗi: Không nhận được phản hồi từ AI";
      Swal.fire({
        title: "Gợi ý từ AI",
        html: marked.parse(aiResponse), // Chuyển đổi Markdown thành HTML
        icon: "info",
        preLine: true,
      });
    } catch (error) {
      setError("Lỗi kết nối với AI. Vui lòng thử lại.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 pl-20 gap-6">
      <div className="w-1/2 bg-white shadow-lg rounded-xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
          📅 Lịch trình
        </h2>
        <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            editable={true}
            selectable={true}
            eventClick={handleEventClick}
            height="auto"
            className="rounded-md shadow-md"
          />
        </div>
        <button
          className="px-4 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600 mt-4"
          onClick={evaluateTasks}
          disabled={loading}
        >
          {loading ? "Đang phân tích..." : "Phân tích lịch trình"}
        </button>
      </div>
      <div className="w-1/2 bg-white shadow-lg rounded-xl p-6 flex flex-col">
        <h2 className="text-xl font-bold text-center mb-4">
          Trò chuyện với AI
        </h2>
        <div className="flex-1 max-h-96 overflow-auto border p-4 rounded-md bg-gray-50 space-y-2">
          {chatHistory.map((chat, index) => (
            <div key={index} className="p-2 border rounded-md bg-white">
              <p className="font-semibold">Bạn:</p>
              <p className="mb-2">{chat.user}</p>
              <p className="font-semibold">AI:</p>
              <ReactMarkdown>{chat.ai}</ReactMarkdown>
            </div>
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={loading}
          />
          <button
            className="px-4 py-2 border rounded-md bg-green-500 text-white hover:bg-green-600"
            onClick={handleChat}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Hỏi AI"}
          </button>
        </div>
      </div>
    </div>
  );
}
