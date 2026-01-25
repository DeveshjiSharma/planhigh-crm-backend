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
exports.createContact = exports.getContacts = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    companyName: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(10),
    type: zod_1.z.enum(['Developer', 'Channel Partner', 'Brand', 'Investor']),
    location: zod_1.z.string().optional(),
    remark: zod_1.z.string().optional(),
});
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield prisma_1.prisma.contact.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(contacts);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getContacts = getContacts;
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = contactSchema.parse(req.body);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const contact = yield prisma_1.prisma.contact.create({
            data: Object.assign(Object.assign({}, data), { type: data.type === 'Channel Partner' ? 'ChannelPartner' : data.type }),
        });
        // Log activity
        prisma_1.prisma.activity.create({
            data: {
                userId,
                action: 'added a contact',
                target: contact.name,
                type: 'contact',
            },
        }).catch(console.error);
        res.status(201).json(contact);
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
exports.createContact = createContact;
