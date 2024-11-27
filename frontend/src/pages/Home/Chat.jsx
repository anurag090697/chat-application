import React, { useEffect } from 'react'
import axiosInstance from '../../config/axios'

const Chat = ({ selectedFriendId }) => {
    const fetchChatHistory = async () => {
        const resposne = await axiosInstance.post('/chat/history', {
            receiver: selectedFriendId
        });
        console.log(resposne.data);
    }
    useEffect(() => {

        selectedFriendId && fetchChatHistory();
    }, [selectedFriendId])
    return (
        <div>Chat</div>
    )
}

export default Chat