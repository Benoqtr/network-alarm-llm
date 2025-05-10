import Message from './Message';

interface MessageData {
  content: string;
  isUser: boolean;
  id: string;
}

interface MessageListProps {
  messages: MessageData[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-grow p-6 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="text-center text-slate-400">
          网络告警研判大模型 - 开始对话吧！
        </div>
      ) : (
        messages.map((message) => (
          <Message 
            key={message.id} 
            content={message.content} 
            isUser={message.isUser} 
          />
        ))
      )}
    </div>
  );
};

export default MessageList; 