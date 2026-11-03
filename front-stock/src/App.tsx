import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Coins,
  Wand2,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { getRanking, getRaioX, sincronizar } from './service/Api';
import type { StockRanking, StrategyType } from './types/Stock';
import './App.css'

export default function App() {
  const [strategy, setStrategy] = useState<StrategyType>('buffett');
  const [stocks, setStock] = useState<StockRanking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [raioXModal, setRaioXModal] = useState<StockRanking | null>(null);

  const carregarRanking = async (tipo: StrategyType) => {
    setLoading(true);
    try {
      const data = await getRanking(tipo, 20);
      setStock(data);
    } catch (err){
      console.error('Erro ao carregar ranking:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    carregarRanking(strategy);
  }, [strategy]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await sincronizar('java');
      await carregarRanking(strategy);
    } catch (err) {
      console.error('Erro ao sincronizar:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const acao = await getRaioX(searchQuery.trim().toUpperCase());
      setRaioXModal(acao);
    } catch (err) {
      alert('Ticker não encontrado no banco de dados.');
    }
  };

  return (
    <div className='min-h-screen bg-slate-950 p-4 texte-slate-100 p-6 md:p-10 font-sans'>
      <div className='max-w-7xl mx-auto space-y-8'>

        {/* Cabeçalho */}
        <header className='flex flex-col md:flex-row md:items-center justify-center gap-4 border-b border-slate-800 pb-6'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-white flex items-center gap-2'>
              <TrendingUp className='text-emerald-500 w-8 h-8' />
              Radar Fundamentalista B3
            </h1>
            <p className='text-slate-400 text-sm mt-1'>
              Screening automatizado: Buffett, Graham, Bazin e Greenblatt alimentado por Spring Boot & Supabase 
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <form onSubmit={handleSearch} className='relative'>
              <input
                type='text'
                placeholder='Buscar ticker (ex: WEG3)...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 w-56'
                />
                <Search className='w-4 h-4 text-slate-400 absolute left-3 top-2.5' />
            </form>
            <button
              onClick={handleSync}
              disabled={syncing}
              className='flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all'
              >
                <RefreshCw className={`'w-4 h-4 ${syncing ? 'animate-spin': ''}`} />
                {syncing ? 'Sincronizando...' : 'Sincronizar B3'}
              </button>
          </div>
        </header>

      {/* Seleção de Estratégias */}
        <nav className="flex gap-2 p-1.5 bg-slate-900 rounded-xl border border-slate-800/80 w-fit">
          <button
            onClick={() => setStrategy('buffett')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              strategy === 'buffett' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Warren Buffett
          </button>

          <button
            onClick={() => setStrategy('graham')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              strategy === 'graham' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" /> Benjamin Graham
          </button>

          <button
            onClick={() => setStrategy('bazin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              strategy === 'bazin' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Décio Bazin
          </button>

          <button
            onClick={() => setStrategy('greenblatt')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              strategy === 'greenblatt' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-4 h-4" /> Joel Greenblatt
          </button>
        </nav>

        {/* Tabela de Rankings */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
          {loading ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
              Carregando ativos do ranking...
            </div>
          ) : stocks.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              Nenhuma ação atendeu aos filtros da metodologia selecionada.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Ativo</th>
                  <th className="py-4 px-4 text-right">Cotação</th>
                  <th className="py-4 px-4 text-right">P/L</th>
                  <th className="py-4 px-4 text-right">P/VP</th>
                  <th className="py-4 px-4 text-right">ROE</th>
                  <th className="py-4 px-4 text-right">ROIC</th>
                  <th className="py-4 px-4 text-right">DY</th>
                  <th className="py-4 px-6 text-center">Destaque Metodologia</th>
                  <th className="py-4 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {stocks.map((stock) => (
                  <tr 
                    key={stock.ticker} 
                    onClick={() => setRaioXModal(stock)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {stock.ticker}
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-slate-200">
                      R$ {stock.cotacao?.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-300">{stock.pl?.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right text-slate-300">{stock.pvp?.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right text-slate-300">{stock.roe?.toFixed(2)}%</td>
                    <td className="py-4 px-4 text-right text-slate-300">{stock.roic?.toFixed(2)}%</td>
                    <td className="py-4 px-4 text-right text-emerald-400 font-medium">
                      {stock.dividendYield?.toFixed(2)}%
                    </td>

                    {/* Coluna Dinâmica por Estratégia */}
                    <td className="py-4 px-6 text-center">
                      {strategy === 'buffett' && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Score: {stock.scoreBuffett}/100
                        </span>
                      )}
                      {strategy === 'graham' && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-950 text-blue-400 border border-blue-800">
                          Preço Justo: R$ {stock.precoJustoGraham?.toFixed(2)} ({stock.margemSegurancaGraham?.toFixed(1)}%)
                        </span>
                      )}
                      {strategy === 'bazin' && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">
                          Preço Teto: R$ {stock.precoTetoBazin?.toFixed(2)}
                        </span>
                      )}
                      {strategy === 'greenblatt' && (
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-950 text-purple-400 border border-purple-800">
                          Posição: #{stock.rankingGreenblatt}
                        </span>
                      )}
                    </td>

                    {/* Status de Aprovação */}
                    <td className="py-4 px-6 text-center">
                      {(strategy === 'buffett' ? stock.aprovadoBuffett :
                        strategy === 'graham' ? stock.aprovadoGraham :
                        strategy === 'bazin' ? stock.aprovadoBazin : true) ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Aprovado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 text-xs font-medium">
                          <XCircle className="w-4 h-4" /> Fora do Corte
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal de Raio-X Detalhado */}
        {raioXModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Raio-X: {raioXModal.ticker}
                </h3>
                <button 
                  onClick={() => setRaioXModal(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 text-xs block">Cotação Atual</span>
                  <span className="font-semibold text-white text-base">R$ {raioXModal.cotacao?.toFixed(2)}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 text-xs block">Dividend Yield</span>
                  <span className="font-semibold text-emerald-400 text-base">{raioXModal.dividendYield?.toFixed(2)}%</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 text-xs block">Preço Justo (Graham)</span>
                  <span className="font-semibold text-white text-base">
                    {raioXModal.precoJustoGraham ? `R$ ${raioXModal.precoJustoGraham.toFixed(2)}` : 'N/A'}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 text-xs block">Preço Teto (Bazin)</span>
                  <span className="font-semibold text-white text-base">
                    {raioXModal.precoTetoBazin ? `R$ ${raioXModal.precoTetoBazin.toFixed(2)}` : 'N/A'}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 text-xs block">Score Warren Buffett</span>
                  <span className="font-semibold text-white text-base">{raioXModal.scoreBuffett ?? 0} / 100</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 text-xs block">Magic Formula Rank</span>
                  <span className="font-semibold text-white text-base">
                    {raioXModal.rankingGreenblatt ? `#${raioXModal.rankingGreenblatt}` : 'N/A'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setRaioXModal(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}