// resources/js/services/firestore.js
import { db } from "../firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
} from "firebase/firestore";

export const firestoreService = {
    // Add a listing to Firestore
    async addListing(listing) {
        try {
            const docRef = await addDoc(collection(db, "listings"), listing);
            return docRef.id;
        } catch (error) {
            console.error("Error adding listing: ", error);
            throw error;
        }
    },

    // Get listings from Firestore
    async getListings() {
        try {
            const querySnapshot = await getDocs(collection(db, "listings"));
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
        } catch (error) {
            console.error("Error getting listings: ", error);
            throw error;
        }
    },

    // Other CRUD operations
};
