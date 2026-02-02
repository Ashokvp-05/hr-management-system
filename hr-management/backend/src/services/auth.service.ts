import prisma from '../config/db';
import { User, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'crypto';
import * as emailService from './email.service';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const requestRegistration = async (data: z.infer<typeof registerSchema>) => {
    const { email, password, name } = registerSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            status: UserStatus.ACTIVE,
        },
    });

    return { id: user.id, email: user.email, status: user.status };
};

export const verifyCredentials = async (data: z.infer<typeof loginSchema>) => {
    const { email, password } = loginSchema.parse(data);

    const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true }
    });

    if (!user) {
        console.log('User not found:', email);
        throw new Error('Invalid credentials');
    }

    // Cast user to any to avoid TS errors with potentially stale Prisma types
    const userWithPassword = user as any;

    if (!userWithPassword.password) {
        throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, userWithPassword.password);

    if (!isValid) {
        console.log('Password mismatch for user:', email);
        throw new Error('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
        // In a real app we might allow login but restrict access, or deny login.
        // For now, let's allow it but the frontend should handle the PENDING state.
        // OR deny it:
        // throw new Error(`Account is ${user.status}`);
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            roleId: user.roleId,
            status: user.status
        },
        process.env.JWT_SECRET || 'super-secret-key',
        { expiresIn: '1d' }
    );

    // Return user info sans password
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            roleId: user.roleId,
            role: user.role?.name,
            status: user.status
        }
    };
};

export const requestPasswordReset = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        // We don't want to leak user existence, but for internal HR app it might be fine.
        // However, let's keep it safe. In a real app we'd just return success regardless.
        throw new Error('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetToken: token,
            resetTokenExpiry: expiry,
        },
    });

    // Send email
    await emailService.sendPasswordResetEmail(user.email, token);
};

export const resetPassword = async (token: string, newPassword: string) => {
    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: {
                gt: new Date(),
            },
        },
    });

    if (!user) {
        throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        },
    });
};

export const changePassword = async (userId: string, currentPass: string, newPass: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) throw new Error("User not found");

    const isValid = await bcrypt.compare(currentPass, user.password);
    if (!isValid) throw new Error("Incorrect current password");

    const hashedPassword = await bcrypt.hash(newPass, 10);
    return prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });
};
