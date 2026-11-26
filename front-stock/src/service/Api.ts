import axios from 'axios';
import { type StockRanking, type StrategyType } from '../types/Stock';

export interface AuthResponse {
  id: number;
  nome: string;
  email: string;
  plano: 'Free' | 'Pro';
  isPro: boolean;
  dataExpiracaoPlano: string | null;
  token: string;
}

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

// Injeta o JWT automaticamente em todas as requisições se estiver salvo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@alphascreen:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Endpoints de Autenticação
export const loginUsuario = async (email: string, senha: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, senha });
  return data;
};

export const registrarUsuario = async (nome: string, email: string, senha: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/registrar', { nome, email, senha });
  return data;
};

export const getPerfilAtual = async (): Promise<Omit<AuthResponse, 'token'>> => {
  const { data } = await api.get<Omit<AuthResponse, 'token'>>('/auth/me');
  return data;
};

export const ativarPlanoPro = async (): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/upgrade-pro');
  return data;
};

// Endpoints de Ações
export const getRanking = async (strategy: StrategyType, limit = 15): Promise<StockRanking[]> => {
  const { data } = await api.get<StockRanking[]>(`/acoes/${strategy}`, {
    params: { limit }
  });
  return data;
};

export const getRaioX = async (ticker: string): Promise<StockRanking> => {
  const { data } = await api.get<StockRanking>(`/acoes/${ticker}`);
  return data;
};

export const sincronizar = async (tipo: 'java' | 'python' = 'java'): Promise<string> => {
  const { data } = await api.post<string>(`/acoes/sincronizar-${tipo}`);
  return data;
};

export const criarCheckoutPro = async (): Promise<string> => {
  const { data } = await api.post<{checkoutUrl: string }>('/pagamentos/checkout');
  return data.checkoutUrl;
}

export const getFavoritos = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>('/favoritos');
  return data;
}

export const toggleFavorito = async (ticker: string): Promise<{ ticker: string; favoritado: boolean }> => {
  const { data } = await api.post<{ ticker: string; favoritado: boolean }>(`/favoritos/${ticker}/toggle`);
  return data;
}