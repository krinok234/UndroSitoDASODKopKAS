import React from 'react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="space-y-4"
      >
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-glam-accent via-white to-glam-primary drop-shadow-lg">
          Добро пожаловать на CosCraft
        </h1>
        <p className="text-2xl text-glam-text/80 font-light max-w-2xl mx-auto leading-relaxed">
          Лучший сервер для твоих приключений. Погрузись в мир магии и технологий вместе с нами.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-5xl"
      >
        {[
          { title: "Уникальность", desc: "Собственные моды и плагины" },
          { title: "Сообщество", desc: "Дружелюбные игроки и админы" },
          { title: "Стабильность", desc: "Мощное оборудование 24/7" },
        ].map((item, index) => (
          <div key={index} className="bg-glam-bg/50 backdrop-blur-sm border border-glam-primary/30 p-6 rounded-xl hover:bg-glam-primary/20 transition-all cursor-default group">
            <h3 className="text-xl font-bold text-glam-accent mb-2 group-hover:text-white transition-colors">{item.title}</h3>
            <p className="text-glam-text/70">{item.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
