import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(1),
    companyName: z.string().optional(),
    phone: z.string().min(10),
    type: z.enum(['Developer', 'Channel Partner', 'Brand', 'Investor']),
    location: z.string().optional(),
    remark: z.string().optional(),
});

export const getContacts = async (req: Request, res: Response): Promise<void> => {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = contactSchema.parse(req.body);
        const userId = (req as any).user?.id;

        const contact = await prisma.contact.create({
            data: {
                ...data,
                type: data.type === 'Channel Partner' ? 'ChannelPartner' : (data.type as any),
            },
        });

        // Log activity
        prisma.activity.create({
            data: {
                userId,
                action: 'added a contact',
                target: contact.name,
                type: 'contact',
            },
        }).catch(console.error);

        res.status(201).json(contact);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.issues });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
