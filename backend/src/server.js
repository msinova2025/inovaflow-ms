import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

import pool from './db.js';

// Health check endpoints
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'MS INOVA MAIS API is running' });
});

app.get('/api/status', async (req, res) => {
    try {
        const dbCheck = await pool.query('SELECT NOW()');

        // Adicional: Verificar se as tabelas existem
        let schemaOk = false;
        try {
            await pool.query('SELECT id FROM users LIMIT 1');
            schemaOk = true;
        } catch (e) {
            schemaOk = false;
        }

        res.json({
            status: 'online',
            api: 'ok',
            database: 'connected',
            schema: schemaOk ? 'initialized' : 'missing_tables',
            timestamp: dbCheck.rows[0].now,
            info: schemaOk ? 'All systems operational' : 'Database connected but tables are missing. Please run schema.sql'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            api: 'ok',
            database: 'disconnected',
            error: error.message
        });
    }
});

// Routes
import challengeRoutes from './routes/challenges.js';
import solutionRoutes from './routes/solutions.js';
import statsRoutes from './routes/stats.js';
import newsRoutes from './routes/news.js';
import eventsRoutes from './routes/events.js';
import geralRoutes from './routes/geral.js';
import userRoutes from './routes/users.js';
import contentRoutes from './routes/contents.js';
import howToParticipateRoutes from './routes/how-to-participate.js';
import programRoutes from './routes/program.js';
import authRoutes from './routes/auth.js';

app.use('/api/challenges', challengeRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/geral', geralRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/how-to-participate', howToParticipateRoutes);
app.use('/api/program', programRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
