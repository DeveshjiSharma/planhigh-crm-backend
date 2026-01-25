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
exports.createProperty = exports.getProperty = exports.getProperties = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const propertySchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    type: zod_1.z.enum(['Retail', 'Office', 'Warehouse', 'Land']),
    status: zod_1.z.enum(['Sale', 'Lease', 'Pre-Lease']),
    inventoryStatus: zod_1.z.enum(['Active', 'Passive', 'Closed']).optional().default('Active'),
    source: zod_1.z.string().min(1),
    location: zod_1.z.string().min(1),
    locationLink: zod_1.z.string().optional(),
    size: zod_1.z.string().min(1),
    price: zod_1.z.string().min(1),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    documents: zod_1.z.array(zod_1.z.any()).optional(),
});
const getProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, status } = req.query;
        const where = {};
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        const properties = yield prisma_1.prisma.property.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { createdBy: { select: { name: true } } },
        });
        res.json(properties);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getProperties = getProperties;
const getProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const property = yield prisma_1.prisma.property.findUnique({
            where: { id: id },
            include: { createdBy: { select: { name: true } } },
        });
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getProperty = getProperty;
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = propertySchema.parse(req.body);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const property = yield prisma_1.prisma.property.create({
            data: Object.assign(Object.assign({}, data), { status: data.status === 'Pre-Lease' ? 'PreLease' : data.status, createdBy: { connect: { id: userId } } }),
        });
        // Log activity (async, fire and forget)
        prisma_1.prisma.activity.create({
            data: {
                userId,
                action: 'added a property',
                target: property.title,
                type: 'property',
            },
        }).catch(console.error);
        res.status(201).json(property);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: error.issues });
            return;
        }
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createProperty = createProperty;
