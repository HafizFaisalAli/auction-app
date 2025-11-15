# Real-Time Auction Application

A mini real-time auction platform inspired by Nellis Auction, built with Next.js, TypeScript, and Socket.io for real-time bidding.

## Features

✅ **User Authentication**

- Simple login system with hardcoded demo users
- Session management using React Context
- Protected routes for authenticated users

✅ **Real-Time Bidding**

- WebSocket-powered instant bid updates
- All connected users see bids in real-time
- Live connection status indicator

✅ **Auction Interface**

- Beautiful UI inspired by Nellis Auction
- Product image, title, description, and location
- Current highest bid display
- Countdown timer showing time remaining
- Bid history with user highlights

✅ **Bidding Features**

- Input field for custom bid amounts
- Quick bid buttons (+$5, +$10, +$25)
- Real-time bid validation
- Success/error notifications
- Minimum bid enforcement

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Real-time**: Socket.io (client & server)
- **Font**: Open Sans (matching Nellis Auction)

## Demo Users

Use any of these credentials to log in:

| Username | Password    |
| -------- | ----------- |
| bidder1  | password123 |
| bidder2  | password123 |
| bidder3  | password123 |

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
   \`\`\`bash
   cd /home/hafizfaisal/Desktop/auction-app
   \`\`\`

2. Install dependencies (if not already installed):
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open your browser and navigate to:
   \`\`\`
   http://localhost:3000
   \`\`\`

## How to Use

1. **Login**: Use one of the demo credentials to log in
2. **View Auction**: See the featured auction item with current bid
3. **Place Bid**:
   - Enter a custom amount (must be higher than current bid)
   - Or use quick bid buttons to increment
   - Click "Place Bid" to submit
4. **Watch Real-Time Updates**: Open multiple browser windows to see bids update instantly
5. **View History**: Check the bid history panel to see all recent bids

## Project Structure

\`\`\`
auction-app/
├── src/
│ ├── app/
│ │ ├── auction/ # Main auction page
│ │ ├── login/ # Login page
│ │ ├── layout.tsx # Root layout with AuthProvider
│ │ ├── page.tsx # Home page (redirects to login/auction)
│ │ └── globals.css # Global styles
│ ├── context/
│ │ └── AuthContext.tsx # Authentication context
│ └── types/
│ └── auction.ts # TypeScript types and demo data
├── server.ts # Custom Next.js server with Socket.io
├── package.json
├── next.config.ts # Next.js configuration
└── tsconfig.json
\`\`\`

## Key Components

### Authentication System (\`src/context/AuthContext.tsx\`)

- React Context for global auth state
- LocalStorage persistence
- Hardcoded user validation

### WebSocket Server (\`server.ts\`)

- Custom Next.js server
- Socket.io integration
- Real-time bid broadcasting
- Bid validation logic
- Maintains bid history

### Auction Page (\`src/app/auction/page.tsx\`)

- Real-time WebSocket connection
- Live bid updates
- Bid placement form
- Bid history display
- Connection status indicator

## WebSocket Events

### Client → Server

- \`place-bid\`: Submit a new bid with amount and username

### Server → Client

- \`initial-state\`: Send current bid and history on connection
- \`bid-update\`: Broadcast new bid to all clients
- \`bid-error\`: Send error message for invalid bids

## Development

### Scripts

- \`npm run dev\` - Start development server with hot reload
- \`npm run build\` - Build for production
- \`npm start\` - Start production server
- \`npm run lint\` - Run ESLint

### Testing Real-Time Features

1. Open the app in multiple browser windows
2. Log in with different users
3. Place bids and watch them appear instantly in all windows

## Design Inspiration

The UI/UX is inspired by [Nellis Auction](https://nellisauction.com/), featuring:

- Clean, modern interface
- Blue accent colors
- Open Sans font family
- Card-based layout
- Responsive design

## Future Enhancements

Potential features to add:

- Multiple auction items
- Timer that automatically closes auctions
- User profiles and avatars
- Bid notifications
- Admin dashboard
- Database integration (PostgreSQL/MongoDB)
- Image upload for auction items
- Search and filter functionality
- Payment integration
- Email notifications

## License

This is a demo project for educational purposes.

---

Built with ❤️ using Next.js and Socket.io
