import pool from '../db.js';

export const getGeral = async (req, res) => {
    try {
        let result = await pool.query('SELECT * FROM geral LIMIT 1');

        if (result.rows.length === 0) {
            console.log('Backend: No geral record found. Auto-creating default row...');
            result = await pool.query('INSERT INTO geral (contact_phone) VALUES ($1) RETURNING *', ['(67) 3318-3500']);
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching geral data:', error);
        res.status(500).json({ error: 'Failed to fetch geral data' });
    }
};

export const updateGeral = async (req, res) => {
    try {
        const { contact_phone, facebook_url, instagram_url, linkedin_url, youtube_url, ouvidoria_url, transparencia_url, servicos_url } = req.body;

        console.log(`Backend: Updating global settings with:`, req.body);

        // We use a subquery in the WHERE clause to find the ID of the single record
        const result = await pool.query(`
      UPDATE geral
      SET contact_phone = COALESCE($1, contact_phone),
          facebook_url = COALESCE($2, facebook_url),
          instagram_url = COALESCE($3, instagram_url),
          linkedin_url = COALESCE($4, linkedin_url),
          youtube_url = COALESCE($5, youtube_url),
          ouvidoria_url = COALESCE($6, ouvidoria_url),
          transparencia_url = COALESCE($7, transparencia_url),
          servicos_url = COALESCE($8, servicos_url),
          updated_at = NOW()
      WHERE id = (SELECT id FROM geral LIMIT 1)
      RETURNING *
    `, [contact_phone, facebook_url, instagram_url, linkedin_url, youtube_url, ouvidoria_url, transparencia_url, servicos_url]);

        if (result.rows.length === 0) {
            console.warn(`Backend: No geral record found to update.`);
            return res.status(404).json({ error: 'Geral data not found' });
        }

        console.log('Backend: Geral updated successfully.');
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating geral data:', error);
        res.status(500).json({ error: 'Failed to update geral data' });
    }
};
