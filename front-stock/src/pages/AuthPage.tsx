import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TrendingUp, Mail, Lock, User, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { loginUsuario, registrarUsuario } from '../service/Api';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Permite redirecionar o usuário de volta para onde ele tentou ir (ex: /pro ou /radar)
  const redirectTo = searchParams.get('redirect') || '/radar';

  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const response = isRegister
        ? await registrarUsuario(nome, email, senha)
        : await loginUsuario(email, senha);

      // Persiste a sessão autenticada
      localStorage.setItem('@alphascreen:token', response.token);
      localStorage.setItem('@alphascreen:isPro', String(response.isPro));
      localStorage.setItem('@alphascreen:user', JSON.stringify({
        nome: response.nome,
        email: response.email,
        plano: response.plano
      }));

      navigate(redirectTo);
    } catch (err: any) {
      if (err.response?.data?.erro) {
        setErro(err.response.data.erro);
      } else if (err.response?.status === 400) {
        setErro('Verifique os campos preenchidos (a senha deve ter no mínimo 6 caracteres).');
      } else {
        setErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans selection:bg-emerald-500 selection:text-black relative overflow-hidden">
      {/* Glow decorativo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold p-2 rounded-xl hover:bg-slate-900 w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao início
        </button>

        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Logo & Título */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-1">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isRegister ? 'Criar sua conta' : 'Acessar Terminal'}
            </h1>
            <p className="text-slate-400 text-xs">
              {isRegister
                ? 'Comece gratuitamente com o screening de Warren Buffett.'
                : 'Entre com suas credenciais para sincronizar seu plano.'}
            </p>
          </div>

          {/* Seletor Login / Cadastro */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setErro(null); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                !isRegister ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setErro(null); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                isRegister ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Alerta de Erro */}
          {erro && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{erro}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Nome completo</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ex: Elias Bruno"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">E-mail</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Senha</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isRegister ? 'Finalizar Cadastro' : 'Entrar no Terminal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}