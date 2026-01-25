"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivity = exports.getGraphData = exports.getStats = void 0;
const prisma_1 = require("../lib/prisma");
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalProperties = yield prisma_1.prisma.property.count();
        const activeProperties = yield prisma_1.prisma.property.count({
            where: { inventoryStatus: 'Active' },
        });
        const totalContacts = yield prisma_1.prisma.contact.count();
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getStats = getStats;
const getGraphData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getGraphData = getGraphData;
const getActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activities = yield prisma_1.prisma.activity.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, avatarUrl: true },
                },
            },
        });
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getActivity = getActivity;
