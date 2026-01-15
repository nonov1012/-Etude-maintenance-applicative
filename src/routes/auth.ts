/**
 * Routes d'authentification
 *
 * Ce fichier gère les routes de connexion et déconnexion des utilisateurs.
 *
 * @module routes/auth
 */

import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

const router = Router();

/**
 * GET /auth/login
 * Affiche la page de connexion
 */
router.get('/login', (req: Request, res: Response) => {
    // Si déjà connecté, rediriger vers les produits
    if (req.session.isLoggedIn) {
        return res.redirect('/products');
    }
    res.render('login', { error: null });
});

/**
 * POST /auth/login
 * Traite le formulaire de connexion
 */
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

        console.log('Requête SQL exécutée:', query); // Log pour debug (mauvaise pratique aussi)

        const [rows] = await pool.execute<RowDataPacket[]>(query);

        if (rows.length > 0) {
            // Utilisateur trouvé - création de la session
            const user = rows[0];
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;
            req.session.isLoggedIn = true;

            res.redirect('/products');
        } else {
            // Identifiants incorrects
            res.render('login', { error: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.render('login', { error: 'Erreur lors de la connexion' });
    }
});

/**
 * GET /auth/register
 * Affiche la page d'inscription
 */
router.get('/register', (req: Request, res: Response) => {
    // Si déjà connecté, rediriger vers les produits
    if (req.session.isLoggedIn) {
        return res.redirect('/products');
    }
    res.render('register', { error: null });
});

/**
 * POST /auth/register
 * Traite le formulaire d'inscription (crée un compte user)
 */
router.post('/register', async (req: Request, res: Response) => {
    const { username, password, confirmPassword } = req.body;

    // Vérification basique des mots de passe
    if (password !== confirmPassword) {
        return res.render('register', { error: 'Les mots de passe ne correspondent pas' });
    }

    try {
        // Vérifier si le nom d'utilisateur existe déjà
        const [existingUsers] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (existingUsers.length > 0) {
            return res.render('register', { error: 'Ce nom d\'utilisateur est déjà pris' });
        }

        await pool.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, password, 'user']
        );

        // Rediriger vers la page de connexion après inscription
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.render('register', { error: 'Erreur lors de l\'inscription' });
    }
});

/**
 * GET /auth/logout
 * Déconnecte l'utilisateur en détruisant la session
 */
router.get('/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
        }
        res.redirect('/');
    });
});

export default router;
