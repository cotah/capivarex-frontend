'use client';

import NewsItem from './NewsItem';

const mockNews = [
  { id: '1', title: 'Fed holds interest rates steady, signals patience on cuts', source: 'Reuters', timeAgo: '1h ago' },
  { id: '2', title: 'Bitcoin surges past $67,000 amid institutional buying', source: 'CoinDesk', timeAgo: '2h ago' },
  { id: '3', title: 'Tesla announces new Gigafactory in Ireland', source: 'Bloomberg', timeAgo: '3h ago' },
  { id: '4', title: 'Apple Vision Pro sales exceed expectations in Q1', source: 'CNBC', timeAgo: '4h ago' },
  { id: '5', title: 'EU approves new AI regulation framework', source: 'Financial Times', timeAgo: '5h ago' },
  { id: '6', title: 'NVIDIA earnings beat estimates, stock jumps 4%', source: 'MarketWatch', timeAgo: '6h ago' },
  { id: '7', title: 'Oil prices drop as OPEC+ increases production', source: 'Reuters', timeAgo: '8h ago' },
  { id: '8', title: 'European markets close higher on tech rally', source: 'Bloomberg', timeAgo: '10h ago' },
];

export default function NewsFeed() {
  return (
    <div className="space-y-2">
      {mockNews.map((item) => (
        <NewsItem key={item.id} title={item.title} source={item.source} timeAgo={item.timeAgo} />
      ))}
    </div>
  );
}
