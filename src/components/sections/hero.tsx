'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import PersonalizedGreeting from '@/components/personalized-greeting';
import { ArrowRight } from 'lucide-react';

const ThreeScene = dynamic(() => import('@/components/three-scene'), {
  ssr: false,
});

const Hero = () => {
  return (
    <section id="hero" className="relative h-[90vh] min-h-[700px] w-full">
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container text-center max-w-4xl">
          <h1 className="font-headline text-5xl font-bold tracking-tighter sm:text-7xl lg:text-8xl">
            Vertex Portfolio
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80 md:text-xl">
            Creative Developer & Digital Craftsman
          </p>
          <PersonalizedGreeting />
          <div className="mt-8 flex justify-center gap-4">
            <a href="#projects">
              <Button size="lg">
                View My Work
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
      <ThreeScene />
    </section>
  );
};

export default Hero;
