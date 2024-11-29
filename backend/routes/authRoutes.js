import { Router } from "express";
import { UserModel } from "../models/user.js";
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/sign-up', asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }


    const newUser = await new UserModel({ username, password }).save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    res.status(201).json({ id: newUser._id, username: newUser.username, token });
}));

router.post('/sign-in', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: "Invalid Creds" });
    } else {
        if (user.password == password) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
            res.status(200).json({ message: 'LoggedIn Successfully', token, user });
        } else {
            res.status(401).json({ message: 'Invalid Creds' })
        }
    }
}));

export default router;