import React from 'react';
import { useMediaQuery } from 'react-responsive';
import './Login.css'; // Assume we create a CSS file for styles

const Login = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <div className={`login-container${isMobile ? ' mobile' : ''}`}> 
            <h2 className="login-title">Login to Your Account</h2>
            <form className="login-form">
                <input type="text" placeholder="Username" className="login-input" required />
                <input type="password" placeholder="Password" className="login-input" required />
                <button type="submit" className="login-button">Login</button>
            </form>
            <p className="login-footer">Don't have an account? <a href="/register">Sign up here</a></p>
        </div>
    );
};

export default Login;