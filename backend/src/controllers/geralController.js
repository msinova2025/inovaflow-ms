import pool from '../db.js';

export const getGeral = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM geral LIMIT 1');
        if (result.rows.length === 0) {
            return res.json({});
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching geral data:', error);
        res.status(500).json({ error: 'Failed to fetch geral data' });
    }
};

export const updateGeral = async (req, res) => {
    try {
        const { id } = req.params;
        const { contact_phone, facebook_url, instagram_url, linkedin_url, youtube_url, ouvidoria_url, transparencia_url, servicos_url } = req.body;

        const result = await pool.query(`
      UPDATE geral
      SET contact_phone = COALESCE($1, contact_phone),
          facebook_url = COALESCE($2, facebook_url),
          instagram_url = COALESCE($3, instagram_url),
          linkedin_url = COALESCE($4, linkedin_url),
          youtube_url = COALESCE($5, youtube_url),
          ouvidoria_url = COALESCE($6, ouvidoria_url),
          transparencia_url = COALESCE($7, transparencia_url),
          servicos_url = COALESCE($8, servicos_url)
      WHERE id = $9
      RETURNING *
    `, [contact_phone, facebook_url, instagram_url, linkedin_url, youtube_url, ouvidoria_url, transparencia_url, servicos_url, id]);

        if (result.rows.length === 0) return res.status(404).json({ error: 'Geral data not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating geral data:', error);
        res.status(500).json({ error: 'Failed to update geral data' });
    }
};
