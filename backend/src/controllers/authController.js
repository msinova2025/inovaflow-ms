import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-it';

export const register = async (req, res) => {
    try {
        const { email, password, full_name, user_type, phone, organization, cpf_cnpj } = req.body;

        // Check if user exists
        const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = await pool.query(`
            INSERT INTO users (
                email, password, full_name, role, phone, organization, cpf_cnpj
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, email, full_name, role
        `, [email, hashedPassword, full_name, user_type, phone, organization, cpf_cnpj]);

        const user = result.rows[0];

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            user,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Compare password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove password from response
        delete user.password;

        // Send WhatsApp Welcome Message (Fire-and-forget)
        if (user.phone) {
            (async () => {
                try {
                    const phoneNumbersOnly = user.phone.replace(/\D/g, '');
                    const jid = phoneNumbersOnly.startsWith('55') ? phoneNumbersOnly : `55${phoneNumbersOnly}`;

                    if (jid.length >= 12) { // Basic validation (55 + DDD + 9 + 8 digits = 13, or landline 12)
                        await fetch('https://9097.bubblewhats.com/send-message', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'YWEwMGViMGE1MmI1NTY4NjI2MWRhMGFh',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                "jid": jid,
                                "message": `Olá ${user.full_name.split(' ')[0]}, que bom ter você de volta no MS INOVA MAIS!`
                            })
                        });
                    }
                } catch (wsError) {
                    console.error('WhatsApp API Error:', wsError.message);
                }
            })();
        }

        res.json({
            user,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

export const getMe = async (req, res) => {
    try {
        // req.user comes from auth middleware (to be implemented)
        const result = await pool.query('SELECT id, email, full_name, role, phone, organization, cpf_cnpj, avatar_url FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};
