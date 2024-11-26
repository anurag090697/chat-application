import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'

const ReceivedRequestedList = () => {
    const [requestList, setRequestList] = useState([]);
    useEffect(() => {
        const fetchReceivedRequestList = async () => {
            const response = await axiosInstance.get('/user/received-requests');
            setRequestList(response.data.requests);
            console.log(response.data);
        }
        fetchReceivedRequestList();
    }, []);
    const handleAcceptRequest = async (requestUserId) => {
        const response = await axiosInstance.post('/user/accept-request', { requestUserId });
        console.log(response.data.receivedRequest);
        setRequestList(response.data.receivedRequest);
    }
    return (
        <>
            {
                requestList.length == 0 ?
                    <h1>No Received Request Found</h1> :
                    <div>
                        {
                            requestList.map(
                                user =>
                                    <div className='list-item'>
                                        <p>{user.username}</p>
                                        <button onClick={() => handleAcceptRequest(user._id)}>Accept Request</button>
                                    </div>
                            )
                        }
                    </div>
            }
        </>
    )
}

export default ReceivedRequestedList