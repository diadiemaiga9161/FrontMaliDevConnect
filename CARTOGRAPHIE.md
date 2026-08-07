# CARTOGRAPHIE GLOBALE — MaliDevConnect (Front + Back)

> Établie le 2026-08-02 par lecture directe du code source des deux dépôts.
> **Front :** `FrontMaliDevConnect` (Angular 13) — ce dépôt
> **Back :** `Back-dev-mali` (Spring Boot 3.1.4 / Java 17 / MySQL) — `C:\Users\DILITECH\Desktop\Git-projet\Back-dev-mali`
> Le back possède déjà son propre `CARTOGRAPHIE.md` (détail entités/DTO/sécurité). Ce fichier-ci fait le lien **front ↔ back** et documente le front en détail, vérifié endpoint par endpoint dans le code des services Angular.
> ⚠️ Le `CARTOGRAPHIE.md` du back est **partiellement obsolète** — voir section 5 (Divergences).

---

## 1. Vue d'ensemble

```
┌──────────────────────────────┐   HTTP REST (JSON)   ┌───────────────────────────────┐
│  FrontMaliDevConnect          │ ───────────────────► │  Back-dev-mali                  │
│  Angular 13 / TypeScript       │ ◄─────────────────── │  Spring Boot 3.1.4 / Java 17    │
│  Port dev : 4200 (ng serve)    │                       │  Port : 8080                    │
│                                │  WebSocket / STOMP    │  package com.Projet.Projet      │
│                                │ ───────────────────► │  MySQL (JPA, ddl-auto=update)   │
└──────────────────────────────┘  ws://localhost:8080/ws └───────────────────────────────┘
```

- **Auth :** JWT — cookie `devmali` + header `Authorization: Bearer <token>`, stocké côté front dans `localStorage` (clé `auth-user`) via `StorageService`.
- **CORS :** géré côté back par `security/WebSecurityConfig.java`.
- **Config de l'URL back côté front :** `src/environments/environment.ts` → `BACKEND_HOST = 'http://localhost:8080'` (à changer ici pour pointer ailleurs).
- **Chat temps réel / notifications :** STOMP sur WebSocket (`@stomp/stompjs`), voir section 6.

---

## 2. FRONTEND — Angular 13

### 2.1 Stack

| Élément | Valeur |
|---|---|
| Framework | Angular 13.0.1 |
| UI | Bootstrap 5.1.3, mdb-ui-kit, jQuery, sweetalert2 |
| Temps réel | `@stomp/stompjs` 7.3 |
| Autres | `openai` (client OpenAI côté front — à vérifier si réellement utilisé), `ngx-pagination`, `ng2-search-filter` |
| Nom package | `avrax-ng` (v1.3.0) — nom hérité d'un template admin, pas encore renommé |

### 2.2 Points d'entrée

| Fichier | Rôle |
|---|---|
| `src/environments/environment.ts` / `environment.prod.ts` | URL du back, URL WebSocket, Google Client ID |
| `src/app/app.module.ts` | Déclare `AuthInterceptor` dans `HTTP_INTERCEPTORS` |
| `src/app/app-routing.module.ts` | Toutes les routes principales (lazy-load `chats` et `admin`) |
| `src/app/guards/auth.guard.ts` | Bloque l'accès si non connecté (`StorageService.isLoggedIn()`) |
| `src/app/guards/admin.guard.ts` | Bloque l'accès `/admin` si rôle ≠ `ROLE_ADMIN`/`ROLE_SUPERADMIN` |
| `src/app/interceptors/auth.interceptor.ts` | Ajoute le Bearer token, gère les 401, whitelist d'URLs publiques |
| `src/app/services/storage/storage.service.ts` | Lit/écrit l'utilisateur connecté en `localStorage` |

### 2.3 Routing principal (`app-routing.module.ts`)

| Route | Composant | Guard |
|---|---|---|
| `/` | `AccueilComponent` | — |
| `/professionnel` | `ProfessionnelComponent` (annuaire) | — |
| `/professionnel/:token`, `/profil/public/:token` | `ProfilDevComponent` (profil public) | — |
| `/profil-client` | `ProfilUtilisateurComponent` | Auth |
| `/profil-professionnel` | `ProfilProfessionnelComponent` | Auth |
| `/inscription`, `/connexion`, `/sing-in` | Auth pages | — |
| `/mdp-oublie`, `/new-mdp` | Reset mot de passe | — |
| `/complete`, `/complete-profils` | Complétion de profil | Auth |
| `/projet`, `/projets-détaillé/:id` | Gestion / détail projets | Auth (création), public (détail) |
| `/rdv-details`, `/details-rdv/:id` | Détail rendez-vous | Auth |
| `/notifications` | `NotificationComponent` | Auth |
| `/forum` | `ForumComponent` | — |
| `/chat`, `/chat/:token` | `ChatComponent` (chat simple) | Auth |
| `/chats` (lazy) | `ChatModule` (chat avancé, `pages/chat/chat/chat.component`) | Auth |
| `/favoris` | `FavorisComponent` | Auth |
| `/contacts` | `ContactsComponent` | Auth |
| `/plus-vus` | `PlusVusComponent` | — |
| `/admin` (lazy) | `AdminModule` | Admin |
| `/apropos`, `/contact`, `/product`, `/directory`, `/error`, `/maintenance` | Pages diverses | — |
| `/informaticien` → `/professionnel`, `/profil-détaillé/:id` → `/professionnel/:id`, `/profil-informaticien` → `/profil-professionnel` | Redirections legacy | — |
| `**` | `ErrorComponent` | — |

**Sous-routes admin** (`components/pages/admin/admin-routing.module.ts`, préfixe `/admin`, dans `AdminLayoutComponent`) :
`dashboard`, `utilisateurs`, `specialites`, `competences`, `type-projets`, `type-rdv`, `mon-profil`.

### 2.4 Structure des dossiers

```
src/app/
├── components/
│   ├── layouts/            — navbar-one, footer, preloader (layout public)
│   ├── pages/               — TOUTES les pages métier (voir routing ci-dessus)
│   │   └── admin/           — module admin lazy-loadé (dashboard, gestion CRUD)
│   └── shared/               — ⚠️ template admin générique hérité (Multikart-like) :
│       ├── data/ecommerce, data/job-search, data/knowledge-base, data/todo, data/widget…
│       └── largement INUTILISÉ par les routes réelles — boilerplate à nettoyer
├── guards/                  — AuthGuard, AdminGuard (utilisés réellement dans le routing)
├── interceptors/             — AuthInterceptor (JWT + gestion 401)
└── services/                 — TOUS les appels HTTP vers le back (détail §3)
```

> **Note :** doublon de guards — `app/guards/*` (actif, utilisé dans `app-routing.module.ts`) vs `app/components/shared/guard/admin.guard.ts` (résidu du template, semble mort). De même `app/components/shared/model/chat.model.ts` semble être du boilerplate distinct du vrai modèle de chat.

### 2.5 Services (couche d'accès au back)

29 services dans `src/app/services/*`, un par domaine métier : `auth`, `user`, `admin`, `projet`, `experience`, `connaissance`, `type-connaissance`, `typeProjet`, `typerdv`, `specialite`, `recherche`, `rendezVous`, `contact`, `favoris`, `notes`, `notification`, `messages-chat` (2 services : `message.service.ts` et `messages-chat.service.ts` — **doublon fonctionnel**, à vérifier lequel est réellement branché aux composants), `forum`, `commentaire`, `chat-modal`, `crypto` (clés publiques E2E pour le chat), `storage`, `popup`, `websocket`.

---

## 3. BACKEND — Spring Boot (résumé de navigation)

Voir aussi le `CARTOGRAPHIE.md` du back pour le détail entités/DTO/sécurité/structure. Ici : liste réelle des controllers présents sur disque (vérifiée le 2026-08-02) :

```
Admin/AdminController.java                                  ⚠️ absent du doc back
Connaissances/ConnaissancesController.java
Connaissances/TypeConnaissance/TypeConnaissancesController.java
DemandeContact/DemandeContactController.java
ExperienceProfessionnelle/ExperienceProfessionnelleController.java
Favori/FavoriController.java
Forum/ForumController.java
MessagesChat/MessageController.java
Note/NoteController.java
Notification/NotificationController.java
Permission/UserPermissionController.java
Profil/ProfilPublicController.java
ProjetInformatique/ProjetInformatiqueController.java
ProjetInformatique/TypeProjet/TypeProjetController.java
Recherche/RechercheController.java
RendezVous/RendezVousController.java
RendezVous/TypeRdv/TypeRdvController.java
controller/WsChatController.java                            (WebSocket/STOMP)
utilisateur/Authentification/AuthentificationController.java
utilisateur/Authentification/GoogleAuthController.java
utilisateur/Biographies/BiographieController.java
utilisateur/Commentaires_user/CommentairesController.java
utilisateur/Specialite/SpecialiteController.java
utilisateur/User/UtilisateurController.java
```

---

## 4. Table de correspondance FRONT ⇄ BACK (par domaine)

> Base URL front : `environment.Url_BASE` = `http://localhost:8080/api/`
> Cette table liste les endpoints **réellement appelés** par les services Angular (vérité terrain du code, pas la doc back).

### Auth (`services/auth/auth.service.ts`)
`auth/signin` (POST), `auth/signup` (POST), `auth/signout` (POST), `auth/google` (POST), `auth/forgotPassword` (POST), `auth/resetPassword` (POST).

### Utilisateur (`services/user/user.service.ts` — le plus gros service, hub central)
`user/afficherinfo`, `user/afficher`, `user/byRole/{role}`, `user/userparid/{id}`, `user/profil/{id}`, `user/plus-vus`, `user/generer-lien`, `user/completer-profil`, `user/photo/get`, `user/updatePhoto`, `user/specialites`, `user/specialites/{userId}`, `user/specialite/ajouter/{id}`, `user/specialite/retirer/{id}`, `user/chat-token/{userId}`, `user/public-key/{userId}`, `user/public-key` (PUT)
+ raccourcis vers d'autres domaines exposés par ce même service : `amadou/*` (expériences), `connaissance/*`, `commentaires/afficher`, `biographie/*`, `projetInformatique/*`.

### Admin (`services/admin/admin.service.ts` → `Admin/AdminController.java`)
`admin/stats`, `admin/users`, `admin/user/{id}`, `admin/user/ban/{id}`, `admin/user/deban/{id}`, `admin/user/valider/{id}`, `admin/user/supprimer/{id}`, `admin/user/creer`
+ CRUD réutilisés depuis cet écran : `specialite/*`, `connaissance/*`, `typeprojet`/`typeProjet/*`, `typerdv/*`.

### Projets informatiques (`services/projet/projet.service.ts`)
`projetInformatique/ajouter`, `afficher`, `voir`, `par-user/{id}`, `par-type/{id}`, `projetparid/{id}`, `modifier/{id}`, `supprimer/{id}`.

### Expériences (`services/experience/experience.service.ts`)
`amadou/ajouter`, `afficher`, `voir`, `modifier`, `supprimer/{id}`, `par-user/{id}`.

### Connaissances (`services/connaissance/connaissance.service.ts`)
`connaissance/toutes`, `ajouter`, `modifier`, `supprimer/{id}`, `lier/{id}`, `lier-plusieurs`, `retirer/{id}`, `par-user/{id}`, `afficher`.

### Biographie
`biographie/afficher`, `par-user/{id}`, `ajouter`, `modifier` (regroupé dans `user.service.ts`).

### Recherche (`services/recherche/recherche.service.ts`)
`recherche/professionnels`, `par-categorie/{cat}`, `par-specialite/{id}`.

### Rendez-vous (`services/rendezVous/rendezVous.service.ts`)
`rdv/ajouter`, `afficher`, `get`, `get/mine`, `get/mine/statut/{s}`, `get/mine/en-attente`, `get/mine/acceptes`, `get/envoye/statut/{s}`, `afficherparId/{id}`, `rdvNonNotifies`, `modifier`, `supprimer/{id}`, `accepter/{id}`, `refuser/{id}`, `annuler/{id}`, `proposer-date/{id}`, `statut/{id}`.

### Contacts (`services/contact/contact.service.ts`)
`contact/demande/{id}`, `accepter/{id}`, `refuser/{id}`, `demandes-recues`, `demandes-envoyees`, `mes-contacts`, `verifier/{id1}/{id2}`.

### Favoris (`services/favoris/favoris.service.ts`)
`favoris/ajouter/{id}`, `retirer/{id}`, `favoris` (GET liste), `verifier/{id}`.

### Notes/évaluations (`services/notes/notes.service.ts`)
`notes/noter/{id}`, `modifier/{id}`, `professionnel/{id}`, `ma-note/{id}`, `supprimer/{id}`.

### Notifications (`services/notification/notification.service.ts`)
`notifications` (GET), `non-lues`, `count`, `lire/{id}`, `lire-tout`.

### Messages/Chat (`services/messages-chat/message.service.ts` + `messages-chat.service.ts` — doublon)
`messages/envoyer/{id}`, `conversation/{id}`, `conversations`, `lire/{id}`, `modifier/{id}`, `supprimer/{id}`, `non-lus/count`.
+ `user/chat-token/{id}`, `user/public-key/{id}` pour le chiffrement E2E (`crypto.service.ts`).

### Forum (`services/forum/forum.service.ts`)
`forum/sujets/creer`, `sujets`, `sujets/{id}`, `sujets/modifier/{id}`, `sujets/supprimer/{id}`, `reponses/ajouter/{id}`, `reponses/modifier/{id}`, `reponses/supprimer/{id}`.

### Commentaires (`services/commentaire/commentaire.service.ts` — base = `commentaires/`)
`ajouter`, `recus`, `envoyes`, `statistiques`, `modifier/{id}`, `supprimer/{id}`, `{id}` (GET), `admin/tous`, `profil/{userId}`.

### Types de référence
- Spécialités : `services/specialite/specialite.service.ts` → `specialite/afficher|ajouter|modifier/{id}|supprimer/{id}`
- Types de projet : `services/typeProjet/type-projet.service.ts` → `typeprojet/afficher`, `typeProjet/modifier|supprimer/{id}` (⚠️ casse incohérente `typeprojet` vs `typeProjet`, voir §5)
- Types de RDV : `services/typerdv/typerdv.service.ts` → `typerdv/afficher|ajouter|modifier/{id}|supprimer/{id}`
- Types de connaissance : `services/type-connaissance/type-connaissance.service.ts` → `typeconnaissance/afficher`

---

## 5. Divergences observées (doc back vs réalité)

Le `CARTOGRAPHIE.md` du backend date d'avant plusieurs évolutions. Écarts constatés en comparant aux appels front réels :

1. **`AdminController` absent du doc back** mais activement utilisé par le front (`admin/stats`, `admin/users`, `admin/user/ban|deban|valider|supprimer|creer`). Le doc back documente `Permission/UserPermissionController` pour l'admin, qui semble être un module différent — à réconcilier.
2. **Notes/évaluations** : doc back documente `Note/NoteController` avec `/api/note/noter` et `/api/note/moyenne/{id}`, mais le front appelle `notes/noter/{id}`, `notes/professionnel/{id}`, `notes/ma-note/{id}`, `notes/supprimer/{id}` (préfixe `notes` pluriel + endpoints différents).
3. **Casse incohérente `typeprojet` / `typeProjet`** côté front selon les endpoints (GET en minuscules, POST/PUT/DELETE en camelCase) — à vérifier que Spring route bien les deux formes en prod.
4. **Doublon de services de chat** : `messages-chat.service.ts` et `message.service.ts` exposent quasiment les mêmes endpoints (`messages/*`). Un seul est probablement branché aux composants réels — l'autre est mort.
5. **Doublon de guards** : `app/guards/admin.guard.ts` (actif) vs `app/components/shared/guard/admin.guard.ts` (résidu de template, semble inutilisé).
6. **`components/shared/`** contient un volume important de code de template admin générique (ecommerce, job-search, knowledge-base, todo, widget…) qui ne correspond à aucune route active du projet — vraisemblablement du boilerplate jamais nettoyé après le scaffolding initial.

---

## 6. Chat temps réel & notifications (WebSocket/STOMP)

- **Back :** `WebSocketConfig.java` + `controller/WsChatController.java`, endpoint `ws://localhost:8080/ws`.
- **Front :** `services/websocket.service.ts` (client `@stomp/stompjs`), connexion authentifiée par header `Authorization: Bearer <token>` au handshake STOMP.
- **Abonnements côté front :**
  - `/user/{email}/queue/messages` → messages privés
  - `/user/{email}/queue/notifications` → notifications
- **Publication :** `/app/chat.private` (envoi message privé).
- **Chiffrement E2E** : `services/crypto/crypto.service.ts` gère une paire de clés publiques stockées côté back (`user/public-key`), indépendant du WebSocket lui-même (échange de clé via REST, messages via WS).

---

## 7. Sécurité — flux d'authentification

1. Login (`auth/signin`) ou Google (`auth/google`) → le back renvoie `UserInfoResponse` avec un `token` (JWT).
2. Le front stocke l'objet complet en `localStorage['auth-user']` via `StorageService.saveUser()`.
3. `AuthInterceptor` ajoute `Authorization: Bearer <token>` à toute requête dont l'URL n'est pas dans `PUBLIC_URLS`.
4. Sur 401 : si l'URL est dans `SKIP_LOGOUT_ON_401` (endpoints de chargement initial/tâches de fond — RDV, favoris, messages, notifications, clé publique…), l'erreur est silencieuse ; sinon déconnexion forcée + redirection `/connexion`.
5. `AuthGuard` (routes normales) et `AdminGuard` (routes `/admin`, vérifie `ROLE_ADMIN`/`ROLE_SUPERADMIN`) protègent le routing côté client — la vraie autorisation reste bien sûr appliquée côté back (`WebSecurityConfig.java`).

---

## 8. Pour aller plus loin

- Détail des **entités JPA**, **rôles**, **endpoints publics sans JWT** côté back → `Back-dev-mali/CARTOGRAPHIE.md`.
- Ce fichier est à re-générer/mettre à jour si des routes ou services front changent significativement, ou si les divergences du §5 sont corrigées côté back.
