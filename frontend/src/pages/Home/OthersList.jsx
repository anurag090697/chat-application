import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axiosInstance from '../../config/axios';

const OthersList = () => {
    const [otherUsers, setOtherusers] = useState([]);
    const [pageDetails, setPageDetails] = useState({
        currentPage: 1,
        totalPages: 1,
        limit: 10
    });
    const fetchUsers = async (currentPage) => {
        const response = await axiosInstance.get(`/user/other-users?page=${currentPage}&limit=${pageDetails.limit}`);
        setOtherusers(response.data.otherUsers);
        setPageDetails(response.data.pageDetails);
    }
    useEffect(() => {
        fetchUsers(1, 10);
    }, []);

    const handleSendRequest = async (requestUserId) => {
        const response = await axiosInstance.post('/user/send-request', {
            requestUserId
        });
        setOtherusers(response.data.otherUsers);
        setPageDetails(response.data.pageDetails);
    }
    console.log(pageDetails)
    return (
        <div className='list'>
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
            <div>
                <button disabled={1 == pageDetails.currentPage} onClick={() => fetchUsers(pageDetails.currentPage - 1)}>Previous</button>
                <span>Page {pageDetails.currentPage} of {pageDetails.totalPages}</span>
                <button disabled={pageDetails.totalPages == pageDetails.currentPage} onClick={() => fetchUsers(pageDetails.currentPage + 1)}>Next</button>
            </div>
        </div>
    )
}

export default OthersList