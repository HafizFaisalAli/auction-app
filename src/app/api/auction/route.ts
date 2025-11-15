import { NextResponse } from 'next/server';

// In-memory storage (production mein database use karo)
let currentBid = {
  id: '0',
  amount: 50,
  username: 'System',
  timestamp: Date.now(),
};

const bidHistory = [currentBid];

// GET - Get current auction state
export async function GET() {
  return NextResponse.json({
    currentBid,
    bidHistory,
  });
}

// POST - Place a new bid
export async function POST(request: Request) {
  try {
    const { amount, username } = await request.json();

    // Validate bid
    if (!amount || !username) {
      return NextResponse.json(
        { error: 'Amount and username are required' },
        { status: 400 }
      );
    }

    if (amount <= currentBid.amount) {
      return NextResponse.json(
        {
          error: `Bid must be higher than current bid of $${currentBid.amount}`,
        },
        { status: 400 }
      );
    }

    // Create new bid
    const newBid = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      username,
      timestamp: Date.now(),
    };

    currentBid = newBid;

    // Remove previous bids from same user
    const filteredHistory = bidHistory.filter(
      (bid) => bid.username !== username
    );

    // Add new bid at the top
    bidHistory.length = 0; // Clear array
    bidHistory.push(newBid, ...filteredHistory);

    // Keep only last 20 bids
    if (bidHistory.length > 20) {
      bidHistory.length = 20;
    }

    return NextResponse.json({
      success: true,
      currentBid,
      bidHistory,
      newBid,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
