import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { Server } from 'socket.io'; // Import Socket.IO 
import http from 'http';
import cors from 'cors';
import { connectToDatabase } from './config/connectToDatabase.js';
import authRoutes from './routes/authRoutes.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes, { sendChat } from './routes/chatRoute.js'

const app = express();

connectToDatabase();

app.use(cors({
    origin: process.env.FRONTEND_BASE_URL
}));

const server = http.createServer(app);

const io = new Server(server, { // Initialize Socket.IO
    cors: {
        origin: process.env.FRONTEND_BASE_URL, // Allow your frontend to connect
        methods: ['GET', 'POST']
    },
});

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

app.get('/check-auth', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Authenticated' });
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
    next();
});

// io.on('connection', (socket) => {
//     console.log('New client connected:', socket.id);

//     socket.on('joinRoom', (chatId) => {
//         socket.join(chatId);
//         console.log(`Client ${socket.id} joined room ${chatId}`);
//     });

//     // socket.on('sendMessage', async ({ chatId, senderId, content }) => {
//     //     console.log("new message")
//     //     console.log(chatId, senderId, content)
//     //     io.to(chatId).emit('receive_message', {
//     //         senderId,
//     //         content,
//     //         chatId, // Optionally include chatId for reference
//     //         timestamp: new Date().toISOString(), // Include timestamp for message order
//     //     });
//     // });

//     // Listen for incoming messages
//     socket.on("sendMessage", (data) => {
//         console.log("Message received:", data);
//         io.emit("receive_message", data+ " from backend"); // Broadcast to all clients
//     });

//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
// });

const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Register a user with their userId
    socket.on("register_user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`${userId} is online with socket id ${socket.id}`);
    });

    // Listen for private messages
    socket.on("send_private_message", ({ senderId, receiverId, message }) => {
        console.log('senderId: ', senderId)
        console.log('receiverId: ', receiverId)
        const receiverSocketId = onlineUsers.get(receiverId);
        const user1 = receiverId > senderId ? senderId : receiverId;
        const user2 = receiverId > senderId ? receiverId : senderId;

        sendChat(user1,user2,senderId,message)
        if (receiverSocketId) {
            console.log("going to emti receive_private_message " + receiverSocketId)
            io.to(receiverSocketId).emit("receive_private_message", { senderId, message });
        } else {
            console.log(`User ${receiverId} is not online`);
        }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                console.log(`${userId} has disconnected`);
                break;
            }
        }
    });
});

const PORT = process.env.PORT;
server.listen(PORT | 3000, () => {
    console.log(`Server is running on port ${PORT}`);
});