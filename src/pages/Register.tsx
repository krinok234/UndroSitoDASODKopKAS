import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User } from '../types';

export const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const user = await invoke<User>('register', { username, password });
      login(user);
      navigate('/profile');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Ошибка регистрации');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-glam-bg/80 backdrop-blur-xl border border-glam-primary/30 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Регистрация</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-glam-text/70 mb-2">Никнейм</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/20 border border-glam-primary/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-glam-primary focus:ring-1 focus:ring-glam-primary transition-all placeholder:text-white/20"
              placeholder="Steve"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-glam-text/70 mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-glam-primary/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-glam-primary focus:ring-1 focus:ring-glam-primary transition-all placeholder:text-white/20"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-glam-text/70 mb-2">Повторите пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/20 border border-glam-primary/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-glam-primary focus:ring-1 focus:ring-glam-primary transition-all placeholder:text-white/20"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-glam-accent to-glam-primary text-white font-bold py-3 rounded-full transition-all transform hover:scale-[1.02] shadow-lg shadow-glam-primary/30 hover:shadow-glam-primary/50"
          >
            Создать аккаунт
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-glam-text/60">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-glam-accent hover:text-white hover:underline transition-colors">
            Войти
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
