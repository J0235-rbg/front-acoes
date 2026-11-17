import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  Wand2, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  LayoutGrid,
  ListFilter,
  BarChart3,
  Percent,
  Layers,
  Sparkles,
  Radar as RadarIcon,
  Crown,
  Lock,
  Minus,
  Plus,
  TrendingDown
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { getRanking, getRaioX, sincronizar } from '../service/Api';
import { type StockRanking, type StrategyType } from '../types/Stock';

export default function Dashboard() {
  const navigate = useNavigate();

  const [strategy, setStrategy] = useState<StrategyType>('buffett');
  const [stocks, setStocks] = useState<StockRanking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [raioXModal, setRaioXModal] = useState<StockRanking | null>(null);

  const [limit, setLimit] = useState<number>(15);
  const [isPro, setIsPro] = useState<boolean>(() => {
    return localStorage.getItem('@alphascreen:isPro') === 'true';
  });

  const carregarRanking = async (tipo: StrategyType, qtd: number) => {
    setLoading(true);
    try {
      const data = await getRanking(tipo, qtd);
      setStocks(data);
    } catch (err) {
      console.error("Erro ao carregar ranking:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRanking(strategy, limit);
  }, [strategy, limit]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await sincronizar('java');
      await carregarRanking(strategy, limit);
    } catch (err) {
      console.error("Erro na sincronização:", err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSelectStrategy = (novaEstrategia: StrategyType) => {
    if (!isPro && novaEstrategia !== 'buffett') {
      navigate('/pro');
      return;
    }
    setStrategy(novaEstrategia);
  };

  const handleDirectSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      const acao = await getRaioX(searchTerm.trim().toUpperCase());
      setRaioXModal(acao);
    } catch (err) {
      alert("Ticker não encontrado no banco de dados.");
    }
  };

  const filteredStocks = useMemo(() => {
    if (!searchTerm.trim()) return stocks;
    return stocks.filter(s => 
      s.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stocks, searchTerm]);

  const kpis = useMemo(() => {
    if (!stocks.length) return { mediaDY: 0, mediaROE: 0, aprovadas: 0 };
    const totalDY = stocks.reduce((acc, s) => acc + (s.dividendYield || 0), 0);
    const totalROE = stocks.reduce((acc, s) => acc + (s.roe || 0), 0);
    const aprovadas = stocks.filter(s => 
      strategy === 'buffett' ? s.aprovadoBuffett :
      strategy === 'graham' ? s.aprovadoGraham :
      strategy === 'bazin' ? s.aprovadoBazin : true
    ).length;

    return {
      mediaDY: totalDY / stocks.length,
      mediaROE: totalROE / stocks.length,
      aprovadas
    };
  }, [stocks, strategy]);

  const tickerTapeItems = useMemo(() => {
    if (!stocks.length) {
      return [
        { ticker: 'IBOV', val: '131.250', var: '+0.85%', up: true },
        { ticker: 'PETR4', val: 'R$ 38.40', var: '+1.20%', up: true },
        { ticker: 'VALE3', val: 'R$ 62.10', var: '-0.45%', up: false },
        { ticker: 'WEGE3', val: 'R$ 54.20', var: '+2.10%', up: true },
        { ticker: 'ITUB4', val: 'R$ 35.80', var: '+0.60%', up: true },
      ];
    }
    return stocks.slice(0, 10).map((s, idx) => ({
      ticker: s.ticker,
      val: `R$ ${s.cotacao?.toFixed(2) || '0.00'}`,
      var: s.roe ? `${s.roe > 10 ? '+' : ''}${s.roe.toFixed(1)}% ROE` : 'Score: ' + (s.scoreBuffett || 0),
      up: (idx % 2 === 0)
    }));
  }, [stocks]);

  const radarData = useMemo(() => {
    if (!raioXModal) return [];
    const normBuffett = Math.min(100, Math.max(0, raioXModal.scoreBuffett || 0));
    const normROE = Math.min(100, Math.max(0, (raioXModal.roe || 0) * 3));
    const normROIC = Math.min(100, Math.max(0, (raioXModal.roic || 0) * 4));
    const normDY = Math.min(100, Math.max(0, (raioXModal.dividendYield || 0) * 10));
    const normPL = raioXModal.pl && raioXModal.pl > 0 ? Math.min(100, Math.max(10, 100 - raioXModal.pl * 3)) : 20;

    return [
      { subject: 'Moat (Buffett)', score: normBuffett, fullMark: 100 },
      { subject: 'Rentabilidade (ROE)', score: normROE, fullMark: 100 },
      { subject: 'Eficiência (ROIC)', score: normROIC, fullMark: 100 },
      { subject: 'Proventos (DY)', score: normDY, fullMark: 100 },
      { subject: 'Preço/Lucro', score: normPL, fullMark: 100 },
    ];
  }, [raioXModal]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Ticker Tape */}
      <div className="w-full bg-slate-900/90 border-b border-emerald-500/20 overflow-hidden py-2 backdrop-blur-md sticky top-0 z-40">
        <div className="animate-ticker">
          {[...tickerTapeItems, ...tickerTapeItems, ...tickerTapeItems].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-6 border-r border-slate-800 text-xs font-mono shrink-0">
              <span className="font-bold text-white tracking-wider">{item.ticker}</span>
              <span className="text-slate-300">{item.val}</span>
              <span className={`flex items-center text-[11px] font-semibold ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.up ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {item.var}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="w-full flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Cabeçalho */}
        <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner">
              <TrendingUp className="w-7 h-7" />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                AlphaScreen B3
              </h1>
              <p className="text-slate-400 text-xs md:text-sm font-medium">
                Terminal Quantitativo & Screening Fundamentalista B3
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            {isPro ? (
              <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Crown className="w-4 h-4 fill-amber-400" /> Membro Pro Ativo
              </span>
            ) : (
              <button
                onClick={() => navigate('/pro')}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-lg shadow-amber-950/40 active:scale-95"
              >
                <Crown className="w-4 h-4 fill-slate-950" /> Fazer Upgrade Pro
              </button>
            )}

            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-emerald-400' : ''}`} />
              {syncing ? 'Atualizando...' : 'Sincronizar'}
            </button>
          </div>
        </header>

        {/* Live KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aprovadas no Filtro</span>
              <p className="text-2xl font-bold text-white mt-1">{kpis.aprovadas} <span className="text-xs text-slate-500">/ {stocks.length}</span></p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">DY Médio da Amostra</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{kpis.mediaDY.toFixed(2)}%</p>
            </div>
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
              <Percent className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ROE Médio</span>
              <p className="text-2xl font-bold text-purple-400 mt-1">{kpis.mediaROE.toFixed(2)}%</p>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa Fora do Header */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleDirectSearch} className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Pesquisar qualquer ação (ex: WEGE3, VALE3, PETR4)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-xs text-slate-400 font-medium">Exibir:</span>
              <button 
                onClick={() => setLimit(prev => Math.max(prev - 5, 5))}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Diminuir"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-emerald-400 min-w-6 text-center">{limit}</span>
              <button 
                onClick={() => setLimit(prev => Math.min(prev + 5, 100))}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Aumentar"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Cards Dinâmicos"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Tabela Tradicional"
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Abas das Estratégias */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleSelectStrategy('buffett')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
              strategy === 'buffett' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/60' 
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Warren Buffett
            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/80">Free</span>
          </button>

          <button
            onClick={() => handleSelectStrategy('graham')}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
              isPro 
                ? (strategy === 'graham' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg' : 'bg-slate-900/60 text-slate-400 border-slate-800') 
                : 'bg-slate-900/20 text-slate-500 border-slate-800/40 backdrop-blur-md opacity-40 hover:opacity-70'
            }`}
          >
            {!isPro && <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <Coins className="w-4 h-4" /> Benjamin Graham
            {!isPro && <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">Pro</span>}
          </button>

          <button
            onClick={() => handleSelectStrategy('bazin')}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
              isPro 
                ? (strategy === 'bazin' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-500 shadow-lg' : 'bg-slate-900/60 text-slate-400 border-slate-800') 
                : 'bg-slate-900/20 text-slate-500 border-slate-800/40 backdrop-blur-md opacity-40 hover:opacity-70'
            }`}
          >
            {!isPro && <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <Layers className="w-4 h-4" /> Décio Bazin
            {!isPro && <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">Pro</span>}
          </button>

          <button
            onClick={() => handleSelectStrategy('greenblatt')}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
              isPro 
                ? (strategy === 'greenblatt' ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-purple-500 shadow-lg' : 'bg-slate-900/60 text-slate-400 border-slate-800') 
                : 'bg-slate-900/20 text-slate-500 border-slate-800/40 backdrop-blur-md opacity-40 hover:opacity-70'
            }`}
          >
            {!isPro && <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <Wand2 className="w-4 h-4" /> Fórmula Mágica
            {!isPro && <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">Pro</span>}
          </button>
        </div>

        {/* Display de Ativos */}
        {loading ? (
          <div className="h-72 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
            <span className="text-sm">Computando ativos no radar...</span>
          </div>
        ) : filteredStocks.length === 0 ? (
          <div className="h-72 flex items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-3xl">
            Nenhum ativo localizado com os parâmetros aplicados.
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStocks.map((stock) => (
              <div
                key={stock.ticker}
                onClick={() => setRaioXModal(stock)}
                className="group relative p-6 rounded-3xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-950/20 cursor-pointer overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700/60 flex items-center justify-center font-black text-white text-sm shadow-inner group-hover:border-emerald-500/40 transition-colors">
                      {stock.ticker.slice(0, 4)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base tracking-wide">
                        {stock.ticker}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">B3 Ordinária/Pref</span>
                    </div>
                  </div>

                  {stock.aprovadoBuffett ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Aprovado
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-950/60 border border-slate-800 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3 h-3" /> Neutro
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between py-2 border-b border-slate-800/60">
                  <span className="text-xs text-slate-400">Preço Mercado</span>
                  <span className="text-lg font-bold text-white tracking-tight">R$ {stock.cotacao?.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">P/L</span>
                    <span className="text-xs font-semibold text-slate-200">{stock.pl?.toFixed(1)}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">ROE</span>
                    <span className="text-xs font-semibold text-purple-400">{stock.roe?.toFixed(1)}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">DY</span>
                    <span className="text-xs font-semibold text-emerald-400">{stock.dividendYield?.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-400">Score Moat (Warren Buffett)</span>
                      <span className="text-emerald-400 font-bold">{stock.scoreBuffett || 0}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                        style={{ width: `${stock.scoreBuffett || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-900/40 border border-slate-800/80 overflow-hidden backdrop-blur-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-xs text-slate-400 uppercase font-semibold">
                  <th className="py-4 px-6">Ativo</th>
                  <th className="py-4 px-4 text-right">Cotação</th>
                  <th className="py-4 px-4 text-right">P/L</th>
                  <th className="py-4 px-4 text-right">ROE</th>
                  <th className="py-4 px-4 text-right">ROIC</th>
                  <th className="py-4 px-4 text-right">DY</th>
                  <th className="py-4 px-6 text-center">Score Buffett</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredStocks.map((stock) => (
                  <tr 
                    key={stock.ticker} 
                    onClick={() => setRaioXModal(stock)}
                    className="hover:bg-slate-800/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-6 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {stock.ticker}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">R$ {stock.cotacao?.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right text-slate-400">{stock.pl?.toFixed(1)}</td>
                    <td className="py-3.5 px-4 text-right text-purple-400 font-medium">{stock.roe?.toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-right text-slate-300">{stock.roic?.toFixed(1)}%</td>
                    <td className="py-3.5 px-4 text-right text-emerald-400 font-medium">{stock.dividendYield?.toFixed(1)}%</td>
                    <td className="py-3.5 px-6 text-center">
                      <span className="font-bold text-emerald-400">{stock.scoreBuffett}/100</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Raio-X Detalhado */}
        {raioXModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                    <RadarIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-white">{raioXModal.ticker}</h3>
                    <span className="text-xs text-slate-400">Raio-X Fundamentalista Consolidado</span>
                  </div>
                </div>
                <button 
                  onClick={() => setRaioXModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Radar Chart */}
              <div className="w-full h-60 bg-slate-950/60 rounded-2xl border border-slate-800/80 p-2 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
                    <Radar
                      name={raioXModal.ticker}
                      dataKey="score"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Múltiplos */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] text-slate-500 font-medium block">Cotação Atual</span>
                  <span className="text-base font-bold text-white">R$ {raioXModal.cotacao?.toFixed(2)}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] text-slate-500 font-medium block">Dividend Yield</span>
                  <span className="text-base font-bold text-emerald-400">{raioXModal.dividendYield?.toFixed(2)}%</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] text-slate-500 font-medium block">Score Warren Buffett</span>
                  <span className="text-sm font-bold text-emerald-400">{raioXModal.scoreBuffett ?? 0} / 100</span>
                </div>

                <div className="relative p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 overflow-hidden">
                  {!isPro && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center gap-1.5 text-xs text-amber-400 font-semibold cursor-pointer" onClick={() => navigate('/pro')}>
                      <Lock className="w-3.5 h-3.5" /> Exclusivo Pro
                    </div>
                  )}
                  <span className="text-[11px] text-slate-500 font-medium block">Preço Justo (Graham)</span>
                  <span className="text-sm font-bold text-blue-400">
                    {raioXModal.precoJustoGraham ? `R$ ${raioXModal.precoJustoGraham.toFixed(2)}` : 'N/A'}
                  </span>
                </div>

                <div className="relative p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 overflow-hidden">
                  {!isPro && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center gap-1.5 text-xs text-amber-400 font-semibold cursor-pointer" onClick={() => navigate('/pro')}>
                      <Lock className="w-3.5 h-3.5" /> Exclusivo Pro
                    </div>
                  )}
                  <span className="text-[11px] text-slate-500 font-medium block">Preço Teto (Bazin)</span>
                  <span className="text-sm font-bold text-amber-400">
                    {raioXModal.precoTetoBazin ? `R$ ${raioXModal.precoTetoBazin.toFixed(2)}` : 'N/A'}
                  </span>
                </div>

                <div className="relative p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 overflow-hidden">
                  {!isPro && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center gap-1.5 text-xs text-amber-400 font-semibold cursor-pointer" onClick={() => navigate('/pro')}>
                      <Lock className="w-3.5 h-3.5" /> Exclusivo Pro
                    </div>
                  )}
                  <span className="text-[11px] text-slate-500 font-medium block">Magic Formula Rank</span>
                  <span className="text-sm font-bold text-purple-400">
                    {raioXModal.rankingGreenblatt ? `#${raioXModal.rankingGreenblatt}` : 'N/A'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setRaioXModal(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-all text-sm"
              >
                Fechar Análise
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}