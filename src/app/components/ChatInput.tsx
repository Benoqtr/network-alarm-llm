import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string, options: {
    removeCss: boolean;
    removeGarbledText: boolean;
    autoDecode: boolean;
  }) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [removeCss, setRemoveCss] = useState(false);
  const [removeGarbledText, setRemoveGarbledText] = useState(false);
  const [autoDecode, setAutoDecode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, {
        removeCss,
        removeGarbledText,
        autoDecode
      });
      setMessage('');
    }
  };

  return (
    <div className="bg-slate-50 p-4 border-t border-slate-200">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入消息..."
            className="flex-grow bg-slate-100 border border-slate-200 rounded-lg p-3 mr-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-700"
          />
          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-150"
          >
            发送
          </button>
        </div>
        
        <div className="flex mt-2 space-x-4 text-sm text-slate-600">
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={removeCss}
              onChange={() => setRemoveCss(!removeCss)}
              className="rounded text-sky-500 focus:ring-sky-500"
            />
            <span>去除CSS</span>
          </label>
          
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={removeGarbledText}
              onChange={() => setRemoveGarbledText(!removeGarbledText)}
              className="rounded text-sky-500 focus:ring-sky-500"
            />
            <span>去除乱码</span>
          </label>
          
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={autoDecode}
              onChange={() => setAutoDecode(!autoDecode)}
              className="rounded text-sky-500 focus:ring-sky-500"
            />
            <span>自动解码</span>
          </label>
        </div>
      </form>
    </div>
  );
};

export default ChatInput; 