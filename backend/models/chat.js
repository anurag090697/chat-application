import mongoose from "mongoose";
// user1 and user2 will gonna be decide on alphabetic order
const chatSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chat: [
        {
            sendBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            content: {
                type: String,
                required: true,
                trim: true // Remove leading/trailing spaces
            },
            createdAt: {
                type: Date,
                default: Date.now // Each message gets its own timestamp
            }
        }
    ]
}, {
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

// Adding indexes for performance optimization
chatSchema.index({ user1: 1, user2: 1 });

export const ChatModel = mongoose.model('Chat', chatSchema);