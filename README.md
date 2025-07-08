# Ordering System (React + Vite + Firestore Database)

A full-featured ordering and management system for a coffee shop, built with React, Vite, and Firebase. This system supports both admin and crew roles, with a modern UI for order placement, menu management, crew management, and sales analytics.

---

## Features

### For Admins
- **Dashboard:** View sales analytics and top products.
- **Crew Management:** Add, edit, search, filter, and archive crew members.
- **Menu Management:** Add, edit, remove, and search menu items (coffee, bread, milktea, etc.).
- **Order Management:** View and search all orders placed by crew.
- **Payment Management:** Track and search payment records.
- **Secure Admin Login:** Uses Firebase Authentication.

### For Crew/Customers
- **Login:** Crew login with email and password (managed by admin).
- **Dining Location Selection:** Choose between Dine-In or Take-Out.
- **Order Placement:**
  - Browse menu by category (Coffee, Bread & Pastry).
  - Add items to cart (with size/quantity options for coffee).
  - Review and edit cart before checkout.
  - Enter customer payment and complete order.
  - View and print receipt after order completion.
- **Logout:** Secure logout for both admin and crew.

---

## Tech Stack
- **Frontend:** React 19, Vite, React Router, React Icons, React Toastify
- **Backend/Database:** Firebase (Firestore, Auth)
- **Charts:** Chart.js, react-chartjs-2
- **Styling:** CSS Modules, custom CSS

---

## Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Ordering-System
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase
- Create a `.env` file in the root directory with your Firebase project credentials:
```
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id
```
- [How to get Firebase config?](https://firebase.google.com/docs/web/setup)

### 4. Run the Development Server
```bash
npm run dev
```
- The app will be available at `http://localhost:5173` (or as shown in your terminal).

---

## Usage Guide

### Admin Flow
1. **Login as Admin:** Use your admin credentials (set up in Firebase Auth).
2. **Dashboard:** View sales summary and analytics.
3. **Manage Crew:**
   - Add new crew members (they will use these credentials to log in).
   - Edit or archive existing crew.
4. **Manage Menu:**
   - Add, edit, or remove menu items (coffee, bread, milktea, etc.).
5. **View Orders & Payments:**
   - Track all orders and payments from crew.
6. **Logout:** Use the sidebar logout button.

### Crew/Customer Flow
1. **Login as Crew:** Use credentials provided by admin.
2. **Select Dining Location:** Choose Dine-In or Take-Out.
3. **Place Order:**
   - Browse menu by category.
   - Add items to cart (choose size/quantity for coffee).
   - Review cart and enter customer payment.
   - Complete order and view/print receipt.
4. **Logout:** Use the logout button in the header or dining location page.

---

## Project Structure

```
Ordering-System/
├── src/
│   ├── components/         # React components (AdminPanel, CoffeeShop, LoginPage, etc.)
│   ├── context/            # User context for authentication state
│   ├── handlers/           # Logic for auth, cart, modal, etc.
│   ├── utils/              # Utility functions (auth, order formatting)
│   ├── config/             # Firebase config
│   ├── assets/             # Images and static assets
│   ├── index.css           # Global styles
│   └── main.jsx            # App entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## Linting & Formatting
- Run ESLint:
  ```bash
  npm run lint
  ```
- ESLint is pre-configured for React best practices.

---

## Additional Notes
- **Admin credentials** must be set up in Firebase Authentication.
- **Crew credentials** are managed by the admin in the Crew Management panel.
- **Images** for menu items can be uploaded via the admin panel.
- **Receipts** can be printed after order completion.

---

## License
MIT (or specify your license)
