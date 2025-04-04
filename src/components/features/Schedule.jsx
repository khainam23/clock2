import { useState } from "react";
import { CohereClientV2 } from "cohere-ai";
import Swal from "sweetalert2";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { marked } from "marked";
import ModalAnalysis from "../ModalAnalysis.jsx";

const cohere = new CohereClientV2({
  token: import.meta.env.VITE_COHERE_API_KEY,
});

export function Schedule() {
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
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState("");

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
    try {
      const response = await cohere.chat({
        model: "command-a-03-2025",
        messages: [
          {
            role: "user",
            content: `Đây là lịch trình: ${JSON.stringify(events)}. 
                      Hãy đánh giá mức độ quan trọng, dự đoán thời gian hoàn thành và đề xuất cách sắp xếp hợp lý.`,
          },
        ],
      });

      const aiResponse =
        response?.message?.content?.[0]?.text || "Không có phản hồi từ AI.";
      setAiContent(marked.parse(aiResponse));
      setIsModalOpen(true); // Hiện modal
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: "Không thể kết nối với AI.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-6">
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
          className="mt-6 px-4 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600"
          onClick={evaluateTasks}
          disabled={loading}
        >
          {loading ? "Đang phân tích..." : "Phân tích lịch trình bằng AI"}
        </button>
      </div>

      {/* Modal phân tích AI */}
      <ModalAnalysis
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        aiContent={aiContent}
      />
    </div>
  );
}
