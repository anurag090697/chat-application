import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { Server } from 'socket.io'; // Import Socket.IO 
import http from 'http';
import cors from 'cors';
import { connectToDatabase } from './config/connectToDatabase.js';
import authRoutes from './routes/authRoutes.js';
import { authMiddleware } from './middleware/authMiddleware.js';

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
app.get('/abc',authMiddleware,(req,res)=>{
    res.status(201).json({message: 'iweno'});
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
    next();
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', (chatId) => {
        socket.join(chatId);
        console.log(`Client ${socket.id} joined room ${chatId}`);
    });

    socket.on('sendMessage', async ({ chatId, senderId, content }) => {
        console.log("new message")
        console.log(chatId, senderId, content)
        io.to(chatId).emit('newMessage', {
            senderId,
            content,
            chatId, // Optionally include chatId for reference
            timestamp: new Date().toISOString(), // Include timestamp for message order
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT;
server.listen(PORT | 3000, () => {
    console.log(`Server is running on port ${PORT}`);
});