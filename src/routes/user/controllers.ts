import { Request, Response } from 'express';
import User from '../../models/User';
import admin from '../../firebase';

const createUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name, lastname } = req.body;
        const userRecord = await admin.auth().createUser({
            email,
            password
        });

        const user = new User({ name, lastname, email, uid: userRecord.uid, isActive: true });
        await user.save();

        res.status(201).json({'Usuario creado': user, 'Registro de usuario': userRecord });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user', details: error });
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        const user = await User.findByIdAndUpdate(id, { username, email, password }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

const hardDeleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

const softDeleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(id, { isActive: false });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to soft delete user' });
    }
};

export default { createUser, getAllUsers, getUserById, updateUser, hardDeleteUser, softDeleteUser };