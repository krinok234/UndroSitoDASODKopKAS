import React from 'react';
import { motion } from 'framer-motion';

export const Rules: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <h1 className="text-4xl font-bold text-center text-white mb-12">Правила Сервера</h1>
        
        <div className="space-y-6">
          {[
            { id: 1, title: "Общие положения", content: "Играя на сервере, вы автоматически соглашаетесь с правилами." },
            { id: 2, title: "Поведение в чате", content: "Запрещены оскорбления, спам, реклама сторонних ресурсов." },
            { id: 3, title: "Игровой процесс", content: "Запрещено использование читов, багов и стороннего ПО." },
            { id: 4, title: "Постройки", content: "Запрещено строительство нецензурных построек и гриферство." },
          ].map((rule) => (
            <div key={rule.id} className="bg-glam-bg/60 backdrop-blur-md border border-glam-primary/30 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-glam-accent mb-2">
                <span className="text-glam-primary/60 mr-2">#{rule.id}</span>
                {rule.title}
              </h3>
              <p className="text-glam-text/80 leading-relaxed">
                {rule.content}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
