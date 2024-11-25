import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const OthersList = () => {
    const [otherUsers, setOtherusers] = useState([]);
    useEffect(() => {
        const fetchOtherusers = async () => {
            const response = await axios.get('http://localhost:3000/user/other-users', {
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get('token')
                }
            });
            setOtherusers(response.data.otherUsers);
            console.log(response.data);
        }
        fetchOtherusers();
    }, []);
    return (
        <>
            {
                otherUsers.length == 0 ?
                    <h1>No Other User Present</h1> :
                    <div>
                        {
                            otherUsers.map(
                                user => <h1>{user.username}</h1>
                            )
                        }
                    </div>
            }
        </>
    )
}

export default OthersList