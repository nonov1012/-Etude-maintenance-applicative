/**
 * Routes de la page d'accueil
 *
 * Ce fichier gère les routes principales du site,
 * notamment la page d'accueil.
 *
 * @module routes/index
 */

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /
 * Affiche la page d'accueil du site
 */
router.get('/', (req: Request, res: Response) => {
    res.render('index', {
        isLoggedIn: req.session.isLoggedIn || false,
        username: req.session.username || null
    });
});

export default router;
