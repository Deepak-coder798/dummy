// Home.js
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './rrr.css';
import Footer from './Footer'
import axios from 'axios';
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [allBlogPosts, setAllBlogPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [show, setShow] = useState(false)
  const [imageUrl, setImageUrl] = useState(null);
  const [toggle, setToggle] = useState(false);
  const userId = localStorage.getItem('userId')
  const [comment, setComment] = useState('');


  useEffect(() => {
    const getPostByUserName = () => {
      const data = query.toLowerCase()
      const searched = allBlogPosts.filter((post) => post.userId.name.toLowerCase().includes(data));
      setBlogPosts(searched);
    }

    getPostByUserName()
  }, [query])


  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getPost');
        if (response && response.status === 200) {
          const freshPosts = response.data.posts;
          setBlogPosts(freshPosts);
          setAllBlogPosts(freshPosts);
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


  const openProfile = (id) => {
    navigate(`/profile/${id}`);
  }

  console.log(blogPosts)

  return (
    <>
      <main className="home" style={{ position: 'relative', left: "0", top: "0" }}>
        <h2>Blog Posts</h2>
        <div className='boxes'>
          <p style={{ fontSize: "13px", fontWeight: "700", color: "rgb(124, 124, 128)", marginBottom: "0", padding: "0" }}>Created By</p>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='All'
            style={{ textDecoration: "none" }}
          >
          </input>
        </div>

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
                  borderTop: "1px solid #ccc"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0 16px",
                    marginTop: "12px",
                  }}
                >
                  <img
                    src={post.userId?.profileImage} // fallback if no image
                    alt={post.userId?.name || "User"}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    onClick={() => openProfile(post.userId._id)}
                  />
                  <span style={{ fontWeight: "bold", color: "#333" }} onClick={() => openProfile(post.userId._id)}>{post.userId?.name}</span>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "0 16px",
                  marginTop: "12px",
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaHeart style={{ height: "20px", width: "20px", color: post.like.some((like) => like.userId === userId) ? "red" : "gray" }} onClick={() => doLike(post._id)} /> {post.like.length}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaComment onClick={() => handleModal(post)} /> {post.comment.length}
                  </span>
                </div>
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
            {imageUrl.userId?._id?.toString() === userId && (
              <button
                onClick={() => deletePost(modalPost._id)}
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                }}
                title="Delete Post"
              >
                Delete
              </button>
            )}
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
                borderBottom: "1px solid #ccc"
              }}>
                <img
                  src={imageUrl.userId.profileImage}
                  alt="user"
                  style={{ height: 40, width: 40, borderRadius: "50%", marginRight: 10 }}
                />
                <h4 style={{ margin: 0 }}>{imageUrl.userId.name}</h4>
              </div>

              {/* Comments */}
              <div style={{
                flex: 1, padding: "20px", overflowY: "auto"
              }}>
                {imageUrl.comment.map((cmt, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "12px",
                      borderBottom: "1px solid #eee",
                      paddingBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    {/* Profile Image */}
                    <img
                      src={cmt.userId?.profileImage || "/default-avatar.png"} // fallback image
                      alt={cmt.userId?.name || "User"}
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #ddd"
                      }}
                    />

                    {/* Name + Comment */}
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px", color: "#222" }}>
                        {cmt.userId?.name || "Unknown User"}
                      </p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>{cmt.cmt}</p>
                    </div>

                    {/* Delete Button */}
                    {cmt.userId?._id?.toString() === userId && (
                      <span
                        onClick={() => deleteComment(imageUrl._id, cmt._id)}
                        style={{
                          cursor: "pointer",
                          fontSize: "16px",
                          color: "#dc3545"
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
