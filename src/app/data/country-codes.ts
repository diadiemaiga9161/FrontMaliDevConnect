export interface CountryCode {
  nom: string;
  indicatif: string;
  drapeau: string;
  iso: string;
}

// Liste des indicatifs téléphoniques internationaux, Mali en premier (pays principal de la plateforme)
export const COUNTRY_CODES: CountryCode[] = [
  { nom: 'Mali', indicatif: '+223', drapeau: '🇲🇱', iso: 'ML' },
  { nom: 'Sénégal', indicatif: '+221', drapeau: '🇸🇳', iso: 'SN' },
  { nom: 'Côte d\'Ivoire', indicatif: '+225', drapeau: '🇨🇮', iso: 'CI' },
  { nom: 'Burkina Faso', indicatif: '+226', drapeau: '🇧🇫', iso: 'BF' },
  { nom: 'Niger', indicatif: '+227', drapeau: '🇳🇪', iso: 'NE' },
  { nom: 'Guinée', indicatif: '+224', drapeau: '🇬🇳', iso: 'GN' },
  { nom: 'Mauritanie', indicatif: '+222', drapeau: '🇲🇷', iso: 'MR' },
  { nom: 'Bénin', indicatif: '+229', drapeau: '🇧🇯', iso: 'BJ' },
  { nom: 'Togo', indicatif: '+228', drapeau: '🇹🇬', iso: 'TG' },
  { nom: 'Ghana', indicatif: '+233', drapeau: '🇬🇭', iso: 'GH' },
  { nom: 'Nigeria', indicatif: '+234', drapeau: '🇳🇬', iso: 'NG' },
  { nom: 'Gambie', indicatif: '+220', drapeau: '🇬🇲', iso: 'GM' },
  { nom: 'Guinée-Bissau', indicatif: '+245', drapeau: '🇬🇼', iso: 'GW' },
  { nom: 'Sierra Leone', indicatif: '+232', drapeau: '🇸🇱', iso: 'SL' },
  { nom: 'Liberia', indicatif: '+231', drapeau: '🇱🇷', iso: 'LR' },
  { nom: 'Cameroun', indicatif: '+237', drapeau: '🇨🇲', iso: 'CM' },
  { nom: 'Tchad', indicatif: '+235', drapeau: '🇹🇩', iso: 'TD' },
  { nom: 'Algérie', indicatif: '+213', drapeau: '🇩🇿', iso: 'DZ' },
  { nom: 'Maroc', indicatif: '+212', drapeau: '🇲🇦', iso: 'MA' },
  { nom: 'Tunisie', indicatif: '+216', drapeau: '🇹🇳', iso: 'TN' },
  { nom: 'Libye', indicatif: '+218', drapeau: '🇱🇾', iso: 'LY' },
  { nom: 'Égypte', indicatif: '+20', drapeau: '🇪🇬', iso: 'EG' },
  { nom: 'RD Congo', indicatif: '+243', drapeau: '🇨🇩', iso: 'CD' },
  { nom: 'Congo', indicatif: '+242', drapeau: '🇨🇬', iso: 'CG' },
  { nom: 'Gabon', indicatif: '+241', drapeau: '🇬🇦', iso: 'GA' },
  { nom: 'Rwanda', indicatif: '+250', drapeau: '🇷🇼', iso: 'RW' },
  { nom: 'Kenya', indicatif: '+254', drapeau: '🇰🇪', iso: 'KE' },
  { nom: 'Afrique du Sud', indicatif: '+27', drapeau: '🇿🇦', iso: 'ZA' },
  { nom: 'France', indicatif: '+33', drapeau: '🇫🇷', iso: 'FR' },
  { nom: 'Belgique', indicatif: '+32', drapeau: '🇧🇪', iso: 'BE' },
  { nom: 'Suisse', indicatif: '+41', drapeau: '🇨🇭', iso: 'CH' },
  { nom: 'Canada', indicatif: '+1', drapeau: '🇨🇦', iso: 'CA' },
  { nom: 'États-Unis', indicatif: '+1', drapeau: '🇺🇸', iso: 'US' },
  { nom: 'Royaume-Uni', indicatif: '+44', drapeau: '🇬🇧', iso: 'GB' },
  { nom: 'Allemagne', indicatif: '+49', drapeau: '🇩🇪', iso: 'DE' },
  { nom: 'Espagne', indicatif: '+34', drapeau: '🇪🇸', iso: 'ES' },
  { nom: 'Italie', indicatif: '+39', drapeau: '🇮🇹', iso: 'IT' },
  { nom: 'Chine', indicatif: '+86', drapeau: '🇨🇳', iso: 'CN' },
  { nom: 'Émirats Arabes Unis', indicatif: '+971', drapeau: '🇦🇪', iso: 'AE' },
];

export const DEFAULT_COUNTRY_CODE = COUNTRY_CODES[0]; // Mali
