import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [crew, setCrew] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'admin' or 'crew'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user is admin (Firebase Auth user)
        setUser(firebaseUser);
        setUserType('admin');
        setCrew(null);
      } else {
        setUser(null);
        setCrew(null);
        setUserType(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Function to set crew member after successful crew login
  const setCrewMember = async (crewData) => {
    // Fetch full crew document from Firestore using crew_id
    let fullCrew = crewData;
    if (crewData.crew_id) {
      try {
        const docRef = doc(db, 'crew', String(crewData.crew_id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Map camelCase to snake_case for backend compatibility
          fullCrew = {
            ...data,
            crew_id: crewData.crew_id,
            first_name: data.first_name || data.firstName,
            last_name: data.last_name || data.lastName,
          };
        }
      } catch (err) {
        console.error('Error fetching full crew info:', err);
      }
    }
    setCrew(fullCrew);
    setUser(null);
    setUserType('crew');
  };

  // Function to logout crew member
  const logoutCrew = () => {
    setCrew(null);
    setUserType(null);
  };

  if (loading) return null; // Optionally show a loading spinner

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      crew, 
      setCrewMember, 
      logoutCrew, 
      userType 
    }}>
      {children}
    </UserContext.Provider>
  );
} 