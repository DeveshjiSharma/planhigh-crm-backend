import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Create Users
    const passwordHash = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@planhigh.com' },
        update: {},
        create: {
            email: 'admin@planhigh.com',
            name: 'Admin User',
            passwordHash,
            role: 'admin',
            avatarUrl: 'https://i.pravatar.cc/150?u=admin',
        },
    });

    const agent = await prisma.user.upsert({
        where: { email: 'agent@planhigh.com' },
        update: {},
        create: {
            email: 'agent@planhigh.com',
            name: 'John Agent',
            passwordHash,
            role: 'agent',
            avatarUrl: 'https://i.pravatar.cc/150?u=agent',
        },
    });

    console.log('Created users:', { admin, agent });

    // 2. Create Contacts
    const contact1 = await prisma.contact.create({
        data: {
            name: 'Ravi Kumar',
            companyName: 'Prestige Group',
            phone: '9876543210',
            type: 'Developer',
            location: 'Bangalore',
            remark: 'Interested in commercial land in Whitefield',
        },
    });

    const contact2 = await prisma.contact.create({
        data: {
            name: 'Sarah Smith',
            companyName: 'WeWork',
            phone: '9898989898',
            type: 'Brand',
            location: 'Mumbai',
            remark: 'Looking for office space',
        },
    });

    console.log('Created contacts:', { contact1, contact2 });

    // 3. Create Properties
    const prop1 = await prisma.property.create({
        data: {
            title: 'Premium Office Space in CBD',
            type: 'Office',
            status: 'Lease',
            inventoryStatus: 'Active',
            source: 'Direct',
            location: 'MG Road, Bangalore',
            size: '5000 sqft',
            price: '1.5 Lakh/month',
            createdBy: { connect: { id: agent.id } },
            images: [
                "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80"
            ],
        },
    });

    const prop2 = await prisma.property.create({
        data: {
            title: 'Industrial Warehouse',
            type: 'Warehouse',
            status: 'Sale',
            inventoryStatus: 'Active', // Defaults to Active if not provided, but good to be explicit
            source: 'Channel Partner',
            location: 'Peenya, Bangalore',
            size: '10000 sqft',
            price: '5 Cr',
            createdBy: { connect: { id: admin.id } }, // Created by Admin
            images: [
                "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
            ],
        },
    });

    console.log('Created properties:', { prop1, prop2 });

    // 4. Create Activities
    await prisma.activity.create({
        data: {
            userId: agent.id,
            action: 'added a property',
            target: prop1.title,
            type: 'property',
        },
    });

    await prisma.activity.create({
        data: {
            userId: admin.id,
            action: 'added a contact',
            target: contact1.name,
            type: 'contact',
        },
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
