import { useState, useEffect } from "react";
import axios from 'axios';

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const [toggle, setTggle] = useState(false);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    const addPost = async()=>{
        const response = await axios.post("http://localhost:5000/addPost",{title,description,imageUrl});
        if(response && response.status==200)
        {
            alert(response.data.message);
        }
        else{
            alert(response.data.message || response.data.error);
        }
    }

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get("http://localhost:5000/getPost");
            if (response && response.status == 200) {
                setPosts(response.data.posts);
            }
            else {
                console.log(response.data.message || response.data.error)
            }
        }

        getData();
    }, [])


    console.log(posts)

    return (
        <>
            <div style={{ height: "80vh" }}>
                {posts && posts.map((post) => {
                    return <div key={post._id}>
                        <h2>{post.title}</h2>
                        <p>{post.description}</p>
                        <img src={post.imageUrl} />
                    </div>
                })
                }
                <button onClick={() => setTggle(true)}>+ Post Blog</button>
            </div>

            {toggle && <div style={{ position: "fixed", zIndex: "1", width: '100%', height: "100%", background: "rgba(0,0,0,0.6)", display: 'flex', justifyContent: "center", alignItems: "center", left: "0", top: "0" }}>
                <div style={{ height: "70%", width: "50%", background: "white", borderRadius: '8px' }}>
                    <button onClick={() => {
                        setTggle((prev) => !prev);
                    }}>X</button>
                    <label>Title: </label> <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                    <label>Description: </label> <input type="text" value={description} onChange={(e)=>setDescription(e.target.value)}/>
                   <label>ImageUrl: </label> <input type="text" value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)}/>

                   <button onClick={()=>addPost()}>Submit</button>    <button onClick={()=>setTggle(false)}>Close</button>
                </div>
            </div>}
        </>
    )
}

export default Profile;