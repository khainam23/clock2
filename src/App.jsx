import { useState } from 'react';
import { Header } from './components/Header';
import { Content } from './components/Content';

function App() {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <Content activeTab={activeTab} />
    </div>
  );
}

export default App;