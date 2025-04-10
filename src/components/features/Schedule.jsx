import { useState, useEffect } from "react";
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
      backgroundColor: "#4CAF50",
      borderColor: "#4CAF50",
      description: "Thảo luận về tiến độ dự án",
    },
    {
      id: "2",
      title: "Hoàn thành báo cáo",
      start: "2025-04-02",
      priority: 5,
      duration: 120,
      backgroundColor: "#F44336",
      borderColor: "#F44336",
      description: "Nộp báo cáo tiến độ tháng",
    },
    {
      id: "3",
      title: "Thuyết trình kết quả",
      start: "2025-04-11",
      priority: 4,
      duration: 90,
      backgroundColor: "#2196F3",
      borderColor: "#2196F3",
      description: "Phỏng vấn ứng viên cho vị trí developer",
    },
    {
      id: "4",
      title: "Soát lỗi nội dung",
      start: "2025-04-10",
      priority: 2,
      duration: 30,
      backgroundColor: "#FF9800",
      borderColor: "#FF9800",
      description: "Kiểm tra lỗi chính tả và nội dung",
    },
    {
      id: "5",
      title: "Gửi mail cho giảng viên",
      start: "2025-04-15",
      priority: 1,
      duration: 10,
      backgroundColor: "#9C27B0",
      borderColor: "#9C27B0",
      description: "Gửi email xác nhận lịch hẹn",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [aiContent, setAiContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(null);

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    Swal.fire({
      title: event.title,
      html: `
        <div>
          <p><strong>Thời gian:</strong> ${
            event.start
              ? new Date(event.start).toLocaleString()
              : "Chưa xác định"
          }</p>
          <p><strong>Mô tả:</strong> ${
            event.extendedProps.description || "Không có mô tả"
          }</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Chỉnh sửa",
      cancelButtonText: "Đóng",
      showDenyButton: true,
      denyButtonText: "Xóa",
    }).then((result) => {
      if (result.isConfirmed) {
        editEvent(event);
      } else if (result.isDenied) {
        deleteEvent(event);
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
              html: `
                <input id="swal-title" class="swal2-input" placeholder="Tiêu đề công việc">
                <textarea id="swal-description" class="swal2-textarea" placeholder="Mô tả chi tiết"></textarea>
                <input id="swal-color" class="swal2-input" type="color" value="#4CAF50">
              `,
              focusConfirm: false,
              showCancelButton: true,
              confirmButtonText: "Thêm",
              cancelButtonText: "Hủy",
              preConfirm: () => {
                const title = document.getElementById("swal-title").value;
                const description =
                  document.getElementById("swal-description").value;
                const color = document.getElementById("swal-color").value;

                if (!title) {
                  Swal.showValidationMessage("Công việc không được để trống!");
                  return false;
                }

                return { title, description, color };
              },
            }).then((result) => {
              if (result.isConfirmed) {
                const { title, description, color } = result.value;
                const newEvent = {
                  id: String(Date.now()), // tạo ID mới
                  title,
                  start: selectedDate,
                  backgroundColor: color,
                  borderColor: color,
                  description,
                  priority: 1,
                  duration: 30,
                };
                setEvents((prev) => [...prev, newEvent]);
                Swal.fire(
                  "✅ Đã thêm!",
                  `Công việc "${title}" đã được thêm vào.`,
                  "success"
                );
              }
            });
          });
        }
      },
    });
  };

  const handleEventDrop = (dropInfo) => {
    const { event } = dropInfo;

    // Lấy thông tin về sự kiện được kéo
    const updatedEvent = {
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      backgroundColor: event.backgroundColor,
      borderColor: event.borderColor,
      description: event.extendedProps.description || "",
      priority: event.extendedProps.priority || 1,
      duration: event.extendedProps.duration || 30,
    };

    // Cập nhật danh sách sự kiện
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? updatedEvent : e))
    );

    // Hiển thị thông báo thành công
    Swal.fire({
      title: "Cập nhật thành công!",
      text: `Công việc "${event.title}" đã được di chuyển đến ${new Date(
        event.startStr
      ).toLocaleDateString()}`,
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const editEvent = (event) => {
    Swal.fire({
      title: "Chỉnh sửa công việc",
      html: `
        <input id="swal-title" class="swal2-input" placeholder="Tiêu đề công việc" value="${
          event.title
        }">
        <textarea id="swal-description" class="swal2-textarea" placeholder="Mô tả chi tiết">${
          event.extendedProps.description || ""
        }</textarea>
        <input id="swal-color" class="swal2-input" type="color" value="${
          event.backgroundColor
        }">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
      preConfirm: () => {
        const title = document.getElementById("swal-title").value;
        const description = document.getElementById("swal-description").value;
        const color = document.getElementById("swal-color").value;

        if (!title) {
          Swal.showValidationMessage("Vui lòng nhập tiêu đề công việc");
          return false;
        }

        return { title, description, color };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { title, description, color } = result.value;

        const updatedEvents = events.map((e) => {
          if (e.id === event.id) {
            return {
              ...e,
              title,
              backgroundColor: color,
              borderColor: color,
              description,
            };
          }
          return e;
        });

        setEvents(updatedEvents);
        Swal.fire("Thành công!", "Đã cập nhật công việc.", "success");
      }
    });
  };

  const deleteEvent = (event) => {
    Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa công việc "${event.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        const filteredEvents = events.filter((e) => e.id !== event.id);
        setEvents(filteredEvents);
        Swal.fire("Đã xóa!", "Công việc đã được xóa.", "success");
      }
    });
  };

  const evaluateTasks = async () => {
    setLoading(true);
    try {
      if (!events || events.length === 0) {
        Swal.fire(
          "Thông báo",
          "Chưa có dữ liệu công việc để đánh giá.",
          "info"
        );
        return;
      }

      const now = new Date();
      // reset giờ để so sánh chính xác
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const filteredEvents = events
        .filter((e) => {
          const eventDate = new Date(e.start);
          return eventDate >= today && eventDate <= endOfMonth;
        })
        .map(({ id, title, start, priority, duration, description }) => ({
          id,
          title,
          start,
          priority,
          duration,
          description,
        }));

      if (filteredEvents.length === 0) {
        Swal.fire(
          "Thông báo",
          "Không có công việc nào từ hôm nay đến cuối tháng.",
          "info"
        );
        return;
      }

      const response = await cohere.chat({
        model: "command-a-03-2025",
        messages: [
          {
            role: "user",
            content: `
            Đây là danh sách các công việc và lịch trình từ hôm nay đến cuối tháng: ${JSON.stringify(
              filteredEvents,
              null,
              2
            )}.
            Hãy:
            - Phân tích chi tiết từng công việc dựa vào **tên công việc** và **thời gian được lên lịch**.
            - Đánh giá **mức độ ưu tiên** của từng công việc (cao, trung bình, thấp).
            - Ước lượng **thời gian cần thiết** để hoàn thành mỗi công việc.
            - Gợi ý **các hành động cần làm** cụ thể cho từng đầu việc.
            - Đề xuất **lịch trình tối ưu**, sắp xếp lại công việc nếu cần (kể cả gợi ý di chuyển thời gian), sao cho phù hợp với độ ưu tiên và tránh dồn việc.
            
            Hãy trả lời theo định dạng:
            - Tên công việc
            - Ưu tiên: Cao / Trung bình / Thấp
            - Thời gian ước tính: ... phút / giờ
            - Việc cần làm: ...
            - Gợi ý lịch trình tối ưu: ...
            
            Nếu thấy lịch hiện tại quá tải, hãy gợi ý tôi điều chỉnh một cách hợp lý.
                  `,
          },
        ],
      });

      const aiResponse =
        response?.message?.content[0]?.text || "Không có phản hồi từ AI.";
      const parsedContent = marked.parse(aiResponse);
      setAiContent(parsedContent);
      setIsModalOpen(true);

      setHistory((prev) => [
        ...prev,
        {
          time: new Date().toLocaleString(),
          content: aiResponse,
        },
      ]);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu tới AI:", error);
      Swal.fire(
        "Lỗi",
        "Không thể kết nối với AI. Vui lòng thử lại sau.",
        "error"
      );
    } finally {
      setLoading(false);
    }
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
            eventDrop={handleEventDrop}
            eventResize={handleEventDrop}
            droppable={true}
            dayMaxEvents={true}
            height="auto"
            className="rounded-md shadow-md"
            locale="vi"
            buttonText={{
              today: "Hôm nay",
              month: "Tháng",
              week: "Tuần",
              day: "Ngày",
            }}
          />
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            <p>
              💡 <strong>Mẹo:</strong> Kéo và thả để di chuyển công việc giữa
              các ngày
            </p>
            <p>🔄 Nhấp vào công việc để xem chi tiết, chỉnh sửa hoặc xóa</p>
          </div>
          <button
            className="px-4 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600"
            onClick={evaluateTasks}
            disabled={loading}
          >
            {loading ? "Đang phân tích..." : "Phân tích lịch trình bằng AI"}
          </button>
        </div>

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
