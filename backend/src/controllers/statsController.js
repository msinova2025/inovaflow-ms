import pool from '../db.js';

export const getStats = async (req, res) => {
    try {
        const [challenges, solutions, events, users, accesses, accessesToday, accessTrend, deviceStats] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM challenges'),
            pool.query('SELECT COUNT(*) FROM solutions'),
            pool.query('SELECT COUNT(*) FROM events'),
            pool.query('SELECT COUNT(*) FROM users'),
            pool.query('SELECT COUNT(*) FROM access_logs'),
            pool.query('SELECT COUNT(*) FROM access_logs WHERE timestamp >= CURRENT_DATE'),
            pool.query(`
                SELECT TO_CHAR(timestamp, 'DD/MM') as date, COUNT(*) as count 
                FROM access_logs 
                WHERE timestamp >= NOW() - INTERVAL '7 days' 
                GROUP BY TO_CHAR(timestamp, 'DD/MM') 
                ORDER BY MIN(timestamp)
            `),
            pool.query(`
                SELECT metadata->>'platform' as platform, COUNT(*) as count 
                FROM access_logs 
                GROUP BY metadata->>'platform'
            `)
        ]);

        const challengesCount = parseInt(challenges.rows[0].count);
        const solutionsCount = parseInt(solutions.rows[0].count);

        res.json({
            challenges: challengesCount,
            solutions: solutionsCount,
            events: parseInt(events.rows[0].count),
            members: parseInt(users.rows[0].count),
            initiatives: challengesCount + solutionsCount,
            total_accesses: parseInt(accesses.rows[0].count),
            accesses_today: parseInt(accessesToday.rows[0].count),
            access_trend: accessTrend.rows,
            device_stats: deviceStats.rows
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

export const getAccessLogs = async (req, res) => {
    try {
        const { limit = 50, page = 1, start_date, end_date, path, user_id } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT a.*, u.full_name, u.email 
            FROM access_logs a 
            LEFT JOIN users u ON a.user_id = u.id 
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;

        if (start_date) {
            query += ` AND a.timestamp >= $${paramIndex++}`;
            params.push(start_date);
        }
        if (end_date) {
            query += ` AND a.timestamp <= $${paramIndex++}`;
            params.push(end_date);
        }
        if (path) {
            query += ` AND a.path ILIKE $${paramIndex++}`;
            params.push(`%${path}%`);
        }
        if (user_id) {
            query += ` AND a.user_id = $${paramIndex++}`;
            params.push(user_id);
        }

        query += ` ORDER BY a.timestamp DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching access logs:', error);
        res.status(500).json({ error: 'Failed to fetch access logs' });
    }
};

export const logAccess = async (req, res) => {
    try {
        const { path, user_agent, metadata } = req.body;
        const userId = req.user ? req.user.id : null; // From auth middleware if present

        // Get IP address (handling proxies)
        const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        await pool.query(
            'INSERT INTO access_logs (user_id, path, ip_address, user_agent, metadata) VALUES ($1, $2, $3, $4, $5)',
            [userId, path, ip_address, user_agent || req.headers['user-agent'], metadata]
        );

        res.status(201).json({ message: 'Access logged' });
    } catch (error) {
        console.error('Error logging access:', error);
        // Don't fail the request for logging errors
        res.status(200).json({ warning: 'Failed to log access' });
    }
};
