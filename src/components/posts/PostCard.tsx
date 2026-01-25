// PostCard.tsx
import React from 'react';
import './PostCard.css'; // Assuming you have a CSS file for styles

const PostCard = ({ title, content, imageUrl }) => {
    return (
        <div className="post-card">
            <img src={imageUrl} alt={title} className="post-card-image" />
            <h3 className="post-card-title">{title}</h3>
            <p className="post-card-content">{content}</p>
        </div>
    );
};

export default PostCard;
