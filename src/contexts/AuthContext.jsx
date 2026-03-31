// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../services/firebase"; // Ensure your firebase config is exported from here

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // --- REAL FIREBASE CONNECTION ---
  useEffect(() => {
    // This listener detects if a real user is logged in via Firebase session cookies
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setInitializing(false);
    });

    return () => unsub();
  }, []);

  // REAL SIGNUP
  const signup = async (name, email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      // If the user provided a name, we update their real Firebase Profile
      if (name) {
        await updateProfile(cred.user, { displayName: name });
        // Refresh the local user state to include the new display name
        setUser({ ...cred.user, displayName: name });
      }
      return cred.user;
    } catch (error) {
      throw error; // Let the Signup page handle the error display
    }
  };

  // REAL LOGIN
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // REAL GOOGLE LOGIN (GMAIL)
  const loginWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  // REAL LOGOUT
  const logout = async () => {
    await signOut(auth);
    // Local state is automatically cleared by the onAuthStateChanged listener
  };

  // REAL PASSWORD RESET
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    initializing,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}