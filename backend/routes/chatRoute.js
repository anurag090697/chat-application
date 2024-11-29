import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import expressAsyncHandler from 'express-async-handler';
import { ChatModel } from '../models/chat.js';

const route = Router();

export const sendChat = expressAsyncHandler(async (user1,user2,sender, content) => {
    const document = await ChatModel.findOne({ user1, user2 });

    if (null == document) {
        const savedDocument = await new ChatModel({
            user1,
            user2,
            chat: [{
                sendBy: sender,
                content
            }]
        }).save();
        return savedDocument;
    } else {
        const updatedDocument = await ChatModel.findByIdAndUpdate(
            document._id,
            {
                $push: {
                    chat: {
                        sendBy: sender,
                        content
                    }
                }
            },
            { new: true } // Return the updated document
        );
        return updatedDocument;
    }
});

route.post('/send', authMiddleware, expressAsyncHandler(async (req, res) => {
    const { receiver, content } = req.body;
    const sender = req.userId;
    const user1 = receiver > sender ? sender : receiver;
    const user2 = receiver > sender ? receiver : sender;
    const document = await sendChat(user1, user2,sender, content);
    res.status(201).json({ chatHistory: document });
}));

route.post('/history', authMiddleware, expressAsyncHandler(async (req, res) => {
    const { receiver } = req.body;
    const sender = req.userId;
    const user1 = receiver > sender ? sender : receiver;
    const user2 = receiver > sender ? receiver : sender;
    const chatHistory = await ChatModel.findOne({ user1, user2 });
    res.status(200).json({ chatHistory });
}));

export default route;