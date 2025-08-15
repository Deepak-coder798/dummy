import Message from './Message';

const MessageList = ({ messages, currentUserId }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUserId}
        />
      ))}
    </div>
  );
};

export default MessageList;