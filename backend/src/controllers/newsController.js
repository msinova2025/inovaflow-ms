import pool from '../db.js';

export const getAllNews = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const result = await pool.query('SELECT * FROM news ORDER BY published_at DESC LIMIT $1', [limit]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
};

export const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'News not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching news item:', error);
        res.status(500).json({ error: 'Failed to fetch news item' });
    }
};
export const createNews = async (req, res) => {
    try {
        const { title, summary, content, image_url, published_at } = req.body;
        const result = await pool.query(`
      INSERT INTO news (title, summary, content, image_url, published_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [title, summary, content, image_url, published_at]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating news:', error);
        res.status(500).json({ error: 'Failed to create news' });
    }
};

export const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, summary, content, image_url, published_at } = req.body;
        const result = await pool.query(`
      UPDATE news
      SET title = COALESCE($1, title),
          summary = COALESCE($2, summary),
          content = COALESCE($3, content),
          image_url = COALESCE($4, image_url),
          published_at = COALESCE($5, published_at)
      WHERE id = $6
      RETURNING *
    `, [title, summary, content, image_url, published_at, id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'News not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating news:', error);
        res.status(500).json({ error: 'Failed to update news' });
    }
};

export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM news WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'News not found' });
        res.json({ message: 'News deleted successfully' });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ error: 'Failed to delete news' });
    }
};
