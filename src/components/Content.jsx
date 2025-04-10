import { Schedule } from "./features/Schedule";

export function Content({ activeTab }) {
  return (
    <main className="flex-1 p-2 sm:p-4 md:p-6 ml-14 sm:ml-20">
      {/* {activeTab === "worldclock" && <WorldClock />}
      {activeTab === "alarm" && <Alarm />}
      {activeTab === "stopwatch" && <StopWatch />}
      {activeTab === "countdown" && <Countdown />}
      {activeTab === "notebook" && <Notebook />} */}
      {activeTab === "schedule" && <Schedule />}
    </main>
  );
}
