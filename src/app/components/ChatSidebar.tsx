interface ChatSession {
    id: string;
    title: string;
  }
  
  interface ChatSidebarProps {
    sessions: ChatSession[];
    activeSessionId: string | null;
    onSelectSession: (sessionId: string) => void;
  }
  
  const ChatSidebar = ({ 
    sessions, 
    activeSessionId, 
    onSelectSession 
  }: ChatSidebarProps) => {
    return (
      <div className="w-1/4 bg-slate-50 p-4 overflow-y-auto border-r border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-700">对话历史</h2>
        {sessions.length === 0 ? (
          <div className="text-slate-400 p-2">
            暂无历史会话
          </div>
        ) : (
          <ul>
            {sessions.map((session) => (
              <li 
                key={session.id}
                className={`p-2 mb-1 text-slate-600 hover:bg-slate-200 cursor-pointer rounded-md ${
                  activeSessionId === session.id ? 'bg-slate-200' : ''
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                {session.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default ChatSidebar;