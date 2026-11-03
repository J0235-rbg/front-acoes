import axios from "axios";
import type { StockRanking, StrategyType } from "../types/Stock";

const api = axios.create({
    baseURL: "http://localhost:8081/api/acoes"
});

export const getRanking = async (strategy: StrategyType, limit = 15): Promise<StockRanking[]> => {
    const { data } = await api.get<StockRanking[]>(`/${strategy}`, {
        params: { limit }
    });
    return data;
};

export const getRaioX = async (ticker: string): Promise<StockRanking> => {
    const { data } = await api.get<StockRanking>(`/${ticker}`);
    return data;
};

export const sincronizar = async (tipo: 'java' | 'python' = 'java'): Promise<string> => {
    const { data } = await api.get<string>(`/sincronizar/${tipo}`)
    return data;
}