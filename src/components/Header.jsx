import {
  Globe2,
  AlarmClock,
  Timer,
  Clock,
  Notebook,
  Calendar,
} from "lucide-react";

const tabs = [
  { id: "worldclock", label: "Giờ quốc tế", icon: Globe2 },
  { id: "alarm", label: "Báo thức", icon: AlarmClock },
  { id: "stopwatch", label: "Đồng hồ bấm giờ", icon: Clock },
  { id: "countdown", label: "Đếm ngược", icon: Timer },
  { id: "notebook", label: "Ghi chú", icon: Notebook },
  { id: "schedule", label: "Lập lịch", icon: Calendar },
];

export function Header({ activeTab, setActiveTab }) {
  return (
    <header className="fixed left-0 top-0 h-full bg-gradient-to-r from-gray-900 to-gray-700 shadow-lg transition-all duration-300 ease-in-out group">
      <div className="relative w-20 group-hover:w-56 min-h-screen p-3 flex flex-col space-y-2 transition-all duration-300 ease-in-out overflow-hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 text-white ${
                activeTab === tab.id
                  ? "bg-blue-500 shadow-md scale-105"
                  : "hover:bg-gray-800 hover:scale-105"
              }`}
            >
              <Icon className="w-6 h-6 flex-shrink-0 text-gray-300 transition-all duration-300" />
              <span className="ml-4 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
