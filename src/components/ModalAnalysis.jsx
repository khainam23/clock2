// components/ModalAnalysis.jsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Hàm kiểm tra nội dung có phải là HTML không
function isHTML(content) {
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;
  return htmlRegex.test(content.trim());
}

export default function ModalAnalysis({ isOpen, setIsOpen, aiContent }) {
  const exportToPDF = async () => {
    const input = document.getElementById('ai-analysis-content');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('AI_phan_tich_lich_trinh.pdf');
  };

  const renderContent = () => {
    if (isHTML(aiContent)) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: aiContent }}
        />
      );
    }
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiContent}</ReactMarkdown>;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-6 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-3 sm:p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg sm:text-xl font-semibold leading-6 text-gray-800"
                >
                  📊 Gợi ý từ AI
                </Dialog.Title>

                <div
                  id="ai-analysis-content"
                  className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700 prose max-w-none overflow-y-auto max-h-[60vh] sm:max-h-[70vh]"
                >
                  {renderContent()}
                </div>

                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2">
                  <button
                    onClick={exportToPDF}
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Tải xuống PDF
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Đóng
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}