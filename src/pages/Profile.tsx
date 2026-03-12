import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Coins, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-glam-bg/60 backdrop-blur-md border border-glam-primary/30 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="w-32 h-32 bg-gradient-to-br from-glam-primary to-glam-accent rounded-full flex items-center justify-center shadow-lg shadow-glam-primary/30">
            <UserIcon className="w-16 h-16 text-white" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">{user.username}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-glam-accent bg-glam-primary/10 px-4 py-1 rounded-full w-fit mx-auto md:mx-0 border border-glam-primary/20">
              <span className="text-sm font-medium">Игрок</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl hover:bg-red-500/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/20 p-6 rounded-2xl border border-glam-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Баланс</h3>
              <Coins className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
              {user.currency} <span className="text-lg text-glam-text/60 font-normal">Пряников</span>
            </div>
            <button className="mt-6 w-full py-3 bg-glam-primary hover:bg-glam-primary/80 text-white font-bold rounded-xl transition-colors">
              Пополнить
            </button>
          </div>

          <div className="bg-black/20 p-6 rounded-2xl border border-glam-primary/20">
            <h3 className="text-xl font-bold text-white mb-4">Статус</h3>
            <p className="text-glam-text/70 mb-4">У вас нет активных привилегий.</p>
            <button className="w-full py-3 bg-transparent border border-glam-primary/50 text-glam-accent hover:bg-glam-primary/10 font-bold rounded-xl transition-colors">
              Купить привилегию
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
