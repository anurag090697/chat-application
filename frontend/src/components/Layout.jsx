import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Layout = ({ user,setUser }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        Cookies.remove('token');
        setUser(null);
        navigate('/sign-in');
    }
    return (
        <>
            <navbar style={{ display: 'flex', 'justify-content': 'space-between' }}>
                <h1>{user ? user.username : 'Navbar'}</h1>
                {user && <button onClick={handleLogout}>Logout</button>}
            </navbar>
            <Outlet />
            <footer>
                <h1>Footer</h1>
            </footer>
        </>
    )
}

export default Layout