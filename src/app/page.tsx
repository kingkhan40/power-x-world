'use client';

import { useEffect } from 'react';
import socket from '@/lib/socket';

import DiscountSlider from '@/components/DiscountSlider';
import EarnSection from '@/components/EarnSection';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import LaunchedSection from '@/components/LaunchedSection';

function Page() {
  useEffect(() => {
    // only run socket test when connected
    socket.on('connect', () => {
      console.log('🟢 Connected to Socket.IO server:', socket.id);
      // send a quick test event (non-blocking; safe)
      socket.emit('testEvent', { msg: 'Hello from Power X Frontend!' });
    });

    // log any server response (safe)
    socket.on('serverResponse', (data: any) => {
      console.log('📩 Server replied:', data);
    });

    // cleanup listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('serverResponse');
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
