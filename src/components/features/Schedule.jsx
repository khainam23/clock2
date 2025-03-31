import { useState } from "react";
import { CohereClientV2 } from "cohere-ai";

const cohere = new CohereClientV2({
    token: import.meta.env.VITE_COHERE_API_KEY,
});

export function Schedule() {
    const [chatHistory, setChatHistory] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChat = async () => {
        if (!userInput.trim()) return;
        setLoading(true);
        setError(null);
        
        try {
            const response = await cohere.chat({
                model: "command-a-03-2025",
                messages: [{ role: "user", content: userInput }],
            });
            
            const aiResponse = response?.message?.content?.[0]?.text || "Lỗi: Không nhận được phản hồi từ AI";
            setChatHistory(prev => [...prev, { user: userInput, ai: aiResponse }]);
        } catch (error) {
            console.error("Lỗi khi gọi API Cohere:", error);
            setError("Không thể kết nối với AI. Vui lòng thử lại sau.");
        }
        
        setUserInput("");
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-lg font-semibold text-center mb-4">Trò chuyện với AI</h2>
                <div className="max-h-96 overflow-auto border p-4 rounded-md bg-gray-50 space-y-2">
                    {chatHistory.map((chat, index) => (
                        <div key={index} className="p-2 border rounded-md">
                            <p className="font-semibold">Bạn:</p>
                            <p className="mb-2">{chat.user}</p>
                            <p className="font-semibold">AI:</p>
                            <p>{chat.ai}</p>
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
                        className="px-4 py-2 border rounded-md bg-green-500 text-white"
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
