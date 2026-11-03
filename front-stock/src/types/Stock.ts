export interface StockRanking {
    ticker: string;
    nomeEmpresa: string;
    cotacao: number;
    pl: number;
    pvp: number;
    roic: number;
    roe: number;
    dividendYield: number;

    // estratégias de investimento
    scoreBuffett?: number | null;
    aprovadoBuffett?: boolean | null;

    precoJustoGraham?: number | null;
    margemSegurancaGraham?: number | null;
    aprovadoGraham?: boolean | null;
    
    precoTetoBazin?: number | null;
    aprovadoBazin?: boolean | null;

    rankingGreenblatt?: number | null;
    proOnly?: boolean;
}

export type StrategyType = 'buffett' | 'graham' | 'bazin' | 'greenblatt';