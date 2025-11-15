export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  startingBid: number;
  currentBid: number;
  endTime: Date;
  location: string;
}

export interface Bid {
  id: string;
  amount: number;
  username: string;
  timestamp: number;
}

export const DEMO_AUCTION_ITEM: AuctionItem = {
  id: '1',
  title: 'Premium Electronics Bundle - Retailer Returns',
  description:
    'High-quality electronics bundle including headphones, smart home devices, and accessories. All items are retail returns in excellent condition. This is a fantastic opportunity to save on premium electronics!',
  image:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  category: 'Electronics',
  startingBid: 50,
  currentBid: 50,
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
  location: 'Las Vegas, NV',
};
