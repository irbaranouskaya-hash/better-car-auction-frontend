# Better Car Auction - Frontend

A modern, responsive web application for automated car pricing and auction management.

## 🚀 Features

- **Authentication System** - Secure login/register with JWT token refresh
- **Car Management** - Add, edit, and view cars with detailed specifications
- **Auction System** - Browse and participate in live auctions
- **Bidding** - Place bids on cars in active auctions
- **Admin Panel** - Manage auctions and system settings (admin only)
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **React Query** - Server state management
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **React Toastify** - Toast notifications
- **Lucide React** - Icon library

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd better-car-auction-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Better Car Auction
VITE_APP_VERSION=1.0.0
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── api/                    # API client configuration and endpoints
│   ├── axios.config.ts
│   ├── auth.api.ts
│   ├── cars.api.ts
│   ├── auctions.api.ts
│   └── bids.api.ts
├── components/             # Reusable components
│   ├── common/            # Common UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Table/
│   │   └── ...
│   └── layout/            # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Layout.tsx
├── pages/                 # Page components
│   ├── auth/             # Authentication pages
│   ├── auctions/         # Auction pages
│   ├── cars/             # Car pages
│   ├── bids/             # Bid pages
│   ├── profile/          # Profile pages
│   ├── admin/            # Admin pages
│   └── HomePage.tsx
├── routes/               # Route configuration
│   ├── PrivateRoute.tsx
│   └── AdminRoute.tsx
├── store/                # State management
│   ├── authStore.ts
│   └── uiStore.ts
├── types/                # TypeScript type definitions
│   ├── user.types.ts
│   ├── car.types.ts
│   ├── auction.types.ts
│   ├── bid.types.ts
│   └── api.types.ts
├── schemas/              # Zod validation schemas
│   ├── auth.schema.ts
│   ├── car.schema.ts
│   ├── auction.schema.ts
│   └── bid.schema.ts
├── utils/                # Utility functions
│   ├── formatters.ts
│   ├── dateHelpers.ts
│   ├── validationHelpers.ts
│   └── priceHelpers.ts
├── styles/               # Global styles
│   └── index.css
├── App.tsx               # Main app component
└── main.tsx              # Entry point
```

## 📱 Available Routes

### Public Routes
- `/` - Home page with current auction
- `/login` - User login
- `/register` - User registration
- `/auctions` - Browse all auctions
- `/auctions/:id` - Auction details
- `/cars` - Browse all cars
- `/cars/:id` - Car details

### Private Routes (Requires Authentication)
- `/dashboard` - User dashboard
- `/my-cars` - User's cars
- `/my-cars/create` - Add new car
- `/my-cars/:id/edit` - Edit car
- `/my-bids` - User's bids
- `/profile` - User profile
- `/change-password` - Change password

### Admin Routes (Requires Admin Role)
- `/admin` - Admin dashboard
- `/admin/auctions` - Manage auctions
- `/admin/auctions/create` - Create auction
- `/admin/auctions/:id/edit` - Edit auction

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🔐 Authentication

The application uses JWT tokens with automatic refresh:

1. Access token stored in localStorage
2. Refresh token stored in localStorage
3. Automatic token refresh on 401 errors
4. Automatic logout on refresh token expiration

## 🎨 UI Components

The application includes a comprehensive set of reusable components:

- **Button** - Primary, secondary, danger, outline variants
- **Input** - Text, email, password, number with validation
- **Modal** - Customizable modal dialogs
- **Card** - Content containers
- **Badge** - Status indicators
- **Table** - Data tables with pagination
- **Loading** - Loading indicators
- **Pagination** - Page navigation

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000/api` |
| `VITE_APP_NAME` | Application name | `Better Car Auction` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🐛 Known Issues

This is a development version. Some features are implemented as placeholders:
- Detailed car listing pages need more filters
- Real-time auction updates (WebSocket) not implemented
- Image upload for cars not implemented
- Advanced auction analytics not implemented

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using React + TypeScript + Vite

