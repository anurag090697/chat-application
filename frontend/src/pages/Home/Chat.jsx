import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../config/axios';
import './home.css'
import io from "socket.io-client";
import { nanoid } from 'nanoid'


const Chat = ({ selectedFriendId, user }) => {
    const [currentChat, setCurrentChat] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const socket = useRef();
    console.log(selectedFriendId)
    useEffect(() => {
        if (user) {
            socket.current = io("https://chat-application-backend-hrvk.onrender.com");
            socket.current.emit("register_user", user._id);
        }
    }, [user]);
    useEffect(() => {
        setChatHistory([]);
        if (socket.current) {
            // Listen for incoming messages
            socket.current.on("receive_private_message", ({ senderId, message }) => {
                // setChat((prevChat) => [...prevChat, { senderId, message }]);
                console.log(senderId, message)
                setChatHistory((prevChat) => [...prevChat, { sendBy: senderId, content: message }]);
            });

            // Clean up on component unmount
            return () => {
                console.log('user is going to be offlie')
                socket.current.off("receive_private_message");
            };
        }
    }, [selectedFriendId]);

    const fetchChatHistory = async () => {
        const resposne = await axiosInstance.post('/chat/history', {
            receiver: selectedFriendId
        });
        // console.log(resposne.data.chatHistory.chat);

        setChatHistory(resposne.data.chatHistory ? resposne.data.chatHistory.chat : []);
    }
    useEffect(() => {
        selectedFriendId && fetchChatHistory();
    }, [selectedFriendId]);
    console.log(user)
    const sendChat = async (e) => {
        e.preventDefault();
        // const response = await axiosInstance.post('/chat/send', {
        //     receiver: selectedFriendId,
        //     content: currentChat
        // });
        socket.current.emit("send_private_message", { senderId: user._id, receiverId: selectedFriendId, message: currentChat });
        // console.log(response.data.chatHistory);
        setChatHistory(prevChat => [...prevChat, { sendBy: user._id, content: currentChat }])
        setCurrentChat('');
    }
    return (
        <>
            {
                selectedFriendId ?
                    <>
                        <div className='chat-container'>
                            <div className='chat-history-container'>
                                {
                                    chatHistory.map(chat => (
                                        <div key={nanoid()}
                                            className={chat.sendBy == selectedFriendId ? 'left-chat chat-content' : 'right-chat chat-content'}>
                                            {chat.content}
                                        </div>
                                    ))
                                }
                            </div>
                            < form onSubmit={sendChat} className='chat-form' >
                                <input type="text" onChange={(e) => setCurrentChat(e.target.value)} value={currentChat} />
                                <input type="submit" value="Send" />
                            </form >
                        </div >
                    </>
                    : <h1>Please Select Friend</h1>
            }
        </>
    )
}

export default Chat