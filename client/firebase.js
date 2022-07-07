import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAHe9l7TGS_LktiAZxr9ZOHoLfDGTyE-tk",
    authDomain: "gso-system.firebaseapp.com",
    projectId: "gso-system",
    storageBucket: "gso-system.appspot.com",
    messagingSenderId: "300776755575",
    appId: "1:300776755575:web:eacd0a6032ea6146f8d172",
    measurementId: "G-HZF6XQQ2R3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
