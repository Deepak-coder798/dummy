import { useEffect, useRef } from 'react';
import ChatList from './ChatList';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const ChatLayout = ({
  currentUser,
  conversations,
  currentChat,
  messages,
  loading,
  error,
  onSelectChat,
  onSendMessage
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-80px)] border-t">
      {/* Sidebar with conversations */}
      <div className="w-1/4 border-r overflow-y-auto">
        <ChatList
          conversations={conversations}
          currentChat={currentChat}
          onSelectChat={onSelectChat}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b flex items-center">
              <img
                src={currentChat.avatar || '/default-avatar.png'}
                alt={currentChat.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <h2 className="font-semibold">{currentChat.name}</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div>Loading messages...</div>
              ) : error ? (
                <div>Error: {error}</div>
              ) : (
                <MessageList
                  messages={messages}
                  currentUserId={currentUser?.id}
                />
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t">
              <ChatInput onSend={onSendMessage} disabled={loading} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">No chat selected</h2>
              <p>Select a conversation from the sidebar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;