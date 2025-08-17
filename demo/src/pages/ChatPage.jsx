// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import io from "socket.io-client";
// import { useNavigate, useParams } from "react-router-dom";
// import { RiUpload2Fill } from "react-icons/ri";

// const API_URL = "http://localhost:5000"; // backend API
// const socket = io(API_URL, { transports: ["websocket"] });

// export default function ChatPage() {
//   const navigate = useNavigate();
//   const id = useParams().userId || null;
//   console.log("ABCDE: ", id);
//   const [friends, setFriends] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMsg, setNewMsg] = useState("");
//   const [user, setUser] = useState(null);

//   // 1. Fetch current user
//   useEffect(() => {
//     const fetchUser = async () => {
//       const userId = localStorage.getItem("userId");
//       if (!userId) return;
//       const res = await axios.get(`${API_URL}/getUser/${userId}`);
//       setUser(res.data.user);

//       // Join socket room after login
//       socket.emit("join", userId);
//     };
//     fetchUser();
//   }, []);

//   // 2. Fetch friend list
//   useEffect(() => {
//     if (!user) return;
//     const fetchFriends = async () => {
//       const res = await axios.get(`${API_URL}/api/friendList/${user._id}`);
//       setFriends(res.data.friends);
//       if (id) {
//         const data = await res.data.friends.find((friend) => friend.friendId._id === id)
//         if (data) {
//           setSelectedConversation(data);
//           console.log(data);
//         }
//       }
//     };
//     fetchFriends();
//   }, [user]);

//   // 3. Fetch messages for selected conversation
//   useEffect(() => {
//     if (!selectedConversation) return;
//     const fetchMessages = async () => {
//       const res = await axios.get(
//         `${API_URL}/api/message/${selectedConversation.conversationId._id}`
//       );
//       setMessages(res.data);
//     };
//     fetchMessages();
//   }, [selectedConversation]);

//   // 4. Listen for new messages
//   useEffect(() => {
//     socket.on("newMessage", (msg) => {
//       // Only add if message belongs to current open conversation
//       if (msg.conversationId === selectedConversation?.conversationId._id) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     return () => {
//       socket.off("newMessage");
//     };
//   }, [selectedConversation]);


//   // 5. Send message
//   const sendMessage = async () => {
//     if (!newMsg.trim() || !selectedConversation) return;

//     const msgData = {
//       conversationId: selectedConversation.conversationId._id,
//       text: newMsg,
//       sender: user._id,
//       receiver: selectedConversation.friendId._id,
//     };

//     const res = await axios.post(`${API_URL}/api/message`, msgData);
//     // No socket emit here, backend will emit to receiver automatically

//     setMessages((prev) => [...prev, res.data]);
//     setNewMsg("");
//   };

//   return (
//     <div style={{ display: "flex", height: "89vh", fontFamily: "Arial" }}>
//       {/* Sidebar */}
//       <div style={{ width: "25%", borderRight: "1px solid #ccc", padding: "10px" }}>
//         <h3 style={{ fontWeight: "600" }}>Friends</h3>
//         {friends.map((friend) => (
//           <div
//             key={friend.friendId._id}
//             style={{
//               display: "flex",
//               justifyContent: "left",
//               alignItems: "center",
//               padding: "8px 15px",
//               borderRadius: "6px",
//               background:
//                 selectedConversation?.friendId._id === friend.friendId._id
//                   ? "#d4d2d2ff"
//                   : "transparent",
//               cursor: "pointer",
//             }}
//             onClick={() => {
//               navigate(`/direct/${friend.friendId._id}`)
//               setNewMsg("");
//               setSelectedConversation(friend)
//             }}
//           >
//             <img
//               src={friend.friendId.profileImage}
//               style={{
//                 height: "30px",
//                 width: "30px",
//                 borderRadius: "50%",
//                 marginRight: "10px",
//               }}
//               alt="friend"
//             />
//             <div>
//               <strong>{friend.friendId.name}</strong>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Chat Section */}
//       <div style={{ width: "75%", display: "flex", flexDirection: "column" }}>
//         {selectedConversation ? (
//           <>
//             {/* Messages */}
//             <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
//               {messages.map((msg) => (
//                 <div
//                   key={msg._id}
//                   style={{
//                     marginBottom: "10px",
//                     textAlign: msg.sender === user._id ? "right" : "left",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "inline-block",
//                       padding: "8px 12px",
//                       borderRadius: "12px",
//                       background:
//                         msg.sender === user._id ? "#dcf8c6" : "#f1f0f0",
//                     }}
//                   >
//                     {msg.text}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Input */}
//             <div style={{ padding: "10px", borderTop: "1px solid #ccc", display: "flex", alignItems: "center", gap: "8px" }}>
//               {/* File upload button */}
//               <label
//                 style={{
//                   background: "#f1f1f1",
//                   padding: "8px 12px",
//                   borderRadius: "6px",
//                   cursor: "pointer",
//                   border: "1px solid #ccc",
//                   fontSize: "14px",
//                   whiteSpace: "nowrap"
//                 }}
//               >
//                 <RiUpload2Fill />
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleFileUpload(e.target.files[0])}
//                   style={{ display: "none" }}
//                 />
//               </label>

//               {/* Text input */}
//               <input
//                 type="text"
//                 value={newMsg}
//                 onChange={(e) => setNewMsg(e.target.value)}
//                 placeholder="Type a message..."
//                 style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }}
//               />

//               {/* Send button */}
//               <button
//                 onClick={sendMessage}
//                 style={{
//                   padding: "8px 14px",
//                   background: "#4CAF50",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "6px",
//                   cursor: "pointer",
//                   fontSize: "14px"
//                 }}
//               >
//                 Send
//               </button>
//             </div>

//           </>
//         ) : (<div style={{ height: "89vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
//           <div style={{ padding: "20px" }}>Select a friend to start chatting</div>
//         </div>
//         )}
//       </div>
//     </div>
//   );
// }
























import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { RiUpload2Fill } from "react-icons/ri";

const API_URL = "http://localhost:5000"; // backend API
const CLOUDINARY_UPLOAD_PRESET = "BlogApp"; // change
const CLOUDINARY_CLOUD_NAME = "daxfgrt9j"; // change
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const socket = io(API_URL);

export default function ChatPage() {
  const navigate = useNavigate();
  const id = useParams().userId || null;
  const [friends, setFriends] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 1. Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const res = await axios.get(`${API_URL}/getUser/${userId}`);
      setUser(res.data.user);
      socket.emit("join", userId);
    };
    fetchUser();
  }, []);

  // 2. Fetch friend list
  useEffect(() => {
    if (!user) return;
    const fetchFriends = async () => {
      const res = await axios.get(`${API_URL}/api/friendList/${user._id}`);
      setFriends(res.data.friends);
      if (id) {
        const data = res.data.friends.find((friend) => friend.friendId._id === id);
        if (data) {
          setSelectedConversation(data);
        }
      }
    };
    fetchFriends();
  }, [user]);

  // 3. Fetch messages
  useEffect(() => {
    if (!selectedConversation) return;
    const fetchMessages = async () => {
      const res = await axios.get(
        `${API_URL}/api/message/${selectedConversation.conversationId._id}`
      );
      socket.emit('joinConversation',selectedConversation.conversationId._id)
      setMessages(res.data);
    };
    fetchMessages();
  }, [selectedConversation]);

  // 4. Listen for new messages
  useEffect(() => {
    socket.on("newMessage", (msg) => {
      if (msg.conversationId === selectedConversation?.conversationId._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => {
      socket.off("newMessage");
    };
  }, [selectedConversation]);

  // 5. Send text message
  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedConversation) return;

    const msgData = {
      conversationId: selectedConversation.conversationId._id,
      text: newMsg,
      sender: user._id,
      receiver: selectedConversation.friendId._id,
    };

    const res = await axios.post(`${API_URL}/api/message`, msgData);
    setNewMsg("");
  };

  // 6. Handle image upload to Cloudinary and backend
  const handleFileUpload = async (file) => {
    if (!file || !selectedConversation) return;
    setUploading(true);

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const cloudRes = await axios.post(CLOUDINARY_URL, formData);
      const imageUrl = cloudRes.data.secure_url;

      // Send image message to backend
      const msgData = {
        conversationId: selectedConversation.conversationId._id,
        text: "", // No text for image message
        imageUrl,
        sender: user._id,
        receiver: selectedConversation.friendId._id,
      };

      const res = await axios.post(`${API_URL}/api/message`, msgData);
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "89vh", fontFamily: "Arial" }}>
      {/* Sidebar */}
      <div style={{ width: "25%", borderRight: "1px solid #ccc", padding: "10px" }}>
        <h3 style={{ fontWeight: "600" }}>Friends</h3>
        {friends.map((friend) => (
          <div
            key={friend.friendId._id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 15px",
              borderRadius: "6px",
              background:
                selectedConversation?.friendId._id === friend.friendId._id
                  ? "#d4d2d2ff"
                  : "transparent",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate(`/direct/${friend.friendId._id}`);
              setNewMsg("");
              setSelectedConversation(friend);
            }}
          >
            <img
              src={friend.friendId.profileImage}
              style={{
                height: "30px",
                width: "30px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
              alt="friend"
            />
            <div>
              <strong>{friend.friendId.name}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Section */}
      <div style={{ width: "75%", display: "flex", flexDirection: "column" }}>
        {selectedConversation ? (
          <>
            {/* Messages */}
            <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    marginBottom: "10px",
                    textAlign: msg.sender === user._id ? "right" : "left",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      background: msg.sender === user._id ? "#dcf8c6" : "#f1f0f0",
                      maxWidth: "60%",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.imageUrl ? (
                      <img
                        src={msg.imageUrl}
                        alt="sent"
                        style={{ maxWidth: "200px", borderRadius: "8px" }}
                      />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div
              style={{
                padding: "10px",
                borderTop: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {/* File upload button */}
              <label
                style={{
                  background: "#f1f1f1",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
              >
                <RiUpload2Fill />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </label>

              {/* Text input */}
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />

              {/* Send button */}
              <button
                onClick={sendMessage}
                style={{
                  padding: "8px 14px",
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Send"}
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              height: "89vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ padding: "20px" }}>Select a friend to start chatting</div>
          </div>
        )}
      </div>
    </div>
  );
}
