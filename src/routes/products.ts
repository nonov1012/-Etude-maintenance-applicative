/**
 * Routes CRUD pour les produits
 *
 * Ce fichier gère toutes les opérations sur les produits:
 * - Liste des produits (Read)
 * - Ajout d'un produit (Create)
 * - Modification d'un produit (Update)
 * - Suppression d'un produit (Delete)
 * - Calcul du total de l'inventaire
 *
 * @module routes/products
 */

import { Router, Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Product } from '../types';

const router = Router();

/**
 * Middleware pour vérifier l'authentification
 * Redirige vers la page de login si l'utilisateur n'est pas connecté
 */
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/auth/login');
    }
    next();
};

// Appliquer le middleware d'authentification à toutes les routes
router.use(requireAuth);

/**
 * GET /products
 * Affiche la liste de tous les produits
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const [products] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM products ORDER BY created_at DESC'
        );

        res.render('products', {
            products,
            username: req.session.username,
            role: req.session.role
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.render('products', {
            products: [],
            username: req.session.username,
            role: req.session.role,
            error: 'Erreur lors du chargement des produits'
        });
    }
});

/**
 * GET /products/add
 * Affiche le formulaire d'ajout d'un produit
 */
router.get('/add', (req: Request, res: Response) => {
    res.render('product-form', {
        product: null,
        action: 'add',
        username: req.session.username
    });
});

/**
 * POST /products/add
 * Traite le formulaire d'ajout d'un nouveau produit
 */
router.post('/add', async (req: Request, res: Response) => {
    const { name, description, price, quantity } = req.body;

    try {
        await pool.execute(
            'INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)',
            [name, description, price, quantity]
        );

        res.redirect('/products');
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit:', error);
        res.render('product-form', {
            product: { name, description, price, quantity },
            action: 'add',
            username: req.session.username,
            error: 'Erreur lors de l\'ajout du produit'
        });
    }
});

/**
 * GET /products/edit/:id
 * Affiche le formulaire de modification d'un produit
 */
router.get('/edit/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [products] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );

        if (products.length === 0) {
            return res.redirect('/products');
        }

        res.render('product-form', {
            product: products[0],
            action: 'edit',
            username: req.session.username
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        res.redirect('/products');
    }
});

/**
 * POST /products/edit/:id
 * Traite le formulaire de modification d'un produit
 */
router.post('/edit/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;

    try {
        await pool.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?',
            [name, description, price, quantity, id]
        );

        res.redirect('/products');
    } catch (error) {
        console.error('Erreur lors de la modification du produit:', error);
        res.render('product-form', {
            product: { id, name, description, price, quantity },
            action: 'edit',
            username: req.session.username,
            error: 'Erreur lors de la modification du produit'
        });
    }
});

/**
 * GET /products/delete/:id
 * Supprime un produit (pas de confirmation - mauvaise UX volontaire)
 */
router.get('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await pool.execute('DELETE FROM products WHERE id = ?', [id]);
        res.redirect('/products');
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.redirect('/products');
    }
});

/**
 * GET /products/total
 * Calcule le total de l'inventaire (prix * quantité pour chaque produit)
 */
router.get('/total', async (req: Request, res: Response) => {
    try {
        const [products] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM products'
        );

        let total = 0;

        for (const product of products as Product[]) {
            total += Number(product.price) * Number(product.quantity);
        }

        res.render('total', {
            products,
            total: total.toFixed(2),
            username: req.session.username
        });
    } catch (error) {
        console.error('Erreur lors du calcul du total:', error);
        res.redirect('/products');
    }
});

export default router;
