'use client';

import { personalizedGreeting } from '@/ai/flows/personalized-greeting';
import { useEffect, useState } from 'react';

const PersonalizedGreeting = () => {
  const [greeting, setGreeting] = useState('Generating greeting...');

  useEffect(() => {
    const getGreeting = async () => {
      try {
        const date = new Date();
        const hours = date.getHours();
        let timeOfDay = 'day';
        if (hours < 12) {
          timeOfDay = 'morning';
        } else if (hours < 18) {
          timeOfDay = 'afternoon';
        } else {
          timeOfDay = 'evening';
        }

        const result = await personalizedGreeting({ timeOfDay });
        setGreeting(result.greeting);
      } catch (error) {
        console.error('Failed to get personalized greeting:', error);
        setGreeting('Welcome to my corner of the web.'); // Fallback greeting
      }
    };

    getGreeting();
  }, []);

  return (
    <p className="mt-4 text-lg text-accent font-medium">
      {greeting}
    </p>
  );
};

export default PersonalizedGreeting;
