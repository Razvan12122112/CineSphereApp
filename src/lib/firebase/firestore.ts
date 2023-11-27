import { db } from "./firebaseConfig";
import { collection, addDoc } from 'firebase/firestore';

interface User {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
  }
  

export async function addUserToFirestore(user: User)  {
    const userRef = collection(db, 'users');
    await addDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      profilePicture: user.photoURL,
    });
  }