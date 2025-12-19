import pool from '../db.js';

export const getAllSolutions = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT s.*, c.title as challenge_title, u.full_name as solver_name, u.phone as solver_phone
      FROM solutions s
      LEFT JOIN challenges c ON s.challenge_id = c.id
      LEFT JOIN users u ON s.submitted_by = u.id
      ORDER BY s.created_at DESC
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching all solutions:', error);
        res.status(500).json({ error: 'Failed to fetch solutions' });
    }
};

export const getSolutionsByChallengeId = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const result = await pool.query(`
      SELECT s.*, u.full_name as solver_name, u.organization
      FROM solutions s
      LEFT JOIN users u ON s.submitted_by = u.id
      WHERE s.challenge_id = $1
      ORDER BY s.created_at DESC
    `, [challengeId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching solutions:', error);
        res.status(500).json({ error: 'Failed to fetch solutions' });
    }
};

export const createSolution = async (req, res) => {
    try {
        const {
            challenge_id, submitted_by, title, description, axis, benefits,
            team_name, participant_type, problem_solved, contribution_objectives,
            direct_beneficiaries, detailed_operation, solution_differentials,
            territory_replication, required_resources, validation_prototyping,
            success_indicators, established_partnerships, solution_continuity,
            linkedin_link, instagram_link, portfolio_link, attachments,
            document_1_url, document_2_url, document_3_url, status_id
        } = req.body;

        const result = await pool.query(`
      INSERT INTO solutions (
        challenge_id, submitted_by, title, description, axis, benefits,
        team_name, participant_type, problem_solved, contribution_objectives,
        direct_beneficiaries, detailed_operation, solution_differentials,
        territory_replication, required_resources, validation_prototyping,
        success_indicators, established_partnerships, solution_continuity,
        linkedin_link, instagram_link, portfolio_link, attachments,
        document_1_url, document_2_url, document_3_url, status_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
      RETURNING *
    `, [
            challenge_id, submitted_by, title, description, axis, benefits,
            team_name, participant_type, problem_solved, contribution_objectives,
            direct_beneficiaries, detailed_operation, solution_differentials,
            territory_replication, required_resources, validation_prototyping,
            success_indicators, established_partnerships, solution_continuity,
            linkedin_link, instagram_link, portfolio_link, JSON.stringify(attachments || []),
            document_1_url, document_2_url, document_3_url, status_id
        ]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating solution:', error);
        res.status(500).json({ error: 'Failed to create solution' });
    }
};

export const getSolutionById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM solutions WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solution not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching solution:', error);
        res.status(500).json({ error: 'Failed to fetch solution' });
    }
};

export const updateSolution = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, description, axis, benefits, team_name, participant_type,
            problem_solved, contribution_objectives, direct_beneficiaries,
            detailed_operation, solution_differentials, territory_replication,
            required_resources, validation_prototyping, success_indicators,
            established_partnerships, solution_continuity, linkedin_link,
            instagram_link, portfolio_link, attachments, document_1_url,
            document_2_url, document_3_url, status_id, status
        } = req.body;

        const result = await pool.query(`
      UPDATE solutions
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          axis = COALESCE($3, axis),
          benefits = COALESCE($4, benefits),
          team_name = COALESCE($5, team_name),
          participant_type = COALESCE($6, participant_type),
          problem_solved = COALESCE($7, problem_solved),
          contribution_objectives = COALESCE($8, contribution_objectives),
          direct_beneficiaries = COALESCE($9, direct_beneficiaries),
          detailed_operation = COALESCE($10, detailed_operation),
          solution_differentials = COALESCE($11, solution_differentials),
          territory_replication = COALESCE($12, territory_replication),
          required_resources = COALESCE($13, required_resources),
          validation_prototyping = COALESCE($14, validation_prototyping),
          success_indicators = COALESCE($15, success_indicators),
          established_partnerships = COALESCE($16, established_partnerships),
          solution_continuity = COALESCE($17, solution_continuity),
          linkedin_link = COALESCE($18, linkedin_link),
          instagram_link = COALESCE($19, instagram_link),
          portfolio_link = COALESCE($20, portfolio_link),
          attachments = COALESCE($21, attachments),
          document_1_url = COALESCE($22, document_1_url),
          document_2_url = COALESCE($23, document_2_url),
          document_3_url = COALESCE($24, document_3_url),
          status_id = COALESCE($25, status_id),
          status = COALESCE($26, status)
      WHERE id = $27
      RETURNING *
    `, [
            title, description, axis, benefits, team_name, participant_type,
            problem_solved, contribution_objectives, direct_beneficiaries,
            detailed_operation, solution_differentials, territory_replication,
            required_resources, validation_prototyping, success_indicators,
            established_partnerships, solution_continuity, linkedin_link,
            instagram_link, portfolio_link, attachments ? JSON.stringify(attachments) : null,
            document_1_url, document_2_url, document_3_url, status_id, status, id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solution not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating solution:', error);
        res.status(500).json({ error: 'Failed to update solution' });
    }
};

export const updateSolutionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await pool.query(`
      UPDATE solutions
      SET status = $1
      WHERE id = $2
      RETURNING *
    `, [status, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solution not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating solution:', error);
        res.status(500).json({ error: 'Failed to update solution' });
    }
};
export const getSolutionStatuses = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM solution_statuses ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching solution statuses:', error);
        res.status(500).json({ error: 'Failed to fetch solution statuses' });
    }
};

export const getMySolutions = async (req, res) => {
    try {
        const id = req.user.id;
        const result = await pool.query(`
      SELECT s.*, c.title as challenge_title
      FROM solutions s
      LEFT JOIN challenges c ON s.challenge_id = c.id
      WHERE s.submitted_by = $1
      ORDER BY s.created_at DESC
    `, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching my solutions:', error);
        res.status(500).json({ error: 'Failed to fetch my solutions' });
    }
};

export const createSolutionStatus = async (req, res) => {
    try {
        const { name, description, color } = req.body;
        const result = await pool.query(
            'INSERT INTO solution_statuses (name, description, color) VALUES ($1, $2, $3) RETURNING *',
            [name, description, color]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating solution status:', error);
        res.status(500).json({ error: 'Failed to create solution status' });
    }
};

export const updateSolutionStatusInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, color } = req.body;
        const result = await pool.query(
            'UPDATE solution_statuses SET name = $1, description = $2, color = $3 WHERE id = $4 RETURNING *',
            [name, description, color, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Status not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating solution status info:', error);
        res.status(500).json({ error: 'Failed to update solution status info' });
    }
};

export const deleteSolutionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM solution_statuses WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Status not found' });
        }
        res.json({ message: 'Status deleted successfully' });
    } catch (error) {
        console.error('Error deleting solution status:', error);
        res.status(500).json({ error: 'Failed to delete solution status' });
    }
};
