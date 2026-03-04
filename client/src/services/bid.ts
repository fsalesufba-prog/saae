import api from './api';

export interface Bid {
  id: number;
  process_number: string;
  modality: string;
  object: string;
  status: 'aberta' | 'homologada' | 'fracassada' | 'andamento';
  publish_date: string;
  opening_date: string;
  document_path?: string;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface BidCreateData {
  process_number: string;
  modality: string;
  object: string;
  status?: string;
  publish_date: string;
  opening_date: string;
  year?: number;
  document?: File;
}

export const bidService = {
  list: async (): Promise<Bid[]> => {
    const response = await api.get('/bids');
    return response.data;
  },

  getById: async (id: number): Promise<Bid> => {
    const response = await api.get(`/bids/${id}`);
    return response.data;
  },

  create: async (data: BidCreateData): Promise<Bid> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as any);
      }
    });
    
    const response = await api.post('/bids', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  update: async (id: number, data: Partial<BidCreateData>): Promise<Bid> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as any);
      }
    });
    
    const response = await api.put(`/bids/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/bids/${id}`);
  },

  getLatest: async (limit: number = 3): Promise<Bid[]> => {
    const response = await api.get(`/bids?limit=${limit}`);
    return response.data;
  }
};