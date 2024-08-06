// Assuming you are using React with functional components and hooks
import { useState, useEffect } from 'react';
import './index.css'; // Import your CSS file for styling
import DashboardHeader from '../DashboardHeader';

const PostsList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts when the component mounts
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3000/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        console.log(data)
      } else {
        console.error('Error fetching posts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    }
  };

  return (
    <>
    <DashboardHeader/>
    <div className="posts-container">
      <h1>Posts</h1>
      <ul className="posts-list">
        {posts.map(post => (
          <li key={post._id} className="post-card">
            <img src = {post.image} alt = "ime" style={{height:"250px",width:"80%"}}/>
            <p>Content:{post.content}</p>
            <p>Author: {post.author}</p>
            <p>{new Date(post.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default PostsList;
