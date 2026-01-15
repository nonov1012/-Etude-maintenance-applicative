-- ============================================================
-- Script d'initialisation de la base de données
-- Mini Site Web - TP Maintenance Applicative
-- ============================================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS mini_site;
USE mini_site;

-- ============================================================
-- Table des utilisateurs
-- FAILLE DE SÉCURITÉ: Les mots de passe sont stockés en CLAIR
-- au lieu d'être hashés (ex: bcrypt)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Stocké en clair (volontairement non sécurisé)
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table des produits
-- Stocke les informations des produits pour le CRUD
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Données de test - Utilisateurs
-- FAILLE: Mots de passe faibles et stockés en clair
-- ============================================================
INSERT INTO users (username, password, role) VALUES
    ('admin', 'admin123', 'admin'),  -- Mot de passe faible!
    ('user', 'user123', 'user');     -- Mot de passe faible!

-- ============================================================
-- Données de test - Produits
-- ============================================================
INSERT INTO products (name, description, price, quantity) VALUES
    ('Laptop HP', 'Ordinateur portable HP 15 pouces, 8GB RAM, 256GB SSD', 799.99, 15),
    ('Souris Logitech', 'Souris sans fil ergonomique Logitech MX Master', 89.99, 45),
    ('Clavier Mécanique', 'Clavier gaming mécanique RGB Cherry MX', 129.99, 30),
    ('Écran 27 pouces', 'Moniteur LED 27" Full HD IPS', 249.99, 20),
    ('Webcam HD', 'Webcam 1080p avec microphone intégré', 59.99, 50);
