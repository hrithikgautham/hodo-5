import UnAuthenticatedStack from "./src/stacks/UnAuthenticatedStack"
import AuthenticatedStack from "./src/stacks/AuthenticatedStack"
import { useDispatch, useSelector } from "react-redux";
import { Theme } from "tamagui";
import { ToastController } from "./src/hooks/toast";
import { useAuth } from "./src/hooks/auth";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { USERS_COLLECTION } from "./src/constants/collections";
import { setUser } from "./src/slices/userSlice";
import React from "react";

export default function Main() {
  const theme = useSelector(state => state.theme.theme);

  const { auth, } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth?.uid) {
      onSnapshot(doc(db, USERS_COLLECTION, auth.uid), ss => {
        console.log("setting user...: ", ss.data().gotInfo);
        dispatch(setUser(ss.data()));
      });
    }
  }, [auth])

  return (
    <Theme name={theme}>
      <ToastController>
        <UnAuthenticatedStack />
        <AuthenticatedStack />
      </ToastController>
    </Theme>
  )
}

