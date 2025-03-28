import { useState } from 'react';
import { Plus, Bell, Trash2 } from 'lucide-react';

export function Alarm() {
  const [alarms, setAlarms] = useState([]);
  const [showAddAlarm, setShowAddAlarm] = useState(false);

  const addAlarm = (time) => {
    const newAlarm = {
      id: Date.now(),
      time,
      active: true,
    };
    setAlarms([...alarms, newAlarm]);
    setShowAddAlarm(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Báo thức</h2>

      <div className="space-y-4">
        {alarms.map((alarm) => (
          <div key={alarm.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-xl">{alarm.time}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  className="text-red-500 hover:text-red-600"
                  onClick={() => setAlarms(alarms.filter(a => a.id !== alarm.id))}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={alarm.active}
                    onChange={() => {
                      setAlarms(alarms.map(a => 
                        a.id === alarm.id ? {...a, active: !a.active} : a
                      ));
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddAlarm ? (
        <div className="mt-4 bg-white rounded-lg shadow p-4">
          <input
            type="time"
            className="w-full p-2 border rounded"
            onChange={(e) => addAlarm(e.target.value)}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowAddAlarm(true)}
          className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm báo thức
        </button>
      )}
    </div>
  );
}