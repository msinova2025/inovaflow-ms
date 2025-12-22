import pool from '../db.js';

export const getAllEvents = async (req, res) => {
    try {
        const { limit = 10, upcoming = false } = req.query;
        let query = 'SELECT * FROM events';
        let params = [limit];

        if (upcoming) {
            query += ' WHERE start_date >= NOW()';
        }

        query += ' ORDER BY start_date ASC LIMIT $1';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
};
export const createEvent = async (req, res) => {
    try {
        const { title, description, location, start_date, end_date, image_url, link } = req.body;
        const result = await pool.query(`
      INSERT INTO events (title, description, location, start_date, end_date, image_url, link)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [title, description, location, start_date, end_date, image_url, link]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, location, start_date, end_date, image_url, link } = req.body;
        const result = await pool.query(`
      UPDATE events
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          location = COALESCE($3, location),
          start_date = COALESCE($4, start_date),
          end_date = COALESCE($5, end_date),
          image_url = COALESCE($6, image_url),
          link = COALESCE($7, link)
      WHERE id = $8
      RETURNING *
    `, [title, description, location, start_date, end_date, image_url, link, id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
};
