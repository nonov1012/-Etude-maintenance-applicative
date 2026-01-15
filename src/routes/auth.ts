/**
 * Routes d'authentification
 *
 * Ce fichier gère les routes de connexion et déconnexion des utilisateurs.
 *
 * FAILLE DE SÉCURITÉ VOLONTAIRE: Injection SQL
 * La requête de connexion utilise la concaténation de chaînes
 * au lieu de requêtes préparées, permettant l'injection SQL.
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
 *
 * FAILLE DE SÉCURITÉ: Injection SQL
 * La requête utilise la concaténation de chaînes directement
 * avec les données utilisateur, permettant des attaques comme:
 * - username: admin'--
 * - username: ' OR '1'='1
 */
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        // FAILLE: Injection SQL - Concaténation directe des entrées utilisateur
        // Un attaquant peut se connecter avec: username = admin'-- et n'importe quel password
        // Ou avec: username = ' OR '1'='1'--
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
