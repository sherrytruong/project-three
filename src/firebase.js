import firebase from 'firebase/app';
import 'firebase/database';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAEVpD86gTyFoZVI9jxithrrguRSzr7fs",
    authDomain: "project-three-7645f.firebaseapp.com",
    projectId: "project-three-7645f",
    storageBucket: "project-three-7645f.appspot.com",
    messagingSenderId: "816192865266",
    appId: "1:816192865266:web:686b37d81e8ded76d8e16b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
