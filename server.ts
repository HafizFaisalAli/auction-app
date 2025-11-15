import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000' || '8080' || '8000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

interface Bid {
  id: string;
  amount: number;
  username: string;
  timestamp: number;
}

let currentBid: Bid = {
  id: '0',
  amount: 50,
  username: 'System',
  timestamp: Date.now(),
};

const bidHistory: Bid[] = [currentBid];

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Send current auction state to newly connected client
    socket.emit('initial-state', {
      currentBid,
      bidHistory,
    });

    // Handle new bid
    socket.on('place-bid', (data: { amount: number; username: string }) => {
      const { amount, username } = data;

      // Validate bid
      if (amount <= currentBid.amount) {
        socket.emit('bid-error', {
          message: `Bid must be higher than current bid of $${currentBid.amount}`,
        });
        return;
      }

      // Create new bid
      const newBid: Bid = {
        id: Date.now().toString(),
        amount,
        username,
        timestamp: Date.now(),
      };

      currentBid = newBid;
      bidHistory.unshift(newBid);

      // Keep only last 20 bids
      if (bidHistory.length > 20) {
        bidHistory.pop();
      }

      // Broadcast to all clients
      io.emit('bid-update', {
        currentBid,
        bidHistory,
        newBid,
      });

      console.log(`New bid: $${amount} by ${username}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
