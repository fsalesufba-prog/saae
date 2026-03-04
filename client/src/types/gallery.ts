export interface Gallery {
  id: number;
  name: string;
  description: string;
  type: 'photo' | 'video';
  cover_image: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
}

export interface GalleryCreateData {
  name: string;
  description?: string;
  type: 'photo' | 'video';
  cover?: File;
}

export interface GalleryUpdateData {
  name?: string;
  description?: string;
  type?: 'photo' | 'video';
  cover?: File;
}

export interface Media {
  id: number;
  gallery_id: number;
  title?: string;
  description?: string;
  file_path: string;
  thumbnail_path?: string;
  type: 'image' | 'video';
  order_num: number;
  created_at: string;
}

export interface MediaCreateData {
  title?: string;
  description?: string;
  file: File;
}

export interface MediaUpdateData {
  title?: string;
  description?: string;
}

export interface MediaUploadResponse {
  message: string;
  files: {
    id: number;
    file_path: string;
  }[];
}

export const GALLERY_TYPES = {
  PHOTO: 'photo',
  VIDEO: 'video'
} as const;

export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video'
} as const;

export type GalleryType = typeof GALLERY_TYPES[keyof typeof GALLERY_TYPES];
export type MediaType = typeof MEDIA_TYPES[keyof typeof MEDIA_TYPES];