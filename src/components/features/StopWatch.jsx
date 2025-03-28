import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function StopWatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1000);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    setLaps([...laps, time]);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">⏱ Đồng hồ bấm giờ</h2>

      <div className="text-center">
        <div className="text-7xl font-mono mb-8 bg-gray-800 py-4 px-6 rounded-lg shadow-md">
          {formatTime(time)}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-5 rounded-full shadow-md transition-transform transform hover:scale-110 ${
              isRunning ? 'bg-red-600' : 'bg-green-600'
            } text-white flex items-center justify-center`}
          >
            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>
          <button
            onClick={handleReset}
            className="p-5 rounded-full bg-gray-600 text-white shadow-md transition-transform transform hover:scale-110 flex items-center justify-center"
          >
            <RotateCcw className="w-8 h-8" />
          </button>
        </div>

        {isRunning && (
          <button
            onClick={handleLap}
            className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition"
          >
            📌 Lưu vòng
          </button>
        )}

        {laps.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">🏁 Vòng đua</h3>
            <div className="space-y-2">
              {laps.map((lap, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg shadow-md p-3 flex justify-between items-center"
                >
                  <span className="text-gray-300">Vòng {index + 1}</span>
                  <span className="font-mono text-white text-lg">{formatTime(lap)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}