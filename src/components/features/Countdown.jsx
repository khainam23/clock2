import { useState } from 'react';
import { Plus, Play, Pause, X } from 'lucide-react';

export function Countdown() {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);

  const addTask = (name, duration) => {
    const newTask = {
      id: Date.now(),
      name,
      duration: duration * 60, // Convert minutes to seconds
      timeLeft: duration * 60,
      isRunning: false,
    };
    setTasks([...tasks, newTask]);
    setShowAddTask(false);
  };

  const toggleTimer = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, isRunning: !task.isRunning };
      }
      return task;
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Đếm ngược</h2>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">{task.name}</h3>
                <div className="text-2xl font-mono mt-2">
                  {formatTime(task.timeLeft)}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleTimer(task.id)}
                  className={`p-2 rounded-full ${
                    task.isRunning ? 'bg-red-500' : 'bg-green-500'
                  } text-white`}
                >
                  {task.isRunning ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                  className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddTask ? (
        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              addTask(formData.get('name'), Number(formData.get('duration')));
            }}
            className="space-y-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Tên công việc"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="duration"
              placeholder="Thời gian (phút)"
              className="w-full p-2 border rounded"
              min="1"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Thêm
              </button>
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setShowAddTask(true)}
          className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm công việc
        </button>
      )}
    </div>
  );
}