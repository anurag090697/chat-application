import { Router } from "express";
import { UserModel } from "../models/user.js";
import asyncHandler from 'express-async-handler';
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post('/send-request', authMiddleware, asyncHandler(async (req, res) => {
    const { requestUserId } = req.body;
    // validation
    // check whether requestUserId is valid
    // whether it exists or not
    // requestUserId should not be the friend of user
    // requestUserId should not be a part of this user.requests array
    const updatedUser = await UserModel.findByIdAndUpdate(
        req.userId,
        { $push: { sent_request: requestUserId } },
        { new: true }
    );
    await UserModel.findByIdAndUpdate(
        requestUserId,
        { $push: { received_request: req.userId } },
        { new: true }
    );
    const otherUsers = await UserModel.find({
        _id: { $nin: [...updatedUser.friends, ...updatedUser.received_request, ...updatedUser.sent_request, req.userId] }
    });
    res.status(200).json({ otherUsers });
}));

router.get('/received-requests', authMiddleware, asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    const requests = await UserModel.find({
        _id: { $in: user.received_request }
    });
    res.status(200).json({ requests });
}));

router.post("/accept-request", authMiddleware, asyncHandler(async (req, res) => {
    const { requestUserId } = req.body;
    const user = await UserModel.findById(req.userId);
    console.log(user)
    const resultId = user.received_request.find(id => id == requestUserId);

    if (resultId) {
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.userId,
            { $pull: { received_request: requestUserId }, $push: { friends: requestUserId } },
            { new: true }
        );
        await UserModel.findByIdAndUpdate(
            requestUserId,
            { $pull: { sent_request: req.userId }, $push: { friends: req.userId } },
            { new: true }
        );
        res.status(200).json({ receivedRequest: updatedUser.received_request });
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
}));

router.get('/sent-requests', authMiddleware, asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    const sentRequest = await UserModel.find({
        _id: { $in: user.sent_request }
    });
    res.status(200).json({ sentRequest });
}));

router.get('/friends', authMiddleware, asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    const friends = await UserModel.find({
        _id: { $in: user.friends }
    });
    res.status(200).json({ friends });
}));

router.get('/other-users', authMiddleware, asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    console.log(user);
    const otherUsers = await UserModel.find({
        _id: { $nin: [...user.friends, ...user.received_request, ...user.sent_request, req.userId] }
    });
    res.status(200).json({ otherUsers });
}));

router.get('/', authMiddleware, asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    res.status(200).json({ user });
}));

export default router;