/**
 * Configuration de la connexion à la base de données MySQL
 *
 * Ce fichier contient les paramètres de connexion à la base de données.
 * ATTENTION: Les identifiants sont en dur dans le code (mauvaise pratique volontaire)
 *
 * @module config/database
 */

import mysql from 'mysql2/promise';

/**
 * Configuration de la connexion MySQL
 * FAILLE DE SÉCURITÉ: Les identifiants sont stockés en dur dans le code
 * au lieu d'utiliser des variables d'environnement
 */
const dbConfig = {
    host: 'localhost',      // Serveur MySQL
    user: 'root',           // Utilisateur MySQL
    password: '1234',       // Mot de passe MySQL
    database: 'mini_site',  // Nom de la base de données
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

/**
 * Pool de connexions MySQL
 * Permet de réutiliser les connexions pour de meilleures performances
 */
const pool = mysql.createPool(dbConfig);

/**
 * Fonction pour obtenir une connexion depuis le pool
 * @returns Promise<Connection> Une connexion MySQL
 */
export const getConnection = async () => {
    return await pool.getConnection();
};

/**
 * Export du pool pour utilisation directe
 */
export default pool;
