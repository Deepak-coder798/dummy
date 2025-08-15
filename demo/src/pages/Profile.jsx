import { useState, useEffect } from "react";
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai";

const Profile = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [toggle, setTggle] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [postImagePreview, setPostImagePreview] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    var { id } = useParams(); // This will be undefined if path is "/profile"
    console.log(id)
    var userId = id || localStorage.getItem('userId');
    const localId = localStorage.getItem('userId');
    const [show, setShow] = useState(false);
    const [modalPost, setModalPost] = useState(null);
    const [user, setUser] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [rrr, setRRR] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showFollowModal, setShowFollowModal] = useState(false);
    const [followListType, setFollowListType] = useState('');
    const [comment, setComment] = useState('');


    useEffect(() => {
        const getUser = async () => {
            try {
                if (!userId) {
                    console.warn("userId not found in localStorage.");
                    return;
                }

                const response = await axios.get(`http://localhost:5000/getUser/${userId}`);
                if (response && response.status === 200) {
                    setUser(response.data.user);
                } else {
                    console.warn("Failed to fetch user:", response.data.message || response.data.error);
                }
            } catch (error) {
                console.error("Error fetching user:", error.message);
            }
        };

        getUser();
    }, [userId, rrr]);


    const handleAddPost = async () => {
        if (!title || !description || !postImage) {
            alert("Please fill in all fields and upload an image.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', postImage);
            formData.append('upload_preset', 'BlogApp');
            const cloudinaryRes = await axios.post(
                'https://api.cloudinary.com/v1_1/daxfgrt9j/image/upload',
                formData
            );

            const uploadedImageUrl = cloudinaryRes.data.secure_url;

            // Step 2: Send post data to backend
            const response = await axios.post(
                `http://localhost:5000/addPost/${userId}`,
                {
                    title,
                    description,
                    imageUrl: uploadedImageUrl,
                }
            );

            if (response && response.status === 200) {
                alert(response.data.message);
                setTitle('');
                setDescription('');
                setPostImage(null);
                setPostImagePreview(null);
                setTggle(false);

                setRRR((pre) => !pre)
            } else {
                alert(response.data.message || response.data.error);
            }
        } catch (err) {
            console.error('Error uploading post:', err);
            alert('Something went wrong. Please try again.');
        }
    };


    const doLike = async (id) => {
        const response = await axios.put(`http://localhost:5000/doLike/${localId}/${id}`);
        if (response && response.status == 200) {
            setRRR((pre) => !pre);
        }

    }

    const addComment = async (id) => {
        if (!comment) {
            return alert("First Write Comment!");
        }
        const response = await axios.put(`http://localhost:5000/addComment/${localId}/${id}`, { comment });
        if (response && response.status == 200) {
            setRRR((pre) => !pre);
            alert(response.data.message);
            setComment('');
        }
    }


    const deleteComment = async (postId, commentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`http://localhost:5000/deleteComment/${localId}/${postId}/${commentId}`,);
            if (response.status === 200) {
                alert(response.data.message);
                setRRR(prev => !prev); // Refresh comments
            }
        } catch (error) {
            console.error("Failed to delete comment:", error);
            alert("Something went wrong. Please try again.");
        }
    };


    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(`http://localhost:5000/getPostById/${userId}`);
            if (response && response.status === 200) {
                setPosts(response.data.response);
                console.log(response);
                if (modalPost !== null) {
                    const updated = response?.data?.response.find(post => post._id === modalPost._id);
                    if (updated) setModalPost(updated);
                }

            } else {
                console.log(response.data.message || response.data.error);
            }
        };
        getData();
    }, [userId, rrr]);


    const showModal = (post) => {
        setShow((p) => !p);
        setModalPost(post);
    }

    const deletePost = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/deletePost/${id}`);
            if (response && response.status == 200) {
                alert(response.data.message);
                setShow((p) => !p);
                const res = posts.filter((post) => post._id !== id);
                setPosts(res);
            }
            else {
                alert(response.data.message || response.data.error);
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const updateProfileImage = async () => {
        if (!profileImage) {
            return alert("Image URL is reduired!");
        }

        const formData = new FormData();
        formData.append('file', profileImage);
        formData.append('upload_preset', 'BlogApp'); // 🔁 required

        try {
            const res = await axios.post(
                'https://api.cloudinary.com/v1_1/daxfgrt9j/image/upload', // 🔁 cloud name is part of URL
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const imageUrl = res.data.secure_url;
            if (imageUrl) {
                const response = await axios.put(`http://localhost:5000/uploadProfileImage/${userId}`, { profileImage: imageUrl });
                if (response && response.status == 200) {
                    alert(response.data.message);
                    setRRR((pre) => !pre);
                    setShowImageModal((pre) => !pre);
                    setProfileImage(null);
                    setPreviewImage(null);
                }
            }


        } catch (err) {
            console.error('Cloudinary upload error:', err);
        }
    };



    const handleFollow = async (id) => {
        try {
            const response = await axios.put(`http://localhost:5000/follow/${localId}/${id}`);
            if (response && response.status == 200) {
                alert(response.data.message);
                setRRR((pre) => !pre);
            }
            else {
                alert(response.data.message || response.data.error);
            }
        }
        catch (error) {
            alert(error.response.data.message);
            console.log(error);
        }

    }

    const openChatPage = async(userId)=>{
        const response = await axios.post('http://localhost:5000/api/conversation',{receiverId:userId, me:localId});
        if(response && response.status==200)
        {
            navigate(`/direct/${userId}`);
        }
    }

    console.log(user)

    return (
        <>
            {/* Profile Header Section */}
            {user ? <div><div style={{
                display: 'flex',
                justifyContent: "center",
                alignItems: 'center',
                padding: '30px',
                backgroundColor: '#f9fafb',
                borderBottom: '1px solid #ddd'
            }}>
                <div style={{
                    position: "relative"
                }}>
                    <img src={user.profileImage} alt="Profile" style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '40px'
                    }} />
                    {userId === localId && <div onClick={(e) => (setShowImageModal((pre) => !pre))} style={{ height: "28px", width: "28px", borderRadius: "50%", background: "#a06262ff", position: "absolute", top: "10px", right: "50px" }}>
                        <MdModeEditOutline style={{ position: "absolute", top: "6px", right: "5px" }} />
                    </div>}
                </div>
                <div>
                    <h2 style={{ margin: '0 0 10px 0' }}>{user.name}</h2>
                    <p style={{ margin: '0 0 5px 0', color: '#555' }}>{user.email}</p>
                    <div style={{ width: "250px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ margin: '0', color: '#777' }}>Posts: {posts.length}</p>
                        <p
                            onClick={() => {
                                setFollowListType("followers");
                                setShowFollowModal(true);
                            }}
                            style={{ margin: '0', color: '#777', cursor: 'pointer' }}
                        >
                            followers: {user.followers.length}
                        </p>

                        <p
                            onClick={() => {
                                setFollowListType("following");
                                setShowFollowModal(true);
                            }}
                            style={{ margin: '0', color: '#777', cursor: 'pointer' }}
                        >
                            following: {user.following.length}
                        </p>
                         

                    </div>
                    {user._id !== localId && (
                        <div style={{display:"flex", alignItems:"center"}}>
                        <button
                            onClick={() => handleFollow(user._id)}
                            style={{
                                padding: "8px 20px",
                                background: user.followers.find(f => f._id.toString() === localId.toString()) ? "#ccc" : "blue",
                                color: user.followers.find(f => f._id.toString() === localId.toString()) ? "black" : "white",
                                fontWeight: "600",
                                border: "none",
                                borderRadius: "8px",
                                marginTop: "10px",
                                marginRight:"15px"
                            }}
                        >
                            {user.followers.find(f => f._id.toString() === localId.toString()) ? "Followed" : "Follow"}
                        </button>
                        <p
                            onClick={() => {
                                openChatPage(userId);
                            }}
                            style={{ margin: '0', color: '#777', cursor: 'pointer' }}
                        >
                            <AiFillMessage size={35}/>
                        </p>
                        </div> 
                    )}

                </div>
            </div>

                <div style={{
                    minHeight: "80vh",
                    padding: "10px 20%",
                    backgroundColor: "#f5f5f5"
                }}>
                    {userId === localId && <button onClick={() => setTggle(true)} style={{
                        margin: '10px 0',
                        padding: "10px 20px",
                        backgroundColor: "#0095f6",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}>+ Post Blog</button>}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "20px"
                    }}>
                        {posts && posts.map((post) => (
                            <div key={post._id} style={{
                                backgroundColor: "#fff",
                                borderRadius: "10px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                overflow: "hidden"
                            }}>
                                <img src={post.imageUrl} alt={post.title} style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }} onClick={() => showModal(post)} />
                            </div>
                        ))}
                    </div>

                </div></div> : <div>Loading profile...</div>}

            {/* New Post */}
            {toggle && (
                <div style={{
                    position: "fixed",
                    zIndex: "1",
                    width: '100%',
                    height: "100%",
                    background: "rgba(0,0,0,0.6)",
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: "center",
                    left: "0",
                    top: "0"
                }}>
                    <div style={{
                        height: "auto",
                        width: "400px",
                        background: "white",
                        borderRadius: '10px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>New Post</h3>
                            <button onClick={() => {
                                setTggle(false)
                                setTitle('');
                                setDescription('');
                                setPostImage(null);
                                setPostImagePreview(null);
                            }} style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: '18px',
                                cursor: 'pointer'
                            }}>✕</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                            <label>Title:</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{
                                padding: '8px', border: '1px solid #ccc', borderRadius: '4px'
                            }} />

                            <label>Description:</label>
                            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} style={{
                                padding: '8px', border: '1px solid #ccc', borderRadius: '4px'
                            }} />

                            <label>Upload Image:</label>
                            <input type="file" accept="image/*" onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setPostImage(file);
                                    setPostImagePreview(URL.createObjectURL(file));
                                }
                            }} />

                            {/* Image Preview */}
                            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                <img
                                    src={postImagePreview || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAPFBMVEXu7u69vb3s7Ozx8fG4uLi5ubm8vLzExMS1tbXHx8f29vbj4+PAwMDU1NTX19esrKzg4OCpqanOzs6ioqIZFAOmAAAEVElEQVR4nO3ai47bOAwFUOtF0Zb8GPf//3UvFSc7BTaJB8g2iHpP03SmcICYpijK8jAQERERERERERERERERERERERERERERERERERERERERERERERER0V/M/9C7v+/LhbCstVap7owkNdXOohCG4PevGBP+aExP4ZBVy7u/9auFYV6rk6gpRn0qSlx1C+/+0i9mMXCaXKpnRkNyIrnHPPhyMvtyqjRi6HjfWxr4lgfrHIZpOHFu3j7QWwxaHoguwZetnLGV64H9TA+XejD7MK6YG1AXk70/oUk19zMmWgzi4oeMGKiKTZEnYoBX6SoGGAtDGLWKWBbo8zwQwQzRVwzcJQZOx5yz/X0Ksap9jQXkAcaCuoS5L4TpOZ8lum5K4vexIGtpzXM7uYddQkHLKH3mgWL6RwBsmrQ2wN/rBEJJSVxfc6PlQYtBCT74bcf8MC5luhuDoWDqcH/0a/6vfo8Bfp8RAVs+zQ9SvecYbMOwYX6sOeN9CXej0HMMyjTsWEMaWbPF4L/HfM8x2KZStdoquuLfexE4YtBNSfweA0FNRAwQAHtpQn2886GO8yAiBmgT7O4iCoJrDYDfbHbwHgPD3z7SbwwqxsKwxFSdOJcwMVgMZtTG27Fttgxd54HaNR811uyijiiQvuy6OjvzqWXCJQw+9BsDQZ84TBgN69eX2l3DUPY1ViysrTCEYGG4jIt+a6L1SD5MoSwzukSc7VZVkBJxQy2wsw9h3hGPqeOxUNtdc7u8lwK42P1ml6ruNhpw+f2i69J3TbT1gsXgcsn9EtVVVMea4mKryeB3tNAVa4qpsxgMxz2Uoz/wlwseUAoSmubWLrl1tIpQrFoiKTAuisTY0dp5sP0Fu39w5EHrCbz1CSqu7bvgvHXGtc8a7We3BV9ciq6XGLQO4Ot6PxH1AGMAo2FCNUwWgpYGVTSWLa/WRYvTEf2Bs3tp7/7yL3TLA4tB20sKm6xy5IAgBmga0SfUmjL+R3XB3Ihh0VEMwrzWeBsLrSLOq45WDS0ImBwl2+pBXM7RtuhVMBbUllTdCG0s+KMm2sS3q173WJEMGbOjhaKKBQA/JN1LTdpRjzQM+6+4zv52H2lDNUTaWx2wetBO/HhhKYWyKEkX6SkGqIEzih/yYGz3VIctI+3F/bYRj1/kOjTwo9OcpKf+AP2A7Z/aWqmuZVgkyoPnDyw0IhIRA7l7h+XDtKXgNFlnOFo9mOPahsAj7VEMvN793V/peNQMMYitGj7Mg+NplepSN3lwhURAfxAx6594IKfFIKZe9lj+vXPsc2sD7UI/Gwx2iEM96AwC0Z4/SLbB8vThtNhe7/7Or2ZTpG27jyPeT8g5750Mhatjp/n08aEd3Mm68ZuAGfIse0zhJzH7FD9+Jvv+duQnOy7ymQOH+xtxH+uniX1/P/ZT/fRswrd3IiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIqK/yD9snDNDSgoFPAAAAABJRU5ErkJggg=='}
                                    alt="Preview"
                                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <button onClick={handleAddPost} style={{
                                padding: '10px 15px',
                                backgroundColor: '#0095f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}>Submit</button>
                            <button onClick={() => {
                                setTggle(false)
                                setTitle('');
                                setDescription('');
                                setPostImage(null);
                                setPostImagePreview(null);
                            }} style={{
                                padding: '10px 15px',
                                backgroundColor: '#ccc',
                                color: '#333',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}>Close</button>
                        </div>
                    </div>
                </div>
            )}


            {/* View Post */}
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
                        {/* Delete Post Button (Top Left) */}
                        {modalPost.userId?._id?.toString() === localId && (
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
                            setModalPost(null);
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
                            <img src={modalPost.imageUrl} alt="preview" style={{
                                width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: 8, marginBottom: 16
                            }} />
                            <h3 style={{ margin: "0 0 10px", fontSize: "1.2rem" }}>{modalPost.title}</h3>
                            <p style={{ marginBottom: 16, color: "#555" }}>{modalPost.description}</p>

                            {/* Likes and Comments */}
                            <div style={{ display: "flex", gap: "20px", marginTop: "auto" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                                    <FaHeart
                                        onClick={() => doLike(modalPost._id)}
                                        style={{
                                            color: modalPost.like.some(like => like.userId === localId) ? "red" : "gray",
                                            height: "20px", width: "20px"
                                        }}
                                    />
                                    {modalPost.like.length}
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <FaComment />
                                    {modalPost.comment.length}
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
                                    src={modalPost.userId.profileImage}
                                    alt="user"
                                    style={{ height: 40, width: 40, borderRadius: "50%", marginRight: 10 }}
                                />
                                <h4 style={{ margin: 0 }}>{modalPost.userId.name}</h4>
                            </div>

                            {/* Comments */}
                            <div style={{
                                flex: 1, padding: "20px", overflowY: "auto"
                            }}>
                                {modalPost.comment.map((cmt, idx) => (
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
                                        {cmt.userId?._id?.toString() === localId && (
                                            <span
                                                onClick={() => deleteComment(modalPost._id, cmt._id)}
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
                                    onClick={() => addComment(modalPost._id)}
                                    style={{ fontSize: "20px", color: "#007bff", cursor: "pointer" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Profile Image */}
            {showImageModal && (
                <div style={{
                    position: "fixed",
                    zIndex: "1",
                    width: '100%',
                    height: "100%",
                    background: "rgba(0,0,0,0.6)",
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: "center",
                    left: "0",
                    top: "0"
                }}>
                    <div style={{
                        height: "auto",
                        width: "400px",
                        background: "white",
                        borderRadius: '10px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Profile Image</h3>
                            <button onClick={() => {
                                setShowImageModal(false)
                                setPreviewImage(null);
                                setProfileImage(null);
                            }
                            } style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: '18px',
                                cursor: 'pointer'
                            }}>✕</button>
                        </div>

                        {/* Image Preview */}
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <img
                                src={previewImage || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAPFBMVEXu7u69vb3s7Ozx8fG4uLi5ubm8vLzExMS1tbXHx8f29vbj4+PAwMDU1NTX19esrKzg4OCpqanOzs6ioqIZFAOmAAAEVElEQVR4nO3ai47bOAwFUOtF0Zb8GPf//3UvFSc7BTaJB8g2iHpP03SmcICYpijK8jAQERERERERERERERERERERERERERERERERERERERERERERERER0V/M/9C7v+/LhbCstVap7owkNdXOohCG4PevGBP+aExP4ZBVy7u/9auFYV6rk6gpRn0qSlx1C+/+0i9mMXCaXKpnRkNyIrnHPPhyMvtyqjRi6HjfWxr4lgfrHIZpOHFu3j7QWwxaHoguwZetnLGV64H9TA+XejD7MK6YG1AXk70/oUk19zMmWgzi4oeMGKiKTZEnYoBX6SoGGAtDGLWKWBbo8zwQwQzRVwzcJQZOx5yz/X0Ksap9jQXkAcaCuoS5L4TpOZ8lum5K4vexIGtpzXM7uYddQkHLKH3mgWL6RwBsmrQ2wN/rBEJJSVxfc6PlQYtBCT74bcf8MC5luhuDoWDqcH/0a/6vfo8Bfp8RAVs+zQ9SvecYbMOwYX6sOeN9CXej0HMMyjTsWEMaWbPF4L/HfM8x2KZStdoquuLfexE4YtBNSfweA0FNRAwQAHtpQn2886GO8yAiBmgT7O4iCoJrDYDfbHbwHgPD3z7SbwwqxsKwxFSdOJcwMVgMZtTG27Fttgxd54HaNR811uyijiiQvuy6OjvzqWXCJQw+9BsDQZ84TBgN69eX2l3DUPY1ViysrTCEYGG4jIt+a6L1SD5MoSwzukSc7VZVkBJxQy2wsw9h3hGPqeOxUNtdc7u8lwK42P1ml6ruNhpw+f2i69J3TbT1gsXgcsn9EtVVVMea4mKryeB3tNAVa4qpsxgMxz2Uoz/wlwseUAoSmubWLrl1tIpQrFoiKTAuisTY0dp5sP0Fu39w5EHrCbz1CSqu7bvgvHXGtc8a7We3BV9ciq6XGLQO4Ot6PxH1AGMAo2FCNUwWgpYGVTSWLa/WRYvTEf2Bs3tp7/7yL3TLA4tB20sKm6xy5IAgBmga0SfUmjL+R3XB3Ihh0VEMwrzWeBsLrSLOq45WDS0ImBwl2+pBXM7RtuhVMBbUllTdCG0s+KMm2sS3q173WJEMGbOjhaKKBQA/JN1LTdpRjzQM+6+4zv52H2lDNUTaWx2wetBO/HhhKYWyKEkX6SkGqIEzih/yYGz3VIctI+3F/bYRj1/kOjTwo9OcpKf+AP2A7Z/aWqmuZVgkyoPnDyw0IhIRA7l7h+XDtKXgNFlnOFo9mOPahsAj7VEMvN793V/peNQMMYitGj7Mg+NplepSN3lwhURAfxAx6594IKfFIKZe9lj+vXPsc2sD7UI/Gwx2iEM96AwC0Z4/SLbB8vThtNhe7/7Or2ZTpG27jyPeT8g5750Mhatjp/n08aEd3Mm68ZuAGfIse0zhJzH7FD9+Jvv+duQnOy7ymQOH+xtxH+uniX1/P/ZT/fRswrd3IiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIqK/yD9snDNDSgoFPAAAAABJRU5ErkJggg=='}
                                alt="Preview"
                                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </div>

                        {/* File Upload */}
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label>Upload Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setProfileImage(file);
                                        setPreviewImage(URL.createObjectURL(file));
                                    }
                                }}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <button onClick={() => updateProfileImage()} style={{
                                padding: '10px 15px',
                                backgroundColor: '#0095f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}>Submit</button>
                            <button onClick={() => {
                                setShowImageModal(false)
                                setPreviewImage(null);
                                setProfileImage(null);
                            }}
                                style={{
                                    padding: '10px 15px',
                                    backgroundColor: '#ccc',
                                    color: '#333',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/*Show Followers and Following*/}
            {showFollowModal && user && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setShowFollowModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            padding: "20px",
                            maxHeight: "70vh",
                            width: "300px",
                            overflowY: "auto",
                        }}
                    >
                        <h3 style={{ marginTop: 0, marginBottom: 15 }}>
                            {followListType === "followers" ? "Followers" : "Following"}
                        </h3>
                        {user[followListType].length === 0 && (
                            <p>No {followListType} found.</p>
                        )}
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            {user[followListType].map((follower) => (
                                <li
                                    key={follower._id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: "10px",
                                        cursor: "default",
                                    }}
                                >
                                    <img
                                        src={follower.profileImage}
                                        alt={follower.name}
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%",
                                            marginRight: "10px",
                                            objectFit: "cover",
                                        }}
                                        onClick={() => {
                                            navigate(`/profile/${follower._id}`)
                                            setShowFollowModal(false);
                                        }}
                                    />
                                    <span onClick={() => {
                                        navigate(`/profile/${follower._id}`)
                                        setShowFollowModal(false);
                                    }}>{follower.name}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setShowFollowModal(false)}
                            style={{
                                marginTop: "10px",
                                padding: "8px 16px",
                                backgroundColor: "#0095f6",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                width: "100%",
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;
