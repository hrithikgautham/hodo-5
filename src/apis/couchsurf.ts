import { Timestamp, addDoc, collection, doc, setDoc, updateDoc, writeBatch } from "firebase/firestore"
import { db } from "../../firebase"
import { CHATS_COLLECTION, REQUESTS_COLLECTION, USERS_COLLECTION } from "../constants/collections";


export const acceptOrRejectRequest = async (from: string, to: string, accepted: boolean) => {
  try {
    const docRef1 = doc(db, USERS_COLLECTION, to, REQUESTS_COLLECTION, from);
    const obj = { accepted, actionDate: Timestamp.now() };
    await updateDoc(docRef1, obj);

    if (accepted) {
      // create chat room
      await addDoc(collection(db, CHATS_COLLECTION), {
        members: [from, to],
        creationTime: Timestamp.now(),
        groupName: "Chat room for " + from + " and " + to,
        groupDescription: 'Chat room for ' + from + ' and ' + to,
      });
    }

    return true;
  }
  catch (err) {
    console.log(err.message);
    return false;
  }
  finally {

  }
}
