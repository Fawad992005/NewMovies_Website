// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  setDoc,
  getDoc,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "moviewebsite-a9523.firebaseapp.com",
  projectId: "moviewebsite-a9523",
  storageBucket: "moviewebsite-a9523.firebasestorage.app",
  messagingSenderId: "910567833289",
  appId: "1:910567833289:web:72a324a4dfe14d6a87d718",
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);

const Provider = new GoogleAuthProvider();
Provider.setCustomParameters({ prompt: "select_account" });

export const auth = getAuth(firebaseapp);

export const signInWithGoogle = () => {
  return signInWithPopup(auth, Provider);
};

export const db = getFirestore(firebaseapp);

export const createUserDocumentFromAuth = async (
  userauth: User,
  additionalinfo?: object
) => {
  if (!userauth) return;
  const userdocref = doc(db, "users", userauth.uid);

  const usersnapshot = await getDoc(userdocref);

  if (!usersnapshot.exists()) {
    const { displayName, email } = userauth;
    const createdAt = new Date();

    try {
      await setDoc(userdocref, {
        displayName,
        email,
        createdAt,
        ...additionalinfo,
      });
    } catch (error) {
      console.log(error, "Error created user");
    }
  }
  return userdocref;
};

export const SignOutUser = async () => signOut(auth);

export const addToWatchlist = async (
  userId: string,
  movieId: string,
  movieData: { title: string; status: string; poster_path: string }
) => {
  if (!userId || !movieId) return;

  const watchlistDocRef = doc(db, "watchlists", userId);
  const watchlistSnap = await getDoc(watchlistDocRef);

  if (watchlistSnap.exists()) {
    // Update the existing watchlist
    await updateDoc(watchlistDocRef, {
      [`movies.${movieId}`]: {
        ...movieData,
        addedAt: new Date().toISOString(),
      },
    });
  } else {
    // Create a new watchlist document
    await setDoc(watchlistDocRef, {
      movies: {
        [movieId]: {
          ...movieData,
          addedAt: new Date().toISOString(),
        },
      },
    });
  }
};

export const getWatchlist = async (userId: string) => {
  if (!userId) return null;

  const watchlistDocRef = doc(db, "watchlists", userId);
  const watchlistSnap = await getDoc(watchlistDocRef);

  return watchlistSnap.exists() ? watchlistSnap.data().movies : null;
};

export const createAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};
export const signInAuthUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const onAuthStateChangedListener = (
  callback: (user: User | null) => void
) => onAuthStateChanged(auth, callback);
