'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { DEMO_AUCTION_ITEM } from '@/types/auction';
import type { Bid } from '@/types/auction';

const INITIAL_BID: Bid = {
  id: '0',
  amount: 50,
  username: 'System',
  timestamp: 0,
};

export default function AuctionPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentBid, setCurrentBid] = useState<Bid>(INITIAL_BID);
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current auction state
  const fetchAuctionState = useCallback(async () => {
    try {
      const response = await fetch('/api/auction');
      if (response.ok) {
        const data = await response.json();
        setCurrentBid(data.currentBid);
        setBidHistory(data.bidHistory);
      }
    } catch (err) {
      console.error('Failed to fetch auction state:', err);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Initial fetch
    fetchAuctionState();

    // Poll every 2 seconds for updates (real-time feel)
    const interval = setInterval(fetchAuctionState, 2000);

    return () => clearInterval(interval);
  }, [isAuthenticated, router, fetchAuctionState]);

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amount = parseFloat(bidAmount);

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid bid amount');
      return;
    }

    if (amount <= currentBid.amount) {
      setError(`Bid must be higher than current bid of $${currentBid.amount}`);
      return;
    }

    if (!user) {
      setError('You must be logged in to bid');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          username: user.username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentBid(data.currentBid);
        setBidHistory(data.bidHistory);
        setBidAmount('');
        setSuccess('Your bid was placed successfully!');
        setTimeout(() => setSuccess(''), 3000);

        // Immediate fetch to update UI
        fetchAuctionState();
      } else {
        setError(data.error || 'Failed to place bid');
      }
    } catch {
      setError('Failed to place bid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickBid = (increment: number) => {
    const newAmount = currentBid.amount + increment;
    setBidAmount(newAmount.toString());
  };

  const formatTimeRemaining = () => {
    const now = new Date().getTime();
    const end = new Date(DEMO_AUCTION_ITEM.endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Auction ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Nellis Auction
              </h1>
              <p className="text-sm text-gray-600">Welcome, {user?.username}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-gray-600">Live</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Auction Item */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={DEMO_AUCTION_ITEM.image}
                alt={DEMO_AUCTION_ITEM.title}
                className="w-full h-96 object-cover"
              />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
                      {DEMO_AUCTION_ITEM.category}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {DEMO_AUCTION_ITEM.title}
                    </h2>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {DEMO_AUCTION_ITEM.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Current Bid</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${currentBid.amount}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      by {currentBid.username}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  {DEMO_AUCTION_ITEM.description}
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-yellow-800">
                    ⏰ {formatTimeRemaining()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bidding Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Place Your Bid
              </h3>

              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bid Amount ($)
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg font-semibold"
                    placeholder={`Minimum: $${currentBid.amount + 1}`}
                    step="1"
                    min={currentBid.amount + 1}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickBid(5)}
                    disabled={isLoading}
                    className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer disabled:opacity-50"
                  >
                    +$5
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickBid(10)}
                    disabled={isLoading}
                    className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer disabled:opacity-50"
                  >
                    +$10
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickBid(25)}
                    disabled={isLoading}
                    className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer disabled:opacity-50"
                  >
                    +$25
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg text-lg cursor-pointer"
                >
                  {isLoading ? 'Placing Bid...' : 'Place Bid'}
                </button>
              </form>

              {/* Bid History */}
              <div className="mt-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Bid History
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {bidHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No bids yet
                    </p>
                  ) : (
                    bidHistory.map((bid) => (
                      <div
                        key={bid.id}
                        className={`p-3 rounded-lg border ${
                          bid.username === user?.username
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">
                              ${bid.amount}
                            </p>
                            <p className="text-sm text-gray-600">
                              {bid.username}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(bid.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
