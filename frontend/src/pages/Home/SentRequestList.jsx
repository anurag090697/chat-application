import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const SentRequestList = () => {
    const [requestList, setRequestList] = useState([]);
    useEffect(() => {
        const fetchRequestList = async () => {
            const response = await axios.get('http://localhost:3000/user/sent-requests');
            setRequestList(response.data.sentRequest);
        }
        fetchRequestList();
    }, []);
    return (
        <>
            {
                requestList.length == 0 ?
                    <h1>No Sent Request Found</h1> :
                    <div>
                        {
                            requestList.map(
                                user =>
                                    <div className='list-item'>
                                        <p>{user.username}</p>
                                    </div>
                            )
                        }
                    </div>
            }
        </>
    )
}

export default SentRequestList