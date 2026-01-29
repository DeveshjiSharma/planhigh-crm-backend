import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '7d' }
        );

        await prisma.user.update({
            where: { id: user.id },
            data: { 
                lastLogin: new Date(),
                refreshToken: refreshToken 
            },
        });

        res.json({
            token,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
                avatarUrl: user.avatarUrl,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.issues });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const refresh = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = refreshSchema.parse(req.body);

        // 1. Verify verify signature
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string };

        // 2. Check if token exists in DB (Revocation check)
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user || user.refreshToken !== refreshToken) {
            res.status(403).json({ message: 'Invalid refresh token' });
            return;
        }

        // 3. Rotate tokens
        const newToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '7d' }
        );

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
        });

        res.json({
            token: newToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.issues });
            return;
        }
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        if (userId) {
            await prisma.user.update({
                where: { id: userId },
                data: { refreshToken: null },
            });
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatarUrl: true,
                createdAt: true,
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

