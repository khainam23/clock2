import { useState } from "react";
import ReactMarkdown from "react-markdown";

export function Notebook() {
  const [notes, setNotes] = useState([
    { id: 1, name: "Ghi chú 1", category: "Công việc", description: "# Tiêu đề\nNội dung markdown..." },
  ]);

  const addNote = () => {
    setNotes([...notes, { id: Date.now(), name: "Ghi chú mới", category: "Khác", description: "# Tiêu đề\nNội dung markdown..." }]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const updateNote = (id, field, value) => {
    setNotes(notes.map(note => note.id === id ? { ...note, [field]: value } : note));
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <button onClick={addNote} className="px-4 py-2 bg-blue-500 text-white rounded mb-4">Thêm ghi chú</button>
      <div className="grid grid-cols-3 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="p-4 border rounded shadow bg-white relative">
            <button 
              onClick={() => deleteNote(note.id)} 
              className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition">
              ×
            </button>
            <input
              value={note.name}
              onChange={(e) => updateNote(note.id, "name", e.target.value)}
              placeholder="Tên ghi chú"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              value={note.category}
              onChange={(e) => updateNote(note.id, "category", e.target.value)}
              placeholder="Thể loại"
              className="mb-2 p-2 border rounded w-full"
            />
            <textarea
              value={note.description}
              onChange={(e) => updateNote(note.id, "description", e.target.value)}
              placeholder="Mô tả (Markdown hỗ trợ)"
              className="mb-2 p-2 border rounded w-full h-24"
            />
            <div className="border p-2 rounded bg-gray-100">
              <ReactMarkdown>{note.description}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}