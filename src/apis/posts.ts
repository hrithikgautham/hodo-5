import { Timestamp, addDoc, collection, doc, updateDoc, setDoc, increment, arrayUnion, arrayRemove, deleteDoc, query, where, getDoc, getDocs, FieldPath, documentId } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { POSTS_COLLECTION, USERS_COLLECTION } from "../constants/collections";
import { deleteObject, getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';

export const createPost = async (medias: any[], uid: string, caption: string) => {
  try {
    const collectionRef = collection(db, `${USERS_COLLECTION}/${uid}/${POSTS_COLLECTION}`)
    const docRef = doc(collectionRef);
    const postId = docRef.id;
    const mediasUrls = [];
    console.log("3")

    for (let i = 0; i < medias.length; i++) {
      const media = medias[i];
      const imageName = `posts/media/${postId}/${new Date().getTime()}`;
      const mediaRef = ref(storage, imageName);
      const mediaBlob = await fetch(media.uri).then(data => data.blob());
      const result = await uploadBytes(mediaRef, mediaBlob);
      const URL = await getDownloadURL(result.ref);
      mediasUrls.push({ type: media.type, URL, });
    }
    console.log("4")
    await setDoc(docRef, {
      caption,
      creationTime: Timestamp.now(),
      postId,
      medias: mediasUrls,
    });
    console.log("5")
    return postId;
  }
  catch (err: any) {
    console.log("error: ", err.message);
    // Delete the files
    return false;
  }
}