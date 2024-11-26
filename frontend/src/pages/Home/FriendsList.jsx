import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'

const FriendsList = () => {
  const [friendList, setFriendList] = useState([]);
  useEffect(() => {
    const fetchFriendList = async () => {
      console.log(Cookies.get('token'))
      const response = await axios.get('http://localhost:3000/user/friends', {
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('token')
        }
      });
      console.log(response.data)
      setFriendList(response.data.friends);
    }
    fetchFriendList();
  }, []);
  return (
    <>
      {
        friendList.length == 0 ?
          <h1>No Friends Found</h1> :
          <div>
            {
              friendList.map(
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

export default FriendsList