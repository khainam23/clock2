import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ReactMarkdown from "react-markdown";

export function Notebook() {
  const [tabs, setTabs] = useState([
    { name: "Ghi chú 1", category: "Công việc", description: "# Tiêu đề\nNội dung markdown..." },
  ]);
  const [activeTab, setActiveTab] = useState(0);

  const addTab = () => {
    setTabs([...tabs, { name: "Ghi chú mới", category: "Khác", description: "" }]);
    setActiveTab(tabs.length);
  };

  const updateTab = (index, field, value) => {
    const newTabs = [...tabs];
    newTabs[index][field] = value;
    setTabs(newTabs);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
        <TabList className="flex space-x-2 border-b pb-2">
          {tabs.map((tab, index) => (
            <Tab key={index} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">{tab.name}</Tab>
          ))}
          <button onClick={addTab} className="px-4 py-2 bg-blue-500 text-white rounded">+</button>
        </TabList>
        {tabs.map((tab, index) => (
          <TabPanel key={index} className="p-4 border rounded mt-2">
            <input
              value={tab.name}
              onChange={(e) => updateTab(index, "name", e.target.value)}
              placeholder="Tên ghi chú"
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              value={tab.category}
              onChange={(e) => updateTab(index, "category", e.target.value)}
              placeholder="Thể loại"
              className="mb-2 p-2 border rounded w-full"
            />
            <textarea
              value={tab.description}
              onChange={(e) => updateTab(index, "description", e.target.value)}
              placeholder="Mô tả (Markdown hỗ trợ)"
              className="mb-2 p-2 border rounded w-full h-32"
            />
            <div className="border p-2 rounded bg-gray-100">
              <ReactMarkdown>{tab.description}</ReactMarkdown>
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}
