'use client';

import { useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

export default function SubCount() {
  const [count, setCount] = useState('—');

  useEffect(() => {
    if (!API_KEY || !CHANNEL_ID) return;
    fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`)
      .then(r => r.json())
      .then(d => {
        const c = d.items?.[0]?.statistics?.subscriberCount;
        if (c) setCount(fmt(parseInt(c, 10)));
      })
      .catch(() => {});
  }, []);

  return <>{count}</>;
}
