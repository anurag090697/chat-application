import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import axiosInstance from '../config/axios';

const PublicRouter = ({ children }) => {
    const token = Cookies.get('token');
    const navigate = useNavigate();
    console.log('from private')
    // if (token) {
    //     navigate('/home');
    // }
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axiosInstance.get('/check-auth');
                console.log(response.data);
                navigate('/home');
            } catch (err) {
            }
        }
        token && checkAuth();
    }, [])
    return (
        <>
            {children}
        </>
    )
}

export default PublicRouter