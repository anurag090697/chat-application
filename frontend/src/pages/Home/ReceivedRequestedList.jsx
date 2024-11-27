import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import axiosInstance from '../../config/axios';

const ReceivedRequestedList = () => {
    const [requestList, setRequestList] = useState([]);
    const [pageDetails, setPageDetails] = useState({
        currentPage: 1,
        totalPages: 1,
        limit: 10
    });
    const fetchReceivedRequestList = async (currentPage) => {
        const response = await axiosInstance.get(`/user/received-requests?page=${currentPage}&limit=${pageDetails.limit}`);
        setRequestList(response.data.requests);
        setPageDetails(response.data.pageDetails);
    }
    useEffect(() => {
        fetchReceivedRequestList();
    }, []);
    const handleAcceptRequest = async (requestUserId) => {
        const response = await axiosInstance.post('/user/accept-request', { requestUserId });
        setRequestList(response.data.requests);
        setPageDetails(response.data.pageDetails);
    }
    return (
        <div className='list'>
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
            <div>
                <button disabled={1 == pageDetails.currentPage} onClick={() => fetchUsers(pageDetails.currentPage - 1)}>Previous</button>
                <span>Page {pageDetails.currentPage} of {pageDetails.totalPages}</span>
                <button disabled={pageDetails.totalPages == pageDetails.currentPage} onClick={() => fetchUsers(pageDetails.currentPage + 1)}>Next</button>
            </div>
        </div>
    )
}

export default ReceivedRequestedList