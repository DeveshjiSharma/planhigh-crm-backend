"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = require("./middleware/auth");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// Health check
app.get('/', (req, res) => {
    res.send('API is running...');
});
const auth_2 = __importDefault(require("./routes/auth"));
const property_1 = __importDefault(require("./routes/property"));
const contact_1 = __importDefault(require("./routes/contact"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
// Import routes
app.use('/api/auth', auth_2.default);
app.use('/api/dashboard', auth_1.authenticate, dashboard_1.default); // Authenticate is already in route files but can double down or remove here
app.use('/api/properties', property_1.default); // Middleware is inside route file
app.use('/api/contacts', contact_1.default); // Middleware is inside route file
exports.default = app;
