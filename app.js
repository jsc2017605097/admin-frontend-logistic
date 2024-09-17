// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, updateDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAWZIpMnh-iDxI3Evh_3WYJvj9BISJRqI",
  authDomain: "bongfeng-f38a3.firebaseapp.com",
  databaseURL: "https://bongfeng-f38a3.firebaseio.com",
  projectId: "bongfeng-f38a3",
  storageBucket: "bongfeng-f38a3.appspot.com",
  messagingSenderId: "696944009502",
  appId: "1:696944009502:web:3fe91b5ef878af4839e90f",
  measurementId: "G-STRYFNL72J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

async function saveOrder(order) {
    try {
        const docRef = await addDoc(collection(db, "orders"), order);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function updateOrder(id, updatedOrder) {
    try {
        const orderDoc = doc(db, "orders", id);
        await updateDoc(orderDoc, updatedOrder);
        console.log("Document successfully updated!");
    } catch (e) {
        console.error("Error updating document: ", e);
    }
}
