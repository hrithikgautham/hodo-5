import { collection, query, where, getDocs, doc, updateDoc, Timestamp, getDoc, arrayUnion, arrayRemove, DocumentSnapshot, QuerySnapshot, addDoc, writeBatch, collectionGroup, documentId, limit, QueryDocumentSnapshot, setDoc, deleteDoc, getCountFromServer, or, runTransaction, } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { TRIPS_COLLECTION, USERS_COLLECTION } from "../constants/collections";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


// get Notes
export const getNotes = async (tripId: string,) => {
  try {
    const starsRef = ref(storage, `notes/${tripId}/`);
    const url = await getDownloadURL(starsRef);
  }
  catch (err) {

  }
  finally {

  }
}

// save notes
export const saveNotes = async (tripId: string, noteTitle: string, noteBlob: Blob) => {
  try {
    const noteName = `notes/${tripId}/${noteTitle}`;
    const imageRef = ref(storage, noteName);
    await uploadBytes(imageRef, noteBlob);
    console.log("uploaded image: ", noteName);
    return true;
  }
  catch (err) {
    return false;
  }
  finally {

  }
}

export const checkIfTravellerExists = async (nameOrEmail: string) => {
  try {
    console.log(1)
    // const docSnaps = await db.collection(USERS_COLLECTION).where(Filter.or(Filter.where("email", "==", nameOrEmail), Filter.where("username", "==", nameOrEmail))).get()
    const docQuery = query(collection(db, `${USERS_COLLECTION}`), or(where("email", "==", nameOrEmail), where("username", "==", nameOrEmail)));
    const docSnaps = await getDocs(docQuery);
    if (docSnaps.size >= 1)
      return docSnaps?.docs?.at(0)?.data();
    return false;
  }
  catch (err: any) {
    console.log("error: ", err.message);
    return false;
  }
}