import { collection, doc, getCountFromServer, getDoc, query, updateDoc, where } from "firebase/firestore"
import { db } from "../../firebase"
import { USERS_COLLECTION } from "../constants/collections"
import { Alert } from "react-native";

/**
 * 
 * @param username 
 * @returns if username exists, returns true
 */
export const userNameExists = async (username = "") => {
  try {
    const userCountQuery = query(collection(db, `${USERS_COLLECTION}`), where("username", "==", username));
    const resp = await getCountFromServer(userCountQuery);
    Alert.alert(JSON.stringify(resp.data().count))
    return resp.data().count > 0;
  }
  catch (err) {
    Alert.alert(JSON.stringify(err))
    return false;
  }
}

export const makeUserHost = async (uid: string) => {
  try {
    const docRef = doc(db, `${USERS_COLLECTION}/${uid}`);
    await updateDoc(docRef, { isHost: true, });
    return true;
  }
  catch (err) {
    return false;
  }
  finally {
  }
}