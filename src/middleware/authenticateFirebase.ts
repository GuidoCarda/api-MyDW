import { Request, Response, NextFunction } from 'express';
import admin from '../firebase';

const authenticateFirebase = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        (req as any).user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized', details: error });
    }
};

export default authenticateFirebase;