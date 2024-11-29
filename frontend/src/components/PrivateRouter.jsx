import React, { useEffect } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axios';

const PrivateRouter = ({ children }) => {
    const token = Cookies.get('token');
    const navigate = useNavigate();
    console.log('from private')
    if (!token) {
        navigate('/sign-in');
    }
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axiosInstance.get('/check-auth');
                console.log(response.data);
            } catch (err) {
                navigate('/sign-in');
            }
        }
        checkAuth();
    }, [])
    return (
        <>
            {children}
        </>
    )
}

export default PrivateRouter