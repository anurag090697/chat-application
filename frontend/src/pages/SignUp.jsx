import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const SignUp = ({setUser}) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:3000/auth/sign-up", { username: userName, password });
        Cookies.set('token',response.data.token);
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
            <button type="submit">Sign Up</button>
        </form>
    )
}

export default SignUp