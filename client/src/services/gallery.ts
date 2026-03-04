import api from './api';

export interface Gallery {
  id: number;
  name: string;
  description: string;
  type: 'photo' | 'video';
  cover_image: string;
  created_at: string;
  updated_at: string;
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

export interface GalleryCreateData {
  name: string;
  description?: string;
  type: 'photo' | 'video';
  cover?: File;
}

export const galleryService = {
  list: async (type?: 'photo' | 'video'): Promise<Gallery[]> => {
    const url = type ? `/galleries?type=${type}` : '/galleries';
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id: number): Promise<Gallery> => {
    const response = await api.get(`/galleries/${id}`);
    return response.data;
  },

  create: async (data: GalleryCreateData): Promise<Gallery> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('type', data.type);
    if (data.description) formData.append('description', data.description);
    if (data.cover) formData.append('cover', data.cover);
    
    const response = await api.post('/galleries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  update: async (id: number, data: Partial<GalleryCreateData>): Promise<Gallery> => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.type) formData.append('type', data.type);
    if (data.description) formData.append('description', data.description);
    if (data.cover) formData.append('cover', data.cover);
    
    const response = await api.put(`/galleries/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/galleries/${id}`);
  },

  getMedia: async (galleryId: number): Promise<Media[]> => {
    const response = await api.get(`/galleries/${galleryId}/media`);
    return response.data;
  },

  addMedia: async (galleryId: number, files: File[]): Promise<void> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    await api.post(`/galleries/${galleryId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  updateMedia: async (galleryId: number, mediaId: number, data: { title?: string; description?: string }): Promise<void> => {
    await api.put(`/galleries/${galleryId}/media/${mediaId}`, data);
  },

  deleteMedia: async (galleryId: number, mediaId: number): Promise<void> => {
    await api.delete(`/galleries/${galleryId}/media/${mediaId}`);
  },

  moveMedia: async (galleryId: number, mediaId: number, direction: 'up' | 'down'): Promise<void> => {
    await api.post(`/galleries/${galleryId}/media/${mediaId}/${direction}`);
  }
};