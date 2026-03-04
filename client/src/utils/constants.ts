// Constantes da aplicação

export const APP_NAME = 'SAAE Linhares';
export const APP_DESCRIPTION = 'Serviço Autônomo de Água e Esgoto de Linhares - ES';

export const PHONE = '(27) 2103-1311';
export const EMAIL = 'atendimento@saaelinhares.com.br';
export const ADDRESS = 'Avenida Barra de São Francisco, 1137 - Colina, Linhares/ES';
export const OFFICE_HOURS = 'Segunda a sexta, 07:30 às 16:30';

export const SOCIAL_MEDIA = {
  facebook: 'https://www.facebook.com/p/SAAE-Linhares-100089921157025/',
  instagram: 'https://www.instagram.com/saaelinhares/'
};

export const EXTERNAL_LINKS = {
  gpi: 'https://gpi.linhares.es.gov.br/ServerExec/acessoBase/',
  portalCliente: 'https://gpi.linhares.es.gov.br/ServerExec/acessoBase/?idPortal=D87C1EC9CDF67AA47D9CEC44E67B1D86',
  webmail: 'https://192.168.0.254/',
  contracheque: 'https://servicos.cloud.el.com.br/es-linhares-saae/portal/login',
  agenciaVirtual: 'https://avsanegraph.com.br/av/sane/index.php',
  transparencia: 'http://saaelinhares-es.portaltp.com.br/'
};

export const BID_STATUS = {
  ABERTA: 'aberta',
  HOMOLOGADA: 'homologada',
  FRACASSADA: 'fracassada',
  ANDAMENTO: 'andamento'
} as const;

export const BID_STATUS_LABELS = {
  [BID_STATUS.ABERTA]: 'Aberta',
  [BID_STATUS.HOMOLOGADA]: 'Homologada',
  [BID_STATUS.FRACASSADA]: 'Fracassada',
  [BID_STATUS.ANDAMENTO]: 'Em Andamento'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
} as const;

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.EDITOR]: 'Editor',
  [USER_ROLES.VIEWER]: 'Visualizador'
};

export const GALLERY_TYPES = {
  PHOTO: 'photo',
  VIDEO: 'video'
} as const;

export const GALLERY_TYPE_LABELS = {
  [GALLERY_TYPES.PHOTO]: 'Fotos',
  [GALLERY_TYPES.VIDEO]: 'Vídeos'
};

export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video'
} as const;

export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  VIDEO: 50 * 1024 * 1024, // 50MB
  DOCUMENT: 10 * 1024 * 1024 // 10MB
};

export const ALLOWED_FILE_TYPES = {
  IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  DOCUMENTS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  VIDEOS: ['.mp4', '.webm', '.ogg']
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  NEWS_PAGE_SIZE: 12,
  GALLERY_PAGE_SIZE: 20
};

export const CACHE_KEYS = {
  USER: '@SAAE:user',
  TOKEN: '@SAAE:token',
  THEME: '@SAAE:theme',
  ACCESSIBILITY: '@SAAE:accessibility'
};

export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
};

export const BREAKPOINTS = {
  xs: 480,
  sm: 768,
  md: 1024,
  lg: 1280,
  xl: 1536
};

export const Z_INDEX = {
  HEADER: 100,
  DROPDOWN: 200,
  MODAL: 1000,
  TOOLTIP: 1500,
  LOADING: 2000
};

export const LOCAL_STORAGE_KEYS = {
  USER: '@SAAE:user',
  TOKEN: '@SAAE:token',
  THEME: '@SAAE:theme',
  ACCESSIBILITY: '@SAAE:accessibility'
} as const;