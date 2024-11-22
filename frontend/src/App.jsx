import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const socket = useRef();

  console.log(chatHistory)
  useEffect(() => {
    socket.current = io("http://localhost:3000");
    socket.current.on('connect', () => {
      console.log("Connections established");
    });

    const chatId = 123; // Replace with the actual chatId the user is interacting with
    socket.current.emit("joinRoom", chatId);

    socket.current.on("newMessage", (newMessage) => {
      console.log("New message received: ", newMessage);
      setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]);
    });

    return () => {
      socket.current.off("newMessage");
      socket.current.off("joinRoom");
      socket.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const messageData = {
      content: message,
      chatId: 123,
      senderId: {
        _id: 123, // Wrap the senderId as an object
      },
      timestamp: new Date().toISOString(), // Include a timestamp if needed
    };
    socket.current.emit("sendMessage", messageData);
  }

  return (
    <>
      <input type="text" onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send Message</button>
    </>
  )
}

export default App
