import pool from '../db.js';

const createTable = async () => {
    try {
        console.log('Creating access_logs table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS access_logs (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES users(id),
                path TEXT NOT NULL,
                method TEXT DEFAULT 'GET',
                ip_address TEXT,
                user_agent TEXT,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                metadata JSONB DEFAULT '{}'::jsonb
            );
        `);
        console.log('Table access_logs created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
};

createTable();
