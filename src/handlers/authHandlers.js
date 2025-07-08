// src/handlers/authHandlers.js
// Handler functions for authentication (login)

export const handleLogin = (navigate) => (e) => {
  e.preventDefault();
  navigate('/dining-location');
}; 