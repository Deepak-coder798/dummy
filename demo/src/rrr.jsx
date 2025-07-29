// Home.js
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './rrr.css';
import Footer from './Footer'
import axios from 'axios';
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

const Home = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const { hello, id, name } = useParams();
  const location = useLocation();
  const [show, setShow] = useState(false)
  const [imageUrl, setImageUrl] = useState(null);
  const [toggle, setToggle] = useState(false);
  const userId = localStorage.getItem('userId')
  const [comment, setComment] = useState('');
  console.log(hello, id, name);


  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getPost');
        if (response && response.status === 200) {
          const freshPosts = response.data.posts;
          setBlogPosts(freshPosts);

          // ✅ Update modal content with fresh data directly
          if (imageUrl !== null) {
            const updated = freshPosts.find(post => post._id === imageUrl._id);
            if (updated) setImageUrl(updated);
          }
        } else {
          alert(response.data.message || response.data.error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getPosts();
  }, [toggle]);


  const handleModal = (image) => {
    setImageUrl(image);
    setShow((prev) => !prev);
  }

  const doLike = async (id) => {
    const response = await axios.put(`http://localhost:5000/doLike/${userId}/${id}`);
    if (response && response.status == 200) {
      setToggle((pre) => !pre);
    }

  }

  const addComment = async (id) => {
    if (!comment) {
      return alert("First Write Comment!");
    }
    const response = await axios.put(`http://localhost:5000/addComment/${userId}/${id}`, { comment });
    if (response && response.status == 200) {
      setToggle((pre) => !pre);
      alert(response.data.message);
      setComment('');
    }
  }


  const deleteComment = async (postId, commentId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
  if (!confirmDelete) return;

  try {
    const response = await axios.delete(`http://localhost:5000/deleteComment/${userId}/${postId}/${commentId}`,);
    if (response.status === 200) {
      alert(response.data.message);
      setToggle(prev => !prev); // Refresh comments
    }
  } catch (error) {
    console.error("Failed to delete comment:", error);
    alert("Something went wrong. Please try again.");
  }
};



  return (
    <>
      <main className="home" style={{ position: 'relative', left: "0", top: "0" }}>
        <h2>Blog Posts</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
            padding: "40px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {blogPosts.map((post) => (
            <div
              key={post._id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                transition: "transform 0.2s ease, box-shadow 0.3s ease",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
              }}
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                onClick={() => handleModal(post)}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
              <h3
                style={{
                  margin: "16px",
                  fontSize: "1.2rem",
                  color: "#333",
                }}
              >
                {post.title}
              </h3>
              <p
                style={{
                  margin: "0 16px 12px 16px",
                  fontSize: "0.95rem",
                  color: "#666",
                }}
              >
                {post.description}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 16px 16px 16px",
                  fontSize: "0.9rem",
                  color: "#444",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaHeart style={{ height: "20px", width: "20px", color: post.like.some((like) => like.userId === userId) ? "red" : "gray" }} onClick={() => doLike(post._id)} /> {post.like.length}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaComment onClick={() => handleModal(post)} /> {post.comment.length}
                </span>
              </div>
            </div>
          ))}
        </div>


      </main>



      {show && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            height: "70%", width: "80%", background: "#fff", borderRadius: 12,
            display: "flex", position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
          }}>
            {/* Close Button */}
            <button onClick={() => {
              setImageUrl(null);
              setShow(prev => !prev);
            }} style={{
              position: "absolute", top: 10, right: 10, background: "transparent",
              border: "none", fontSize: 20, cursor: "pointer"
            }}>✕</button>

            {/* Left Side: Image and Details */}
            <div style={{
              width: "50%", padding: "20px", borderRight: "1px solid #eee",
              display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto"
            }}>
              <img src={imageUrl.imageUrl} alt="preview" style={{
                width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: 8, marginBottom: 16
              }} />
              <h3 style={{ margin: "0 0 10px", fontSize: "1.2rem" }}>{imageUrl.title}</h3>
              <p style={{ marginBottom: 16, color: "#555" }}>{imageUrl.description}</p>

              {/* Likes and Comments */}
              <div style={{ display: "flex", gap: "20px", marginTop: "auto" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <FaHeart
                    onClick={() => doLike(imageUrl._id)}
                    style={{
                      color: imageUrl.like.some(like => like.userId === userId) ? "red" : "gray",
                      height: "20px", width: "20px"
                    }}
                  />
                  {imageUrl.like.length}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaComment />
                  {imageUrl.comment.length}
                </span>
              </div>
            </div>

            {/* Right Side: Comments */}
            <div style={{
              width: "50%", display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
              {/* Header */}
              <div style={{
                padding: "15px 20px", display: "flex", alignItems: "center",
                borderBottom: "1px solid #eee"
              }}>
                <img
                  src='data:image/jpeg;base64,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'
                  alt="user"
                  style={{ height: 40, width: 40, borderRadius: "50%", marginRight: 10 }}
                />
                <h4 style={{ margin: 0 }}>Deepak Kumar</h4>
              </div>

              {/* Comments */}
              <div style={{
                flex: 1, padding: "20px", overflowY: "auto"
              }}>
                {imageUrl.comment.map((cmt, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "10px",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "8px",
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>{cmt.cmt}</p>
                    {cmt.userId === userId && (
                      <span
                        onClick={() => deleteComment(imageUrl._id, cmt._id)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '16px',
                          color: '#dc3545',
                        }}
                        title="Delete Comment"
                      >
                        🗑️
                      </span>
                    )}
                  </div>
                ))}

              </div>

              {/* Comment Input */}
              <div style={{
                padding: "15px 20px", borderTop: "1px solid #eee", display: "flex", alignItems: "center",
                background: "#f9f9f9"
              }}>
                <input
                  type='text'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  style={{
                    flex: 1, padding: "10px 12px", borderRadius: "6px", border: "1px solid #ccc",
                    marginRight: "10px", fontSize: "14px"
                  }}
                />
                <IoMdSend
                  onClick={() => addComment(imageUrl._id)}
                  style={{ fontSize: "20px", color: "#007bff", cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}



      <Footer />
    </>
  );
};

export default Home;
