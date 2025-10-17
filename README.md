# SpongeDistributor — React + Firebase

A simple sponge distribution app for hardware stores to order cleaning sponges in bulk.

## Features

- **Vendor Registration & Login**: Hardware store owners can register and login
- **Product Catalog**: Browse available sponge products (blue, green, pink)
- **Shopping Cart**: Add products to cart and place bulk orders
- **Admin Panel**: Track orders and manage inventory
- **GPS Location**: Automatic location detection for vendor registration

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **Routing**: React Router DOM

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy your Firebase config to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── main.jsx              # App entry point
├── App.jsx               # Main app component with routing
├── firebase.js           # Firebase configuration
├── index.css             # Tailwind CSS imports
└── components/
    ├── Auth/
    │   ├── Register.jsx  # Vendor registration
    │   └── Login.jsx     # Vendor login
    ├── Products/
    │   ├── Products.jsx  # Product listing
    │   └── ProductCard.jsx # Individual product card
    ├── Cart/
    │   └── Cart.jsx      # Shopping cart
    ├── Admin/
    │   └── AdminPanel.jsx # Order management
    ├── About.jsx         # About page
    └── ProtectedRoute.jsx # Route protection
```

## Usage

### For Vendors (Hardware Store Owners)

1. **Register**: Visit the homepage and register with:
   - Phone number
   - Password
   - Hardware store name
   - Owner name
   - Location (auto-detected via GPS or manual entry)

2. **Browse Products**: View available sponge products with colors and prices

3. **Add to Cart**: Select quantities and add products to cart

4. **Place Order**: Review cart and place bulk order

### For Admins

1. **View Orders**: Access the admin panel to see all placed orders
2. **Track Sales**: Monitor total goods sold
3. **Update Status**: Mark orders as completed

## Firebase Collections

The app uses these Firestore collections:

- `vendors/` - Registered hardware store information
- `products/` - Available sponge products
- `orders/` - Placed orders with status tracking

## Sample Data

To test the app, add some sample products to your Firestore `products` collection:

```javascript
// Example product document
{
  name: "Blue Cleaning Sponge",
  color: "Blue",
  price: 15,
  shortDescription: "Heavy-duty blue sponge for tough cleaning"
}
```

## Troubleshooting

### Common Issues

1. **"Unexpected token" error**: Make sure you're using `.jsx` files, not `.tsx`
2. **Firebase connection issues**: Verify your `.env.local` file has correct Firebase config
3. **Styling not working**: Ensure Tailwind CSS is properly configured

### Development

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint**: Check browser console for any JavaScript errors

## Environment Variables

All Firebase configuration is handled through environment variables in `.env.local`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## License

This project is for demonstration purposes.

