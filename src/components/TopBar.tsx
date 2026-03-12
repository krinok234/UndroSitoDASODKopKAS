import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogIn, UserPlus, Shield } from 'lucide-react';
import { clsx } from 'clsx';

export const TopBar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-glam-bg/90 backdrop-blur-md border-b border-glam-primary/30 px-6 py-4 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Navigation Links */}
        <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-glam-accent to-glam-primary hover:opacity-80 transition-opacity">
                CosCraft Donate
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-medium">
                <Link 
                    to="/" 
                    className={clsx(
                        "hover:text-glam-primary transition-colors",
                        isActive('/') ? "text-glam-primary" : "text-glam-text/70"
                    )}
                >
                    Главная
                </Link>
                <Link 
                    to="/rules" 
                    className={clsx(
                        "hover:text-glam-primary transition-colors",
                        isActive('/rules') ? "text-glam-primary" : "text-glam-text/70"
                    )}
                >
                    Правила
                </Link>
            </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link 
                to="/profile" 
                className="flex items-center gap-2 px-4 py-2 bg-glam-primary/20 border border-glam-primary/50 rounded-lg hover:bg-glam-primary/40 transition-colors group"
            >
              <User className="w-4 h-4 text-glam-accent group-hover:text-white transition-colors" />
              <span className="font-semibold text-glam-accent group-hover:text-white transition-colors">{user.username}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-glam-bg/50 border border-glam-primary/30 rounded-full hover:bg-glam-primary/20 hover:border-glam-primary/60 transition-all shadow-sm hover:shadow-glam-primary/20"
              >
                <LogIn className="w-4 h-4" />
                Вход
              </Link>
              <Link 
                to="/register" 
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-glam-accent to-glam-primary text-white text-sm font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-glam-primary/30 hover:shadow-glam-primary/50"
              >
                <UserPlus className="w-4 h-4" />
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
