// Firebase configuration for InjuryIQ AI
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD2PoY1LeO3ZB50z8XB1K2dfM40PmIXSTc",
  authDomain: "injuryiq-d647c.firebaseapp.com",
  projectId: "injuryiq-d647c",
  storageBucket: "injuryiq-d647c.firebasestorage.app",
  messagingSenderId: "493041240645",
  appId: "1:493041240645:web:9d3d910d912f52f72e312c",
  measurementId: "G-5Y8B7DQBGV"
};

export const isFirebaseConfigured = () => true;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
// Always show account picker — user can choose which Gmail to use
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { auth, googleProvider, signInWithPopup, signOut };
