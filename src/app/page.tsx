'use client';

import { useEffect } from 'react';
import { initSocket } from '@/lib/socket';
import DiscountSlider from '@/components/DiscountSlider';
import EarnSection from '@/components/EarnSection';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import LaunchedSection from '@/components/LaunchedSection';

function Page() {
  useEffect(() => {
    // ✅ initialize socket (singleton)
    const socket = initSocket();
    if (!socket) return;

    // 🟢 Connected event
    socket.on('connect', () => {
      console.log('🟢 Connected to Socket.IO server:', socket.id);

      // 🚀 Test event
      socket.emit('testEvent', { msg: 'Hello from Power X Frontend!' });
    });

    // 📩 Server response listener
    socket.on('serverResponse', (data: any) => {
      console.log('📩 Server replied:', data);
    });

    // 🧹 Cleanup listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('serverResponse');
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <HeroSection />
      <DiscountSlider />
      <EarnSection />
      <LaunchedSection />
      <Footer />
    </div>
  );
}

export default Page;
