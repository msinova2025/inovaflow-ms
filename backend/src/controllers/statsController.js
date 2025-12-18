import pool from '../db.js';

export const getStats = async (req, res) => {
    try {
        const [challenges, solutions, events, users] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM challenges'),
            pool.query('SELECT COUNT(*) FROM solutions'),
            pool.query('SELECT COUNT(*) FROM events'),
            pool.query('SELECT COUNT(*) FROM users')
        ]);

        const challengesCount = parseInt(challenges.rows[0].count);
        const solutionsCount = parseInt(solutions.rows[0].count);

        res.json({
            challenges: challengesCount,
            solutions: solutionsCount,
            events: parseInt(events.rows[0].count),
            members: parseInt(users.rows[0].count),
            initiatives: challengesCount + solutionsCount
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};
