import api from './api';

export interface News {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_path: string | null;
  author: string;
  published: boolean;
  publish_date: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface NewsCreateData {
  title: string;
  summary: string;
  content: string;
  author: string;
  published?: boolean;
  publish_date?: string;
  image?: File;
}

export const newsService = {
  list: async (published?: boolean, limit?: number): Promise<News[]> => {
    let url = '/news';
    const params = new URLSearchParams();
    if (published !== undefined) params.append('published', String(published));
    if (limit) params.append('limit', String(limit));
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await api.get(url);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<News> => {
    const response = await api.get(`/news/slug/${slug}`);
    return response.data;
  },

  getById: async (id: number): Promise<News> => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  create: async (data: NewsCreateData): Promise<News> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('summary', data.summary);
    formData.append('content', data.content);
    formData.append('author', data.author);
    if (data.published !== undefined) formData.append('published', String(data.published));
    if (data.publish_date) formData.append('publish_date', data.publish_date);
    if (data.image) formData.append('image', data.image);
    
    const response = await api.post('/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  update: async (id: number, data: Partial<NewsCreateData>): Promise<News> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.summary) formData.append('summary', data.summary);
    if (data.content) formData.append('content', data.content);
    if (data.author) formData.append('author', data.author);
    if (data.published !== undefined) formData.append('published', String(data.published));
    if (data.publish_date) formData.append('publish_date', data.publish_date);
    if (data.image) formData.append('image', data.image);
    
    const response = await api.put(`/news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/news/${id}`);
  },

  togglePublish: async (id: number, published: boolean): Promise<void> => {
    await api.patch(`/news/${id}`, { published });
  },

  getLatest: async (limit: number = 3): Promise<News[]> => {
    const response = await api.get(`/news?limit=${limit}&published=true`);
    return response.data;
  }
};