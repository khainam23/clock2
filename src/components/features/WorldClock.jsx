import { useState } from 'react';
import { Plus } from 'lucide-react';

const defaultTimezones = [
  { id: 1, name: 'Việt Nam', timezone: 'Asia/Ho_Chi_Minh' },
];

export function WorldClock() {
  const [timezones, setTimezones] = useState(defaultTimezones);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useState(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timezone) => {
    return new Date().toLocaleTimeString('vi-VN', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Giờ quốc tế</h2>
      
      <div className="space-y-4">
        {timezones.map((tz) => (
          <div key={tz.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{tz.name}</h3>
                <p className="text-gray-500">{tz.timezone}</p>
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {formatTime(tz.timezone)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}