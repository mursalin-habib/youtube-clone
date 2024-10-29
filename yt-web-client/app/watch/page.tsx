'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';


 function WatchInternal() {
  const videoPrefix = 'https://storage.googleapis.com/processed-vid-170924/';
  const videoSrc = useSearchParams().get('v');

  return (
    <Suspense fallback= {<div>yoooo</div>}>
    <div>
      <h1>Watch Page</h1>
      { <video controls src={videoPrefix + videoSrc}/> }
    </div>
    </Suspense>
  );
}


export default function Watch() {
  
    return (
      <Suspense fallback= {<div>yoooo</div>}>
        <WatchInternal />
      </Suspense>
    );
  }

