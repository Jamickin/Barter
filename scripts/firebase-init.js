// scripts/firebase-init.js

import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    addDoc,
    writeBatch,
    doc,
} from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";

// Load your Firebase config - adjust this path as needed
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function initializeFirebase() {
    try {
        console.log("Starting Firebase initialization...");

        // Create admin user
        const adminEmail = "admin@example.com";
        const adminPassword = "Admin123!"; // Change this to a secure password

        let adminUid;
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                adminEmail,
                adminPassword
            );
            await updateProfile(userCredential.user, {
                displayName: "Admin User",
            });
            adminUid = userCredential.user.uid;
            console.log("Admin user created with UID:", adminUid);
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                console.log("Admin user already exists, continuing...");
            } else {
                throw error;
            }
        }

        // Create admin user document
        if (adminUid) {
            await addDoc(collection(db, "users"), {
                uid: adminUid,
                name: "Admin User",
                email: adminEmail,
                is_admin: true,
                created_at: new Date(),
            });
            console.log("Admin user document created");
        }

        // Add categories
        const categories = [
            { name: "Electronics", slug: "electronics" },
            { name: "Furniture", slug: "furniture" },
            { name: "Clothing", slug: "clothing" },
            { name: "Books", slug: "books" },
            { name: "Tools", slug: "tools" },
            { name: "Sports Equipment", slug: "sports-equipment" },
            { name: "Art", slug: "art" },
            { name: "Collectibles", slug: "collectibles" },
            { name: "Toys & Games", slug: "toys-games" },
            { name: "Home Decor", slug: "home-decor" },
            { name: "Vehicles", slug: "vehicles" },
            { name: "Services", slug: "services" },
            { name: "Other", slug: "other" },
        ];

        const batch = writeBatch(db);

        categories.forEach((category) => {
            const docRef = doc(collection(db, "categories"));
            batch.set(docRef, {
                name: category.name,
                slug: category.slug,
                created_at: new Date(),
            });
        });

        await batch.commit();
        console.log("Categories created");

        console.log("Firebase initialization completed successfully!");
    } catch (error) {
        console.error("Error initializing Firebase:", error);
    }
}

// Run the initialization
initializeFirebase();
