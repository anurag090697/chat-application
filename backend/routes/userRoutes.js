import { Router } from "express";
import { UserModel } from "../models/user.js";
import asyncHandler from 'express-async-handler';
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post('/send-request', authMiddleware, asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

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
    }).skip(skip)
        .limit(limit);

    const totalUsers = (await UserModel.countDocuments()) -
        (updatedUser.sent_request.length + updatedUser.received_request.length + updatedUser.friends.length + 1);
        
    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({ otherUsers, pageDetails: { currentPage: page, limit, totalPages } });
}));

router.get('/received-requests', authMiddleware, asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await UserModel.findById(req.userId);
    const requests = await UserModel.find({
        _id: { $in: user.received_request }
    })
        .skip(skip)
        .limit(limit);
    const totalUsers = requests.length;
    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({ requests, pageDetails: { currentPage: page, limit, totalPages } });
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

        const requests = await UserModel.find({
            _id: { $in: updatedUser.received_request }
        })
            .skip(skip)
            .limit(limit);
        const totalUsers = requests.length;
        const totalPages = Math.ceil(totalUsers / limit);
        res.status(200).json({ requests, pageDetails: { currentPage: page, limit, totalPages } });
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
}));

router.get('/sent-requests', authMiddleware, asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await UserModel.findById(req.userId);
    const sentRequest = await UserModel.find({
        _id: { $in: user.sent_request }
    })
        .skip(skip)
        .limit(limit);
    const totalUsers = user.friends.length;
    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({ sentRequest, pageDetails: { currentPage: page, limit, totalPages } });
}));

router.get('/friends', authMiddleware, asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await UserModel.findById(req.userId);
    const friends = await UserModel.find({
        _id: { $in: user.friends }
    })
        .skip(skip)
        .limit(limit);
    const totalUsers = user.friends.length;
    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({ friends, pageDetails: { currentPage: page, limit, totalPages } });
}));

router.get('/other-users', authMiddleware, asyncHandler(async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await UserModel.findById(req.userId);
    console.log(user);
    const otherUsers = await UserModel.find({
        _id: { $nin: [...user.friends, ...user.received_request, ...user.sent_request, req.userId] }
    })
        .skip(skip)
        .limit(limit);
    const totalUsers = (await UserModel.countDocuments()) -
        (user.sent_request.length + user.received_request.length + user.friends.length + 1);
    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({ otherUsers, pageDetails: { currentPage: page, limit, totalPages } });
}));

router.get('/', authMiddleware, asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    res.status(200).json({ user });
}));

export default router;