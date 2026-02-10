import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserStatus } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        roleId?: string;
        role?: string;
        status: UserStatus;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = decoded;

        // Check if user is active
        if (decoded.status !== UserStatus.ACTIVE && decoded.status !== UserStatus.PENDING) {  // Allow pending for now or specific check? usually strictly active.
            // For now, let's allow PENDING users to hit authenticated endpoints but maybe restrict specific actions.
            // Actually, usually only ACTIVE users should be able to do anything useful.
            if (decoded.status !== UserStatus.ACTIVE) {
                return res.status(403).json({ error: 'Account is not active' });
            }
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

import prisma from '../config/db';

export const authorize = (allowedRoles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.roleId) {
            return res.status(403).json({ error: 'Access denied: No role assigned' });
        }

        try {
            const role = await prisma.role.findUnique({
                where: { id: req.user.roleId }
            });

            if (!role || !allowedRoles.includes(role.name)) {
                return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error('Authorization error', error);
            res.status(500).json({ error: 'Authorization error' });
        }
    };
};

export const requireRole = authorize;
