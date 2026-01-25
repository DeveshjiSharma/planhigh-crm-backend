import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authenticate } from './middleware/auth';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => {
    res.send('API is running...');
});

import authRoutes from './routes/auth';
import propertyRoutes from './routes/property';
import contactRoutes from './routes/contact';
import dashboardRoutes from './routes/dashboard';

// Import routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes); // Authenticate is already in route files but can double down or remove here
app.use('/api/properties', propertyRoutes); // Middleware is inside route file
app.use('/api/contacts', contactRoutes); // Middleware is inside route file

export default app;
