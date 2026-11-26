import React, { useState } from 'react';
import { Crown, Check, ArrowLeft, Shield, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ativarPlanoPro, criarCheckoutPro, getPerfilAtual } from '../service/Api';

export default function ProPricing() {
  const navigate = useNavigate();

  const [aguardandoPagamento, setAguardandoPagamento] = useState(false);

  const handleSubscribe = async () => {
    const token = localStorage.getItem('@alphascreen:token');
    if (!token) {
      navigate('/login?redirect=/pro');
      return;
    }

    try {
      const checkoutUrl = await criarCheckoutPro();
      // Redireciona para a tela de pagamento do Mercado Pago em uma nova tela (PIX / Cartão)
      window.open(checkoutUrl, '_blank');
      setAguardandoPagamento(true);
      // Inicia a verificação automatica a cada 3 segundos no backend
      const interval = setInterval(async () => {
        try{
          const perfil = await getPerfilAtual();
          if(perfil.isPro){
            clearInterval(interval);
            localStorage.setItem('@alphascreen:isPro', 'true');
            navigate('/radar?pagamento=sucesso');
          }
        } catch {
          // ignora erros trasitórios de rede durante a verificação
        }
      }, 3000);
      // Para o polling após 10 segundos por segurança 
      setTimeout(() => clearInterval(interval), 600000);
      
    } catch (err: any) {
      const msg = err.response?.data?.erro || 'Erro ao iniciar pagamento. Verifique o console do backend';
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      <div className="w-full flex-1 max-w-5xl mx-auto px-4 py-12 space-y-12">
        
        {/* Botão de retorno para o terminal */}
        <button
          onClick={() => navigate('/radar')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold p-2.5 rounded-xl hover:bg-slate-900 w-fit border border-slate-800/80"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Terminal Free
        </button>

        {/* Título de Conversão SaaS */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-2 shadow-inner">
            <Crown className="w-4 h-4 fill-amber-400 text-amber-400" /> AlphaScreen Pro Member
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Desbloqueie o Screening Completo da <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">Bolsa Brasileira</span>
          </h1>
          <p className="text-slate-400 text-base">
            Tenha acesso instantâneo aos modelos quantitativos de Benjamin Graham, Décio Bazin e à Fórmula Mágica de Greenblatt, sem limitações de cota ou bloqueios de tela.
          </p>
        </div>

        {/* Comparativo de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card Free */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Plano Básico</h3>
              <p className="text-slate-400 text-sm">Screening inicial com estratégia clássica de Moat.</p>
              <div className="text-3xl font-black text-white">R$ 0 <span className="text-sm font-normal text-slate-400">/mês</span></div>
              
              <ul className="space-y-3 pt-6 border-t border-slate-800/80 text-sm">
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400" /> Ranking Warren Buffett (Score Moat)
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400" /> Sincronização diária de dados da B3
                </li>
                <li className="flex items-center gap-2 text-slate-500 line-through">
                  Preço Justo & Margem de Graham
                </li>
                <li className="flex items-center gap-2 text-slate-500 line-through">
                  Preço Teto de Décio Bazin
                </li>
                <li className="flex items-center gap-2 text-slate-500 line-through">
                  Ranking Fórmula Mágica (Greenblatt)
                </li>
                <li className="flex items-center gap-2 text-slate-500 line-through">
                  Radar Fundamentalista Multidimensional
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full mt-8 py-3.5 rounded-xl bg-slate-800/80 text-slate-500 font-semibold text-sm cursor-not-allowed border border-slate-700/40"
            >
              Plano Gratuito Ativo
            </button>
          </div>

          {/* Card Pro */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-b from-amber-950/20 via-slate-900/90 to-slate-900 border-2 border-amber-500/60 shadow-2xl shadow-amber-950/40 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] uppercase px-4 py-1 rounded-bl-xl tracking-wider">
              Acesso Total
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" /> Assinatura Anual Alpha Pro
              </div>
              <h3 className="text-2xl font-black text-white">Plano Profissional</h3>
              <p className="text-slate-400 text-sm">Todas as ferramentas quantitativas liberadas sem limites.</p>
              
              <div className="text-4xl font-black text-white flex items-baseline gap-1">
                R$ 29,90 <span className="text-sm font-normal text-slate-400">/mês</span>
              </div>

              <ul className="space-y-3 pt-6 border-t border-slate-800/80 text-sm">
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-4 h-4 text-amber-400" /> Desbloqueio de todas as ações da B3
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-4 h-4 text-amber-400" /> Preço Justo e Margens de Benjamin Graham
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-4 h-4 text-amber-400" /> Preço Teto para Dividendos de Décio Bazin
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-4 h-4 text-amber-400" /> Carteira Fórmula Mágica de Joel Greenblatt
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-4 h-4 text-amber-400" /> Gráfico de Radar Multidimensional no Raio-X
                </li>
              </ul>
            </div>

            <button
              onClick={handleSubscribe}
              className="w-full mt-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-950/60 active:scale-95"
            >
              Assinar Plano Pro Agora
            </button>
          </div>
        </div>

        {/* Garantias do SaaS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-900 text-center">
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-xs">Garantia de 7 dias ou cancelamento sem taxas</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-xs">Liberação imediata no seu terminal</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-xs">Dados sincronizados diretamente da B3</span>
          </div>
        </div>

      </div>
    </div>
  );
}