import { Router } from "express";
import { UserModel } from "../models/user.js";
import asyncHandler from 'express-async-handler';
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post('/send-user', authMiddleware, asyncHandler(async (req, res) => {
    const { requestUserId } = req.body;
    // validation
    // check whether requestUserId is valid
    // whether it exists or not
    // requestUserId should not be the friend of user
    // requestUserId should not be a part of this user.requests array
    const updatedUser = await UserModel.findByIdAndUpdate(
        req.userId,
        { $push: { requests: requestUserId } },
        { new: true }
    );
    res.status(200).json({ updatedRequests: updatedUser.requests });
}));

router.get('/all-requests', authMiddleware, asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    const requests = await UserModel.find({
        _id: { $in: user.requests }
    });
    res.status(200).json({ requests });
}));

router.get('/other-users', authMiddleware, asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    const otherUsers = await UserModel.find({
        _id: { $nin: [...user.friends, req.userId] }
    });
    res.status(200).json({ otherUsers });
}));

export default router;