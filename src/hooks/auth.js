import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth'
import {doc, getDoc} from 'firebase/firestore'
import React, {useState, useEffect, useContext, createContext} from 'react'
import {db} from '../../firebase'
import {USERS_COLLECTION} from '../constants/collections'

const authContext = createContext()

export function AuthProvider({children}) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const auth = getAuth();


  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleUser = async (rawUser) => {
    setLoading(false);
    if (rawUser) {
      setUser(rawUser);
    }
    else {
      setUser(false)
      signOutUser()
      return false
    }
  }

  const signOutUser = async () => {
    setLoading(true);
    await signOut(auth);
    setLoading(false);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUser);

    return () => {
      console.log("unsubscribing from authstatechange...");
      unsubscribe();
    };
  }, [])

  return {
    auth: user,
    loading,
    setLoading,
    signOutUser,
    handleUser,
  }
}