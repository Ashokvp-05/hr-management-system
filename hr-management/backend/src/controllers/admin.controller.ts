import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import * as googleSheets from '../services/googleSheets.service';
import prisma from '../config/db';


export const getPendingUsers = async (req: Request, res: Response) => {
    try {
        const users = await adminService.getPendingUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const approveUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore - req.user is populated by authenticate middleware
        const adminId = req.user?.id;
        const user = await adminService.approveUser(id, adminId);
        res.json({ message: 'User approved', user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const rejectUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const adminId = req.user?.id;
        const user = await adminService.rejectUser(id, adminId);
        res.json({ message: 'User rejected', user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

import cache from '../config/cache';

export const getStats = async (req: Request, res: Response) => {
    try {
        const cached = cache.get("admin_stats");
        if (cached) return res.json(cached);

        const stats = await adminService.getDatabaseStats();
        cache.set("admin_stats", stats, 300); // Cache for 5 mins
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getOverview = async (req: Request, res: Response) => {
    try {
        const cached = cache.get("admin_overview");
        if (cached) return res.json(cached);

        const overview = await adminService.getDashboardOverview();
        cache.set("admin_overview", overview, 60); // Cache for 1 min
        res.json(overview);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const syncToSheets = async (req: Request, res: Response) => {
    try {
        const { spreadsheetId } = req.body;
        if (!spreadsheetId) {
            return res.status(400).json({ error: 'spreadsheetId is required' });
        }
        const result = await googleSheets.exportAttendanceToSheets(spreadsheetId);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await prisma.role.findMany();
        res.json(roles);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAuditLogs = async (req: Request, res: Response) => {
    try {
        // Fetch top 50 logs
        const logs = await prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        // Manually join Admin details (Name & Position)
        const adminIds = [...new Set(logs.map(log => log.adminId))].filter(Boolean);
        const admins = await prisma.user.findMany({
            where: { id: { in: adminIds } },
            select: { id: true, name: true, designation: true, department: true }
        });

        const adminMap = admins.reduce((acc: any, admin) => {
            acc[admin.id] = admin;
            return acc;
        }, {});

        const enrichedLogs = logs.map(log => ({
            ...log,
            admin: adminMap[log.adminId] || { name: 'Unknown System', designation: 'System' }
        }));

        res.json(enrichedLogs);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
