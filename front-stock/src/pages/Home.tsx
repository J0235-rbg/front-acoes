import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ShieldCheck,
  Coins,
  Layers,
  Wand2,
  ArrowRight,
  BookOpen,
  Award,
  Calculator,
  ChevronRight,
  Sparkles,
  Crown,
  BarChart2
} from 'lucide-react';

interface StrategyProfile {
  id: 'buffett' | 'graham' | 'bazin' | 'greenblatt';
  name: string;
  title: string;
  era: string;
  tier: 'Free' | 'Pro';
  accentColor: string;
  badgeBg: string;
  borderActive: string;
  historicalReturn: string;
  returnContext: string;
  quote: string;
  biography: string;
  formulaTitle: string;
  formula: string;
  criteria: string[];
}

const STRATEGIES_DATA: StrategyProfile[] = [
  {
    id: 'buffett',
    name: 'Warren Buffett',
    title: 'O Oráculo de Omaha & Fosso Econômico (Moat)',
    era: '1965 – Presente • Berkshire Hathaway',
    tier: 'Free',
    accentColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    borderActive: 'border-emerald-500/60 bg-emerald-950/20 shadow-emerald-950/40',
    historicalReturn: '~19,8% ao ano',
    returnContext: 'Média composta da Berkshire Hathaway (1965–2023), quase o dobro do S&P 500 no mesmo período.',
    quote: '“É muito melhor comprar uma empresa maravilhosa a um preço justo do que uma empresa justa a um preço maravilhoso.”',
    biography:
      'Aluno de Benjamin Graham em Columbia, Buffett evoluiu do Value Investing puramente estatístico para a busca por negócios com vantagens competitivas duráveis (Moats). Em vez de comprar empresas baratas em declínio, passou a focar em companhias altamente lucrativas, com baixo endividamento e retornos consistentes sobre o patrimônio.',
    formulaTitle: 'Score Proprietário de Qualidade & Moat (0 a 100)',
    formula: 'ROE > 15%  +  ROIC > 12%  +  Dívida Líq./EBITDA < 2,0x  +  Margem Líquida Sólida',
    criteria: [
      'Alta rentabilidade sobre o capital próprio (ROE) e capital investido (ROIC)',
      'Endividamento controlado frente à geração operacional de caixa (EBITDA)',
      'Consistência de margens operacionais e liquidez corrente saudável'
    ]
  },
  {
    id: 'graham',
    name: 'Benjamin Graham',
    title: 'O Pai do Value Investing & Margem de Segurança',
    era: '1928 – 1976 • Autor de "O Investidor Inteligente"',
    tier: 'Pro',
    accentColor: 'text-blue-400',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    borderActive: 'border-blue-500/60 bg-blue-950/20 shadow-blue-950/40',
    historicalReturn: '~17,0% ao ano',
    returnContext: 'Retorno anualizado histórico da Graham-Newman Corp durante mais de duas décadas em Wall Street.',
    quote: '“O segredo do investimento sólido resume-se em três palavras: Margem de Segurança.”',
    biography:
      'Após perder grande parte de seu capital no crash de 1929, Graham dedicou sua vida a criar métodos matemáticos rigorosos para separar investimento de especulação. Criou o conceito do "Sr. Mercado" e desenvolveu a equação clássica de Valor Intrínseco para comprar ativos negociados bem abaixo de seu patrimônio e lucro.',
    formulaTitle: 'Equação do Valor Intrínseco de Graham',
    formula: 'Preço Justo = √( 22,5 × LPA × VPA )',
    criteria: [
      'Ação negociada com desconto real frente ao seu Preço Justo calculado',
      'Múltiplos conservadores: P/L moderado e P/VP equilibrado (produto P/L × P/VP ≤ 22,5)',
      'Lucros positivos recorrentes e liquidez corrente acima de 1,5x'
    ]
  },
  {
    id: 'bazin',
    name: 'Décio Bazin',
    title: 'O Mestre dos Dividendos na Bolsa Brasileira',
    era: '1960 – 1992 • Autor de "Faça Fortuna com Ações"',
    tier: 'Pro',
    accentColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderActive: 'border-amber-500/60 bg-amber-950/20 shadow-amber-950/40',
    historicalReturn: 'Cash Yield > 6% a.a.',
    returnContext: 'Foco em geração de renda passiva isenta em dólar/real com reinvestimento sistemático de proventos.',
    quote: '“O dividendo é o único sinal objetivo de que o lucro de uma empresa é verdadeiro e chega ao bolso do acionista.”',
    biography:
      'Jornalista econômico e operador veterano da Bolsa de Valores de São Paulo, Décio Bazin formulou um método adaptado especificamente à realidade brasileira. Sua tese rejeita especulação de curto prazo e estabelece um piso mínimo de 6% de retorno em dividendos anuais (Cash Yield) como filtro absoluto de entrada.',
    formulaTitle: 'Cálculo do Preço Teto de Bazin',
    formula: 'Preço Teto = Dividendo por Ação (DPA) ÷ 0,06',
    criteria: [
      'Dividend Yield mínimo de 6% ao ano sobre a cotação atual',
      'Preço de tela obrigatoriamente abaixo do Preço Teto calculado',
      'Empresas geradoras de caixa previsível e sem endividamento excessivo'
    ]
  },
  {
    id: 'greenblatt',
    name: 'Joel Greenblatt',
    title: 'A Fórmula Mágica (Magic Formula)',
    era: '1985 – Presente • Gotham Capital',
    tier: 'Pro',
    accentColor: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    borderActive: 'border-purple-500/60 bg-purple-950/20 shadow-purple-950/40',
    historicalReturn: '~30,8% ao ano',
    returnContext: 'Desempenho histórico documentado em backtests quantitativos de 17 anos no mercado americano.',
    quote: '“Comprar boas empresas a preços de barganha é o segredo para bater o mercado sistematicamente.”',
    biography:
      'Gestor da Gotham Capital e professor da Columbia Business School, Greenblatt sintetizou os ensinamentos de Buffett e Graham em um algoritmo puramente quantitativo. Em vez de opiniões subjetivas, ele criou um sistema de ranqueamento duplo que cruza eficiência operacional com múltiplo de desconto.',
    formulaTitle: 'Algoritmo de Ranqueamento Combinado',
    formula: 'Rank Final = Posição(Menor P/L ou EV/EBIT) + Posição(Maior ROIC)',
    criteria: [
      'Ordena todas as empresas elegíveis da bolsa pela maior rentabilidade (ROIC)',
      'Ordena simultaneamente pelo menor múltiplo de preço sobre lucro (Earnings Yield)',
      'Seleciona as companhias com a menor soma combinada de posições'
    ]
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<'buffett' | 'graham' | 'bazin' | 'greenblatt'>('buffett');

  const activeStrategy = STRATEGIES_DATA.find((s) => s.id === selectedId) || STRATEGIES_DATA[0];

  const getIcon = (id: string) => {
    switch (id) {
      case 'buffett':
        return <ShieldCheck className="w-5 h-5" />;
      case 'graham':
        return <Coins className="w-5 h-5" />;
      case 'bazin':
        return <Layers className="w-5 h-5" />;
      case 'greenblatt':
        return <Wand2 className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      
      {/* Navbar Minimalista */}
      <nav className="w-full border-b border-slate-900/90 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-black text-lg tracking-tight text-white">
              AlphaScreen <span className="text-emerald-400">B3</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/pro')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 px-3 py-2 rounded-xl hover:bg-amber-500/10 transition-colors"
            >
              <Crown className="w-3.5 h-3.5" /> Planos Pro
            </button>
            <button
              onClick={() => navigate('/radar')}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-950/50 active:scale-95"
            >
              Abrir Radar de Ações <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
        
        <section className="relative text-center max-w-3xl mx-auto space-y-6">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" /> Inteligência Quantitativa Aplicada à Bolsa Brasileira
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Invista com os métodos dos <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">maiores estrategistas</span> da história.
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Nosso motor analisa diariamente centenas de empresas listadas na B3 e aplica automaticamente as fórmulas de valuation e qualidade consagradas pelo mercado.
          </p>

          {/* CTA Intermediário (Meio da Página) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/radar')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-7 py-4 rounded-2xl text-sm shadow-xl shadow-emerald-950/60 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <BarChart2 className="w-5 h-5" /> Acessar Radar de Ações Agora
            </button>
            <a
              href="#metodologias"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-6 py-4 rounded-2xl text-sm transition-colors"
            >
              Explorar Metodologias
            </a>
          </div>
        </section>

        {/* Seção Interativa: Clique na Estratégia para ver História, Fórmula e Rendimento */}
        <section id="metodologias" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Selecione uma Estratégia para Explorar
            </h2>
            <p className="text-slate-400 text-sm">
              Clique nos cards abaixo para conhecer a história do investidor, o rendimento histórico e a equação matemática utilizada.
            </p>
          </div>

          {/* 4 Botões / Cards Seletivos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STRATEGIES_DATA.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer ${
                    isSelected
                      ? `${item.borderActive} shadow-xl -translate-y-1`
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${item.accentColor}`}>
                      {getIcon(item.id)}
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${item.badgeBg}`}>
                      {item.tier}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base flex items-center justify-between">
                      {item.name}
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-white' : 'text-slate-600'}`} />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{item.era}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Painel Dinâmico de Detalhes da Estratégia Selecionada */}
          <div className="rounded-3xl bg-slate-900/50 border border-slate-800/90 p-6 md:p-10 backdrop-blur-xl shadow-2xl transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Coluna Esquerda: História e Citação (7 colunas) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${activeStrategy.accentColor}`}>
                      {activeStrategy.era}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white">
                    {activeStrategy.title}
                  </h3>
                </div>

                <blockquote className="p-4 rounded-2xl bg-slate-950/80 border-l-4 border-emerald-500 text-slate-300 italic text-sm md:text-base">
                  {activeStrategy.quote}
                </blockquote>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-slate-400" /> Contexto Histórico & Filosofia
                  </h4>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    {activeStrategy.biography}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Critérios Aplicados pelo Algoritmo
                  </h4>
                  <ul className="space-y-2">
                    {activeStrategy.criteria.map((crit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 bg-current ${activeStrategy.accentColor}`} />
                        {crit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Coluna Direita: Rendimento Histórico & Fórmula Matemática (5 colunas) */}
              <div className="lg:col-span-5 space-y-5">
                {/* Card de Rendimento */}
                <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Award className={`w-4 h-4 ${activeStrategy.accentColor}`} /> Rendimento Histórico
                    </span>
                  </div>
                  <div className={`text-3xl md:text-4xl font-black ${activeStrategy.accentColor}`}>
                    {activeStrategy.historicalReturn}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {activeStrategy.returnContext}
                  </p>
                </div>

                {/* Card da Fórmula */}
                <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-slate-400" /> {activeStrategy.formulaTitle}
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 text-center font-semibold">
                    {activeStrategy.formula}
                  </div>
                </div>

                {/* Botão Contextual */}
                <button
                  onClick={() => navigate('/radar')}
                  className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-emerald-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 group"
                >
                  Ver Ações Ranqueadas por {activeStrategy.name}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* Banner Final (Rodapé de Chamada para o Radar) */}
        <section className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/20 p-8 md:p-12 text-center space-y-6 overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Pronto para ver quais ações da B3 passam nos filtros hoje?
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Acesse o terminal interativo, pesquise qualquer ticker da bolsa e compare os indicadores em tempo real.
            </p>
            <div className="pt-3">
              <button
                onClick={() => navigate('/radar')}
                className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-emerald-950/60 active:scale-95"
              >
                Ir para o Radar de Ações <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}