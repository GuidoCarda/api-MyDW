import { Request, Response } from 'express';
import User from '../../models/User';
import Post from '../../models/Post';

const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const post = new Post({ title, content, user: userId });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
};

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().populate('user', 'username email');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve posts' });
    }
};

const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate('user', 'username email');

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve post' });
    }
};

const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const post = await Post.findByIdAndUpdate(id, { title, content }, { new: true });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
};

const hardDeletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
};

const softDeletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const post = await Post.findByIdAndUpdate(id, { isActive: false });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to soft delete post' });
    }
};

export default { createPost, getAllPosts, getPostById, updatePost, hardDeletePost, softDeletePost };