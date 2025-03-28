import { useState } from "react";

export function Schedule() {
    const [view, setView] = useState("week");
    const [analysis, setAnalysis] = useState("");
    const [inputData, setInputData] = useState("");
    const [scheduleData, setScheduleData] = useState([]);

    const handleRunAlgorithm = () => {
        setAnalysis(`Phân tích dữ liệu: ${inputData}`);
        // Giả lập lịch trình dựa trên dữ liệu nhập vào
        const schedule = inputData.split("\n").map((entry, index) => {
            const [time, task] = entry.split(" - ");
            return { id: index, time: time || "", task: task || "Chưa xác định" };
        });
        setScheduleData(schedule);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="grid grid-rows-3 gap-4 p-6 bg-white shadow-lg rounded-lg w-full max-w-3xl">
                {/* Schedule Display */}
                <div className="row-span-1 p-4 border rounded-md">
                    <div className="mb-4 flex gap-2 justify-center">
                        {['week', 'month', 'year', 'custom'].map((option) => (
                            <button
                                key={option}
                                className={`px-4 py-2 border rounded-md ${view === option ? 'bg-gray-300' : ''}`}
                                onClick={() => setView(option)}
                            >
                                {option === 'week' ? 'Tuần' : option === 'month' ? 'Tháng' : option === 'year' ? 'Năm' : 'Tùy chỉnh'}
                            </button>
                        ))}
                    </div>
                    <p className="text-center font-semibold">Hiển thị lịch trình theo: {view}</p>
                    <div className="mt-2 space-y-2">
                        {scheduleData.length > 0 ? (
                            scheduleData.map(({ id, time, task }) => (
                                <div key={id} className="flex justify-between p-2 border rounded-md bg-gray-50">
                                    <span className="font-medium">{time}</span>
                                    <span>{task}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Không có lịch trình.</p>
                        )}
                    </div>
                </div>

                {/* Analysis Section */}
                <div className="row-span-1 p-4 border rounded-md text-center">
                    <h2 className="text-lg font-semibold mb-2">Phân tích lịch trình</h2>
                    <p>{analysis || "Không có dữ liệu phân tích."}</p>
                </div>

                {/* Input Section */}
                <div className="row-span-1 p-4 border rounded-md text-center">
                    <h2 className="text-lg font-semibold mb-2">Nhập dữ liệu</h2>
                    <textarea
                        className="w-full p-2 border rounded-md"
                        rows="4"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        placeholder="Nhập lịch trình theo định dạng: Giờ - Công việc (mỗi dòng một mục)"
                    />
                    <button className="mt-2 px-4 py-2 border rounded-md bg-blue-500 text-white" onClick={handleRunAlgorithm}>
                        Chạy thuật toán
                    </button>
                </div>
            </div>
        </div>
    );
}
