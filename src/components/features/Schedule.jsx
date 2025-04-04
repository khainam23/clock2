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
    {
      id: "4",
      title: "Soát lỗi nội dung",
      start: "2025-04-01",
      priority: 2,
      duration: 30,
    },
    {
      id: "5",
      title: "Gửi mail cho giảng viên",
      start: "2025-04-01",
      priority: 1,
      duration: 10,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(null);

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

  const handleDateClick = (info) => {
    const selectedDate = info.dateStr;
    const tasksOnDate = events.filter((e) => e.start === selectedDate);

    Swal.fire({
      title: `📅 Ngày ${selectedDate}`,
      html: `
        <p style="margin-bottom: 10px;">Số công việc hiện tại: <strong>${tasksOnDate.length}</strong></p>
        <button id="view-tasks" class="swal2-confirm swal2-styled" style="margin-right: 5px; background-color: #3b82f6;">
          📋 Xem công việc
        </button>
        <button id="add-task" class="swal2-confirm swal2-styled" style="background-color: #10b981;">
          ➕ Thêm công việc
        </button>
      `,
      showConfirmButton: false,
      didOpen: () => {
        const viewBtn = document.getElementById("view-tasks");
        const addBtn = document.getElementById("add-task");

        if (viewBtn) {
          viewBtn.addEventListener("click", () => {
            Swal.close();
            if (tasksOnDate.length === 0) {
              Swal.fire("🎉 Không có công việc nào trong ngày này.");
            } else {
              Swal.fire({
                title: `📋 Công việc ngày ${selectedDate}`,
                html: `
                  <ul style="text-align: left; padding-left: 0;">
                    ${tasksOnDate
                      .map(
                        (task, idx) => `
                          <li style="margin-bottom: 8px; list-style: none;">
                            <strong>${idx + 1}.</strong> ${task.title}
                            <button id="edit-${task.id}" style="
                              float: right;
                              background: #2563eb;
                              color: white;
                              border: none;
                              border-radius: 4px;
                              padding: 2px 6px;
                              cursor: pointer;
                            ">✏️</button>
                          </li>
                        `
                      )
                      .join("")}
                  </ul>
                `,
                showCloseButton: true,
                showConfirmButton: false,
                didOpen: () => {
                  tasksOnDate.forEach((task) => {
                    const btn = document.getElementById(`edit-${task.id}`);
                    if (btn) {
                      btn.addEventListener("click", () => {
                        Swal.fire({
                          title: "Chỉnh sửa công việc",
                          input: "text",
                          inputValue: task.title,
                          showCancelButton: true,
                          confirmButtonText: "Lưu",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            setEvents((prev) =>
                              prev.map((e) =>
                                e.id === task.id
                                  ? { ...e, title: result.value }
                                  : e
                              )
                            );
                          }
                        });
                      });
                    }
                  });
                },
              });
            }
          });
        }

        if (addBtn) {
          addBtn.addEventListener("click", () => {
            Swal.fire({
              title: "➕ Thêm công việc",
              input: "text",
              inputLabel: "Nhập tên công việc",
              showCancelButton: true,
              confirmButtonText: "Thêm",
              cancelButtonText: "Hủy",
              preConfirm: (newTask) => {
                if (!newTask) {
                  Swal.showValidationMessage("Công việc không được để trống!");
                }
                return newTask;
              },
            }).then((result) => {
              if (result.isConfirmed) {
                const newEvent = {
                  id: String(Date.now()), // tạo ID mới
                  title: result.value,
                  start: selectedDate,
                  priority: 1,
                  duration: 30,
                };
                setEvents((prev) => [...prev, newEvent]);
                Swal.fire(
                  "✅ Đã thêm!",
                  `Công việc "${result.value}" đã được thêm vào.`,
                  "success"
                );
              }
            });
          });
        }
      },
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
      const parsedContent = marked.parse(aiResponse);
      setAiContent(parsedContent);
      setIsModalOpen(true);

      setHistory((prev) => [
        ...prev,
        {
          timestamp: new Date().toLocaleString(),
          content: parsedContent,
        },
      ]);
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
            dateClick={handleDateClick}
            dayMaxEvents={true} // 👈 Hiện +n nếu quá nhiều
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

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            🧠 Lịch sử phân tích
          </h3>
          {history.length === 0 ? (
            <p className="text-gray-500">Chưa có phân tích nào.</p>
          ) : (
            <ul className="space-y-2">
              {history.map((item, index) => (
                <li
                  key={index}
                  className="p-2 border rounded-md cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setAiContent(item.content);
                    setIsModalOpen(true);
                    setSelectedHistoryIndex(index);
                  }}
                >
                  🔹 Phân tích lúc {item.timestamp}
                </li>
              ))}
            </ul>
          )}
        </div>
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
