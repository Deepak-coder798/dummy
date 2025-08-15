const ChatList = ({ conversations, currentChat, onSelectChat }) => {
  return (
    <div>
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Messages</h2>
      </div>
      <div>
        {conversations.map((conversation) => (
          <div
            key={conversation._id}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
              currentChat?._id === conversation._id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelectChat(conversation)}
          >
            <img
              src={conversation.profileImage || '/default-avatar.png'}
              alt={conversation.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex-1">
              <h3 className="font-medium">{conversation.name}</h3>
              <p className="text-sm text-gray-500 truncate">
                {conversation.lastMessage?.content || 'No messages yet'}
              </p>
            </div>
            {conversation.unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {/* {conversation.unreadCount} */}   Hello
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;