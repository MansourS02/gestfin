# GEST Connect

Prompt — Plateforme Web Cabinet GEST

Contexte du projet :
Développe une plateforme web professionnelle pour le cabinet GEST (Gestion Étude Stratégie Marketing), dirigé par Amari Sow, Économiste/Gestionnaire, Expert diplômé en Marketing Management et Consultant Formateur avec plus de 20 ans d'expérience. Le cabinet est basé à Yoff Diamalaye 2, Dakar, Sénégal.

Stack technique :

Frontend : React JS (avec Tailwind CSS ou Material UI)
Backend : Laravel (API REST)
Base de données : MySQL
Authentification : Laravel Sanctum
Déploiement : compatible VPS Linux


Identité visuelle :

Couleurs principales : bleu marine, turquoise/teal, bordeaux/rouge foncé, beige crème
Logo : "G" stylisé avec le mot GEST
Typographie : moderne, professionnelle
Style : sobre, épuré, corporate africain


Pages & modules à développer :
1. Page d'accueil (Landing Page)

Hero section avec slogan du cabinet et CTA ("Prendre rendez-vous", "Découvrir nos services")
Présentation synthétique du cabinet GEST
Section "Pourquoi nous choisir" (20 ans d'expérience, expertise certifiée, accompagnement personnalisé)
Témoignages clients
Section contact rapide

2. Page À propos

Profil complet d'Amari Sow (photo, biographie, compétences, certifications)
Vision et mission du cabinet
Chiffres clés (20+ ans, nombre de clients, projets réalisés)

3. Page Services — organisée en 3 grands pôles :
ÉTUDES

Étude marketing
Étude économique et financière
Élaboration de business plan

GESTION

Gestion et développement d'affaires
Gestion de patrimoine
Audit et contrôle de gestion

STRATÉGIES

Audit marketing
Plan stratégique de développement
Évaluation et suivi

FORMATION / ACCOMPAGNEMENT

Marketing & stratégie digitale
Management des unités commerciales
Négociation des relations d'affaires
Gestion des crises

Chaque service doit avoir une page détaillée avec description, bénéfices, et formulaire de demande de devis.
4. Module Prise de rendez-vous

Formulaire : nom, entreprise, téléphone, email, service souhaité, date souhaitée, message
Notification email automatique (Laravel Mail)
Tableau de bord admin pour gérer les rendez-vous

5. Module Blog / Actualités

Articles rédigés par Amari Sow (conseils en gestion, marketing, stratégie)
Catégories, tags, commentaires
Interface admin pour publier des articles

6. Espace Client (optionnel mais recommandé)

Inscription / Connexion sécurisée
Suivi de dossier/mission en cours
Téléchargement de rapports et livrables
Messagerie avec le cabinet

7. Page Contact

Formulaire de contact
Carte Google Maps (Yoff Diamalaye 2, Dakar)
Infos : +221 775041565 / gestasow@gmail.com

8. Panel Administrateur (Laravel + React)

Gestion des services
Gestion des rendez-vous
Gestion des clients
Gestion du blog
Statistiques (nombre de demandes, visiteurs, services les plus demandés)


Fonctionnalités techniques :

API REST Laravel avec authentification Sanctum
React Router pour la navigation SPA
Axios pour les appels API
Formulaires avec validation côté client (React Hook Form) et côté serveur (Laravel Validator)
Envoi d'emails automatiques (Laravel Mail + Mailtrap ou SMTP)
Responsive design (mobile-first)
SEO optimisé (balises meta, Open Graph)
Multilingue (français par défaut, anglais optionnel)


Informations de contact à intégrer :

Adresse : Yoff Diamalaye 2 n° 02, Dakar, Sénégal
Téléphone : +221 775041565
Email : gestasow@gmail.com
Registre : TEB RC.SN_DKR.2024.4.43430

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4056d99a-4892-4ade-bef4-b2487e8db4a7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
