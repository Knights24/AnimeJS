'use client';

import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('@/components/three-scene'), {
  ssr: false,
});

const SceneProvider = () => {
  return <ThreeScene />;
};

export default SceneProvider;
