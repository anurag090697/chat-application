import axios from 'axios';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ setUser }) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post("https://chat-application-backend-hrvk.onrender.com/auth/sign-in", { username: userName, password });
        Cookies.set('token', response.data.token);
        console.log(response.data)
        setUser({ id: response.data.id, username: response.data.username });
        navigate('/home');
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name='userName'
                onChange={e => setUserName(e.target.value)}
                value={userName}
                placeholder="Enter your username"
            />
            <input
                type="password"
                name='password'
                onChange={e => setPassword(e.target.value)}
                value={password}
                placeholder="Enter your password"
            />
            <button type="submit">Sign In</button>
        </form>
    );
}

export default SignIn