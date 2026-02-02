import { Request, Response } from 'express';
import * as leaveService from '../services/leave.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { LeaveType, LeaveStatus } from '@prisma/client';
import { z } from 'zod';

const createRequestSchema = z.object({
    type: z.any(), // Temporary fix for stale enum cache
    startDate: z.string().datetime().or(z.string()), // Accept ISO string
    endDate: z.string().datetime().or(z.string()),
    reason: z.string().optional()
});

export const createRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const validation = createRequestSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }

        const data = validation.data;
        const request = await leaveService.createRequest({
            userId,
            type: data.type,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            reason: data.reason
        });

        res.json(request);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getMyRequests = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const requests = await leaveService.getUserRequests(userId);
        res.json(requests);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getBalance = async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthRequest).user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const balance = await leaveService.getBalance(userId);
        res.json(balance);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllRequests = async (req: Request, res: Response) => {
    try {
        const requests = await leaveService.getAllRequests();
        res.json(requests);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const approveRequest = async (req: Request, res: Response) => {
    try {
        const adminId = (req as AuthRequest).user?.id;
        if (!adminId) return res.status(401).json({ error: 'Unauthorized' });

        const { id } = req.params;
        const request = await leaveService.updateStatus(id, LeaveStatus.APPROVED, adminId);
        res.json(request);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const rejectRequest = async (req: Request, res: Response) => {
    try {
        const adminId = (req as AuthRequest).user?.id;
        if (!adminId) return res.status(401).json({ error: 'Unauthorized' });

        const { id } = req.params;
        const { reason } = req.body;
        const request = await leaveService.updateStatus(id, LeaveStatus.REJECTED, adminId, reason);
        res.json(request);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
