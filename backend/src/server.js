import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

import pool from './db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

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
            version: 'v1.2.0-base64-upload', // Prova de deploy v1.2
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

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Construct the full URL for production/local
        // In production (behind proxy), we should use the relative path or configure the base URL
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.get('host');
        // If behind Traefik strip-prefix, we might need adjustments, but normally /uploads is root-level or mapped.
        // For simplicity in this mono-repo setup:
        const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        res.json({ url: fileUrl });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
