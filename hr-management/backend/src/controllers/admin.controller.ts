import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import * as googleSheets from '../services/googleSheets.service';


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
        const user = await adminService.approveUser(id);
        res.json({ message: 'User approved', user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const rejectUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await adminService.rejectUser(id);
        res.json({ message: 'User rejected', user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await adminService.getDatabaseStats();
        res.json(stats);
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


