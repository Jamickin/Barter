// resources/js/services/auth-service.js
import { auth, db } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const authService = {
    async register(email, password, name) {
        try {
            // Create user auth account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            // Update profile with display name
            await updateProfile(user, {
                displayName: name,
            });

            // Store additional user data in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                isAdmin: false,
                createdAt: new Date().toISOString(),
            });

            return user;
        } catch (error) {
            console.error("Error during registration:", error);
            throw error;
        }
    },

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            return userCredential.user;
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    },

    async logout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error during logout:", error);
            throw error;
        }
    },

    getCurrentUser() {
        return auth.currentUser;
    },
};
