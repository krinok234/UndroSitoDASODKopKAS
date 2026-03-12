import React from 'react';
import { Background } from '../components/Background';
import { TopBar } from '../components/TopBar';
import { MusicPlayer } from '../components/MusicPlayer';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <Background>
      <TopBar />
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <Outlet />
      </main>
      <MusicPlayer />
    </Background>
  );
};
