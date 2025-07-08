import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Authenticate crew member using Firestore
 * @param {string} email - Crew member's email
 * @param {string} password - Crew member's password
 * @returns {Promise<Object|null>} - Crew data if successful, null if failed
 */
export const authenticateCrew = async (email, password) => {
  try {
    const crewRef = collection(db, 'crew');
    const q = query(crewRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const crewDoc = querySnapshot.docs[0];
    const crewData = crewDoc.data();

    // Check if crew member is active
    if (crewData.status !== 'Active') {
      return null;
    }

    // Verify password
    if (crewData.password !== password) {
      return null;
    }

    // Remove password from crew data for security
    const { password: _, ...crewInfo } = crewData;
    return { id: crewDoc.id, ...crewInfo };
  } catch (error) {
    console.error('Crew authentication error:', error);
    return null;
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password meets minimum requirements
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6;
}; 