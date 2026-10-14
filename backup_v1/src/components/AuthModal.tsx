import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, signInDemo, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Пожалуйста, введите Email и пароль.');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов.');
      return;
    }

    setError(null);
    setSuccessNotice(null);
    setIsLoading(true);

    if (mode === 'signin') {
      const res = await signIn(email, password);
      setIsLoading(false);
      if (res.error) {
        setError(res.error);
      } else {
        onClose();
      }
    } else {
      const res = await signUp(email, password);
      setIsLoading(false);
      if (res.error) {
        setError(res.error);
      } else if (res.confirmationRequired) {
        setSuccessNotice('Ссылка для подтверждения отправлена на ваш Email. Проверьте входящие!');
      } else {
        onClose();
      }
    }
  };

  const handleQuickDemoLogin = () => {
    signInDemo('pro_player@cs2.lab');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-sm bg-csdark-900 border border-csdark-700 rounded-2xl p-5 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-csorange/10 border border-csorange/30 text-csorange mb-2 shadow-glow-orange">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-white font-tactical tracking-wider uppercase">
            {mode === 'signin' ? 'Вход в аккаунт' : 'Регистрация бойца'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Синхронизация прогресса и раскидок через Supabase
          </p>
        </div>

        {/* Configuration status indicator */}
        {!isConfigured && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold flex items-center gap-1 font-mono">
                <span>⚡</span> Демо / Оффлайн режим
              </span>
              <span className="text-[10px] text-amber-400/80">Локально</span>
            </div>
            <p className="text-[11px] text-gray-300">
              Supabase не сконфигурирован в <code>.env</code>. Вы можете войти в демо-режиме в 1 клик!
            </p>
            <button
              onClick={handleQuickDemoLogin}
              className="mt-2 w-full py-1.5 rounded-lg bg-csorange text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
            >
              Войти мгновенно (Демо)
            </button>
          </div>
        )}

        {/* Tabs: Sign In / Sign Up */}
        <div className="flex p-1 bg-csdark-950 rounded-xl mb-3 border border-csdark-800">
          <button
            onClick={() => {
              setMode('signin');
              setError(null);
              setSuccessNotice(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-csorange text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Войти
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
              setSuccessNotice(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-csorange text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Создать аккаунт
          </button>
        </div>

        {/* Errors & Notices */}
        {error && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs mb-3">
            {error}
          </div>
        )}

        {successNotice && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs mb-3">
            {successNotice}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="player@cs2.pro"
              className="w-full px-3 py-2 bg-csdark-950 border border-csdark-700 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-csorange transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1">
              Пароль (мин. 6 символов)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-csdark-950 border border-csdark-700 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-csorange transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-csorange to-amber-600 hover:from-amber-500 hover:to-csorange text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-glow-orange active:scale-95 disabled:opacity-50"
          >
            {isLoading
              ? 'Авторизация...'
              : mode === 'signin'
              ? 'Войти через Supabase'
              : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-[10px] text-gray-500 text-center mt-3 font-mono">
          Безопасность: Row Level Security (RLS) PostgreSQL
        </p>
      </div>
    </div>
  );
};
