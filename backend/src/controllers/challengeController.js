import pool from '../db.js';

export const getAllChallenges = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT c.*, u.full_name as creator_name, u.organization
      FROM challenges c
      LEFT JOIN users u ON c.created_by = u.id
      ORDER BY c.created_at DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ error: 'Failed to fetch challenges' });
    }
};

export const getChallengeById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
      SELECT c.*, u.full_name as creator_name, u.organization
      FROM challenges c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching challenge:', error);
        res.status(500).json({ error: 'Failed to fetch challenge' });
    }
};

export const createChallenge = async (req, res) => {
    try {
        const {
            title, description, axis, category, modality, proposer,
            contact_phone, contact_email, relationship_type,
            start_date, end_date, deadline, expected_results,
            benefits, attachments, banner_url, created_by
        } = req.body;

        // Use axis or category (compatibility)
        const finalAxis = axis || category;

        const result = await pool.query(`
      INSERT INTO challenges (
        title, description, axis, modality, proposer, 
        contact_phone, contact_email, relationship_type, 
        start_date, end_date, deadline, expected_results, 
        benefits, attachments, banner_url, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
            title, description, finalAxis, modality, proposer,
            contact_phone, contact_email, relationship_type,
            start_date, end_date, deadline, expected_results,
            benefits, JSON.stringify(attachments || []), banner_url, req.user.id
        ]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating challenge:', error);
        res.status(500).json({ error: 'Failed to create challenge' });
    }
};

export const updateChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, description, axis, category, modality, proposer,
            contact_phone, contact_email, relationship_type,
            start_date, end_date, deadline, expected_results,
            benefits, attachments, status, banner_url
        } = req.body;

        const finalAxis = axis || category;

        const result = await pool.query(`
      UPDATE challenges
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          axis = COALESCE($3, axis),
          modality = COALESCE($4, modality),
          proposer = COALESCE($5, proposer),
          contact_phone = COALESCE($6, contact_phone),
          contact_email = COALESCE($7, contact_email),
          relationship_type = COALESCE($8, relationship_type),
          start_date = COALESCE($9, start_date),
          end_date = COALESCE($10, end_date),
          deadline = COALESCE($11, deadline),
          expected_results = COALESCE($12, expected_results),
          benefits = COALESCE($13, benefits),
          attachments = COALESCE($14, attachments),
          status = COALESCE($15, status),
          banner_url = COALESCE($16, banner_url)
      WHERE id = $17
      RETURNING *
    `, [
            title, description, finalAxis, modality, proposer,
            contact_phone, contact_email, relationship_type,
            start_date, end_date, deadline, expected_results,
            benefits, attachments ? JSON.stringify(attachments) : null, status, banner_url, id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating challenge:', error);
        res.status(500).json({ error: 'Failed to update challenge' });
    }
};

export const deleteChallenge = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM challenges WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        res.json({ message: 'Challenge deleted successfully' });
    } catch (error) {
        console.error('Error deleting challenge:', error);
        res.status(500).json({ error: 'Failed to delete challenge' });
    }
};

export const getMyChallenges = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM challenges WHERE created_by = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching my challenges:', error);
        res.status(500).json({ error: 'Failed to fetch my challenges' });
    }
};
