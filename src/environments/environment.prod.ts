// =====================================================
// ENVIRONNEMENT PRODUCTION
// =====================================================
// OPTION A — Backend sur le même serveur (URL relative) :
//   Laissez BACKEND_HOST vide : ''
//
// OPTION B — Backend sur un serveur différent :
//   Mettez l'URL complète : 'https://api.mondomaine.com'
//
// Le WebSocket est calculé automatiquement depuis
// window.location (wss:// si HTTPS, ws:// sinon).
// =====================================================

const BACKEND_HOST = ''; // ← changer ici si backend sur autre serveur

export const environment = {
  production: true,
  Url_BASE:  BACKEND_HOST ? `${BACKEND_HOST}/api/` : '/api/',
  Url_PHOTO: BACKEND_HOST ? `${BACKEND_HOST}` : '',
  Url_WS:    '', // calculé dynamiquement dans websocket.service.ts
  googleClientId: 'VOTRE_GOOGLE_CLIENT_ID_PRODUCTION',
};
