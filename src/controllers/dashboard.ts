import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalProperties = await prisma.property.count();
        const activeProperties = await prisma.property.count({
            where: { inventoryStatus: 'Active' },
        });
        const totalContacts = await prisma.contact.count();

        // Placeholder for "pendingFollowUps" as it wasn't strictly defined in schema, assuming it might be related to activities or just a mock for now based on prompt requirements
        // Prompt says: "pendingFollowUps": 12
        // I'll return a real count of contacts as a proxy or 0 if no specific logic
        const pendingFollowUps = 0;

        res.json({
            totalProperties,
            activeProperties,
            totalContacts,
            pendingFollowUps,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getGraphData = async (req: Request, res: Response): Promise<void> => {
    try {
        // Mock data for graph as requested in design
        // In a real app, this would aggregate from activities or analytics table
        const data = [
            { name: 'Mon', visits: 4, calls: 12 },
            { name: 'Tue', visits: 7, calls: 18 },
            { name: 'Wed', visits: 5, calls: 10 },
            { name: 'Thu', visits: 9, calls: 22 },
            { name: 'Fri', visits: 12, calls: 30 },
            { name: 'Sat', visits: 8, calls: 20 },
            { name: 'Sun', visits: 6, calls: 15 },
        ];
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getActivity = async (req: Request, res: Response): Promise<void> => {
    try {
        const activities = await prisma.activity.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, avatarUrl: true },
                },
            },
        });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
