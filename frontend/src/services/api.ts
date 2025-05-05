import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface Article {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  publish_date?: string;
}

export const api = {
  // Get all articles
  getArticles: async () => {
    const response = await axios.get(`${API_BASE_URL}/articles`);
    return response.data;
  },

  // Get single article
  getArticle: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/articles/${id}`);
    return response.data;
  },

  // Create article
  createArticle: async (article: Omit<Article, '_id'>) => {
    const response = await axios.post(`${API_BASE_URL}/articles`, article);
    return response.data;
  },

  // Update article
  updateArticle: async (id: string, article: Omit<Article, '_id'>) => {
    const response = await axios.put(`${API_BASE_URL}/articles/${id}`, article);
    return response.data;
  },

  // Delete article
  deleteArticle: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/articles/${id}`);
    return response.data;
  },
}; 