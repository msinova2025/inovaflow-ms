import pool from '../db.js';

export const getAllProgramInfo = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM program_info ORDER BY order_index ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching program info:', error);
        res.status(500).json({ error: 'Failed to fetch program info' });
    }
};

export const createProgramInfo = async (req, res) => {
    try {
        const { title, content, section, order_index } = req.body;
        const result = await pool.query(`
      INSERT INTO program_info (title, content, section, order_index)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [title, content, section, order_index]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating program info:', error);
        res.status(500).json({ error: 'Failed to create program info' });
    }
};

export const updateProgramInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, section, order_index } = req.body;
        const result = await pool.query(`
      UPDATE program_info
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          section = COALESCE($3, section),
          order_index = COALESCE($4, order_index)
      WHERE id = $5
      RETURNING *
    `, [title, content, section, order_index, id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Program info not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating program info:', error);
        res.status(500).json({ error: 'Failed to update program info' });
    }
};

export const deleteProgramInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM program_info WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Program info not found' });
        res.json({ message: 'Program info deleted successfully' });
    } catch (error) {
        console.error('Error deleting program info:', error);
        res.status(500).json({ error: 'Failed to delete program info' });
    }
};
