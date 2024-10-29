// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import {
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged,
    User
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA41tTUNiP-QgyBpYGH7CVsKIalMS4dk-Y",
  authDomain: "yt-clone-a5dac.firebaseapp.com",
  projectId: "yt-clone-a5dac",
  
  appId: "1:1049515487055:web:222e8fd23099dad4149f3a",
  measurementId: "G-WW67DMTTXM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const functions =  getFunctions();


export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut(){
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null)=>void){
    return onAuthStateChanged(auth, callback);
}
