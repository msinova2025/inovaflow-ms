import pool from '../db.js';

export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, role, organization, phone, cpf_cnpj, avatar_url } = req.body;
        const result = await pool.query(`
      UPDATE users
      SET full_name = COALESCE($1, full_name),
          role = COALESCE($2, role),
          organization = COALESCE($3, organization),
          phone = COALESCE($4, phone),
          cpf_cnpj = COALESCE($5, cpf_cnpj),
          avatar_url = COALESCE($6, avatar_url)
      WHERE id = $7
      RETURNING *
    `, [full_name, role, organization, phone, cpf_cnpj, avatar_url, id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
