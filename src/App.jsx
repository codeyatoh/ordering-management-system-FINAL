import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import './toastify-custom.css';
import { UserProvider } from './context/UserContext';
import { db } from "./firebase";
import { collection, addDoc } from 'firebase/firestore';

function App() {
  return (
    <UserProvider>
      <ToastContainer position="top-right" autoClose={2000} />
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;