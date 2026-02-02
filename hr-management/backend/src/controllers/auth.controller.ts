import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { z } from 'zod';

export const register = async (req: Request, res: Response) => {
    try {
        const user = await authService.requestRegistration(req.body);
        res.status(201).json({ message: 'Registration successful', user });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const user = await authService.verifyCredentials(req.body);
        res.status(200).json({ message: 'Login successful', user });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        await authService.requestPasswordReset(req.body.email);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;
        await authService.resetPassword(token, newPassword);
        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { currentPassword, newPassword } = req.body;
        await authService.changePassword(userId, currentPassword, newPassword);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
