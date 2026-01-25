"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_1 = require("../controllers/contact");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, contact_1.getContacts);
router.post('/', auth_1.authenticate, contact_1.createContact);
exports.default = router;
