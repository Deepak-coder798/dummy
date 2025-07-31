import { useState, useEffect } from "react";
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { useParams } from "react-router-dom";

const Profile = () => {
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
    const [previewImage, setPreviewImage] = useState(null); // preview URL


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


    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(`http://localhost:5000/getPostById/${userId}`);
            if (response && response.status === 200) {
                setPosts(response.data.response);
                console.log(response);
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

    console.log(user)

    return (
        <>
            {/* Profile Header Section */}
            {user ? <div><div style={{
                display: 'flex',
                justifyContent: "center",
                alignItems: 'center',
                padding: '30px',
                backgroundColor: '#fff',
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
                        <p style={{ margin: '0', color: '#777' }}>followers: {user.followers.length}</p>
                        <p style={{ margin: '0', color: '#777' }}>following: {user.following.length}</p>
                    </div>
                    {user._id !== localId ? <button onClick={() => handleFollow(user._id)} style={{ padding: "8px 20px", background: "#0408d6ff", color: "white", fontWeight: "600", border: "none", borderRadius: "8px", marginTop: "10px" }}>{user.followers.find((user) => user._id === localId) ? "Followed" : "Follow"} </button> : null}
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
                <div
                    style={{
                        position: "fixed",
                        zIndex: 1000,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        left: 0,
                        top: 0,
                    }}
                >
                    <div
                        style={{
                            height: "80%",
                            width: "90%",
                            maxWidth: "600px",
                            background: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            padding: "20px",
                            overflowY: "auto",
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setModalPost(null);
                                setShow((prev) => !prev);
                            }}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "transparent",
                                border: "none",
                                fontSize: "20px",
                                cursor: "pointer",
                            }}
                            aria-label="Close modal"
                        >
                            ❌
                        </button>

                        {/* Delete Button */}
                        {userId === localId && <button
                            onClick={() => deletePost(modalPost._id)}
                            style={{
                                position: "absolute",
                                top: "10px",
                                left: "10px",
                                background: "red",
                                border: "none",
                                color: "white",
                                borderRadius: "4px",
                                padding: "6px 10px",
                                cursor: "pointer",
                            }}
                        >
                            🗑️ Delete
                        </button>}

                        {/* Content */}
                        <img
                            src={modalPost.imageUrl}
                            alt={modalPost.title}
                            style={{
                                width: "100%",
                                height: "300px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                marginBottom: "16px",
                                marginTop: "25px"
                            }}
                        />
                        <h2 style={{ marginBottom: "8px" }}>{modalPost.title}</h2>
                        <p style={{ marginBottom: "16px", color: "#444" }}>
                            {modalPost.description}
                        </p>

                        {/* Stats */}
                        <div style={{ display: "flex", gap: "20px", fontWeight: "500" }}>
                            <span>👍 Likes: {modalPost.like.length}</span>
                            <span>💬 Comments: {modalPost.comment.length}</span>
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




        </>
    );
};

export default Profile;
