import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import axiosInstance from '../../config/axios';

const FriendsList = ({ setSelectedFriendId }) => {
  const [friendList, setFriendList] = useState([]);
  const [pageDetails, setPageDetails] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10
  });
  const fetchFriendList = async (currentPage) => {
    console.log(Cookies.get('token'))
    const response = await axiosInstance.get(`/user/friends?page=${currentPage}&limit=${pageDetails.limit}`);
    setFriendList(response.data.friends);
    setPageDetails(response.data.pageDetails);
  }
  useEffect(() => {
    fetchFriendList();
  }, []);
  return (
    <div className='friend-list'>
      <>
        {
          friendList.length == 0 ?
            <h1>No Friends Found</h1> :
            <div>
              {
                friendList.map(
                  user =>
                    <div onClick={() => setSelectedFriendId(user._id)} className='list-item friend-name'>
                      <p>{user.username}</p>
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

export default FriendsList