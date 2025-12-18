import pool from '../db.js';

export const getAllHowToParticipate = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM how_to_participate ORDER BY order_index ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching how to participate items:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

export const createHowToParticipate = async (req, res) => {
    try {
        const { section, title, content, order_index } = req.body;
        const result = await pool.query(`
      INSERT INTO how_to_participate (section, title, content, order_index)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [section, title, content, order_index]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
};

export const updateHowToParticipate = async (req, res) => {
    try {
        const { id } = req.params;
        const { section, title, content, order_index } = req.body;
        const result = await pool.query(`
      UPDATE how_to_participate
      SET section = COALESCE($1, section),
          title = COALESCE($2, title),
          content = COALESCE($3, content),
          order_index = COALESCE($4, order_index)
      WHERE id = $5
      RETURNING *
    `, [section, title, content, order_index, id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Failed to update item' });
    }
};

export const deleteHowToParticipate = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM how_to_participate WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
};
