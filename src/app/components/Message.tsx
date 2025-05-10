import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MessageProps {
  content: string;
  isUser: boolean;
}

const Message = ({ content, isUser }: MessageProps) => {
  const userMessageClasses = "bg-sky-500 text-white rounded-xl py-2 px-4 max-w-md shadow-sm";
  const botMessageClasses = "bg-slate-100 text-slate-800 rounded-xl py-2 px-4 max-w-3xl shadow-sm";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : ""} mb-4`}>
      <div className={isUser ? userMessageClasses : botMessageClasses}>
        {isUser ? (
          <div className="whitespace-pre-wrap overflow-auto">{content}</div>
        ) : (
          <div className="markdown-body prose prose-slate prose-sm max-w-none overflow-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message; 