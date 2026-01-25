import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const propertySchema = z.object({
    title: z.string().min(1),
    type: z.enum(['Retail', 'Office', 'Warehouse', 'Land']),
    status: z.enum(['Sale', 'Lease', 'Pre-Lease']),
    inventoryStatus: z.enum(['Active', 'Passive', 'Closed']).optional().default('Active'),
    source: z.string().min(1),
    location: z.string().min(1),
    locationLink: z.string().optional(),
    size: z.string().min(1),
    price: z.string().min(1),
    images: z.array(z.string()).optional(),
    documents: z.array(z.any()).optional(),
});

export const getProperties = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, status } = req.query;
        const where: any = {};
        if (type) where.type = type;
        if (status) where.status = status;

        const properties = await prisma.property.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { createdBy: { select: { name: true } } },
        });
        res.json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const property = await prisma.property.findUnique({
            where: { id: id as string },
            include: { createdBy: { select: { name: true } } },
        });
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = propertySchema.parse(req.body);
        const userId = (req as any).user?.id;

        const property = await prisma.property.create({
            data: {
                ...data,
                status: data.status === 'Pre-Lease' ? 'PreLease' : (data.status as any),
                createdBy: { connect: { id: userId } },
            },
        });

        // Log activity (async, fire and forget)
        prisma.activity.create({
            data: {
                userId,
                action: 'added a property',
                target: property.title,
                type: 'property',
            },
        }).catch(console.error);

        res.status(201).json(property);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.issues });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
