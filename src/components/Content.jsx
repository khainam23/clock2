import { WorldClock } from './features/WorldClock';
import { Alarm } from './features/Alarm';
import { StopWatch } from './features/StopWatch';
import { Countdown } from './features/Countdown';

export function Content({ activeTab }) {
  return (
    <main className="flex-1 p-6">
      {activeTab === 'worldclock' && <WorldClock />}
      {activeTab === 'alarm' && <Alarm />}
      {activeTab === 'stopwatch' && <StopWatch />}
      {activeTab === 'countdown' && <Countdown />}
    </main>
  );
}