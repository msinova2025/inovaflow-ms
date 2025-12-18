import pool from '../db.js';

export const getContent = async (req, res) => {
    try {
        const { type } = req.params;
        const result = await pool.query('SELECT content FROM site_contents WHERE type = $1', [type]);
        if (result.rows.length === 0) return res.json({ content: '' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Failed to fetch content' });
    }
};

export const updateContent = async (req, res) => {
    try {
        const { type } = req.params;
        const { content } = req.body;
        const result = await pool.query(`
      INSERT INTO site_contents (type, content)
      VALUES ($1, $2)
      ON CONFLICT (type) DO UPDATE SET content = $2, updated_at = NOW()
      RETURNING *
    `, [type, content]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({ error: 'Failed to update content' });
    }
};
