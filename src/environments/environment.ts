// =====================================================
// ENVIRONNEMENT DÉVELOPPEMENT
// =====================================================
// Pour changer de serveur backend, modifiez BACKEND_HOST
// Exemple : 'http://192.168.1.10:8080' ou 'http://monserveur.com'
// =====================================================

const BACKEND_HOST = 'http://localhost:8080';

export const environment = {
  production: false,
  Url_BASE:  `${BACKEND_HOST}/api/`,
  Url_PHOTO: `${BACKEND_HOST}`,
  Url_WS:    `ws://${BACKEND_HOST.replace(/^https?:\/\//, '')}/ws`,
  googleClientId: 'VOTRE_GOOGLE_CLIENT_ID',
};
