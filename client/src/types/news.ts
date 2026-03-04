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
  created_by?: number;
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