import api from './api';

export interface CarouselItem {
  id: number;
  title: string;
  image_path: string;
  location_text: string;
  link?: string;
  order_num: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CarouselCreateData {
  title?: string;
  location_text?: string;
  link?: string;
  active?: boolean;
  image: File;
}

export const carouselService = {
  list: async (): Promise<CarouselItem[]> => {
    const response = await api.get('/carousel');
    return response.data;
  },

  listActive: async (): Promise<CarouselItem[]> => {
    const response = await api.get('/carousel/active');
    return response.data;
  },

  getById: async (id: number): Promise<CarouselItem> => {
    const response = await api.get(`/carousel/${id}`);
    return response.data;
  },

  create: async (data: CarouselCreateData): Promise<CarouselItem> => {
    const formData = new FormData();
    formData.append('image', data.image);
    if (data.title) formData.append('title', data.title);
    if (data.location_text) formData.append('location_text', data.location_text);
    if (data.link) formData.append('link', data.link);
    if (data.active !== undefined) formData.append('active', String(data.active));
    
    const response = await api.post('/carousel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  update: async (id: number, data: Partial<CarouselCreateData>): Promise<CarouselItem> => {
    const formData = new FormData();
    if (data.image) formData.append('image', data.image);
    if (data.title) formData.append('title', data.title);
    if (data.location_text) formData.append('location_text', data.location_text);
    if (data.link) formData.append('link', data.link);
    if (data.active !== undefined) formData.append('active', String(data.active));
    
    const response = await api.put(`/carousel/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/carousel/${id}`);
  },

  moveUp: async (id: number): Promise<void> => {
    await api.post(`/carousel/${id}/move-up`);
  },

  moveDown: async (id: number): Promise<void> => {
    await api.post(`/carousel/${id}/move-down`);
  }
};