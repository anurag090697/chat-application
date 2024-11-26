import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const OthersList = () => {
    const [otherUsers, setOtherusers] = useState([]);
    useEffect(() => {
        const fetchOtherusers = async () => {
            const response = await axiosInstance.get('/user/other-users', {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('token')
                }
            });
            setOtherusers(response.data.otherUsers);
            console.log(response.data);
        }
        fetchOtherusers();
    }, []);
    const handleSendRequest = async (requestUserId) => {
        const response = await axiosInstance.post('/user/send-request', {
            requestUserId
        }, {
            headers: {
                'Authorization': 'Bearer ' + Cookies.get('token')
            }
        });
        setOtherusers(response.data.otherUsers);
    }
    return (
        <>
            {
                otherUsers.length == 0 ?
                    <h1>No Other User Present</h1> :
                    <div>
                        {
                            otherUsers.map(
                                user =>
                                    <div className='list-item'>
                                        <p>{user.username}</p>
                                        <button onClick={() => handleSendRequest(user._id)}>Send Request</button>
                                    </div>
                            )
                        }
                    </div>
            }
        </>
    )
}

export default OthersList