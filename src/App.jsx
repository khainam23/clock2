import { useState } from 'react';
import { Header } from './components/Header';
import { Content } from './components/Content';

function App() {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 flex overflow-x-hidden">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <Content activeTab={activeTab} />
    </div>
  );
}

export default App;