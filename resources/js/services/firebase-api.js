// resources/js/services/firebase-api.js

import { auth, db, storage } from "../firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged,
} from "firebase/auth";
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Auth API
export const authAPI = {
    // Register a new user
    async register(email, password, name) {
        try {
            // Create the user account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            // Update the user profile with their name
            await updateProfile(userCredential.user, { displayName: name });

            // Create a user document in Firestore
            await addDoc(collection(db, "users"), {
                uid: userCredential.user.uid,
                email: email,
                name: name,
                is_admin: false,
                created_at: serverTimestamp(),
            });

            return userCredential.user;
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    },

    // Login existing user
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            return userCredential.user;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    },

    // Logout user
    async logout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    },

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    },

    // Listen for auth state changes
    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    },
};

// Listings API
export const listingAPI = {
    // Create a new listing
    async createListing(listingData) {
        try {
            const user = auth.currentUser;
            if (!user)
                throw new Error("You must be logged in to create a listing");

            // Handle image upload if present
            let imageUrl = null;
            if (listingData.image) {
                const storageRef = ref(
                    storage,
                    `listings/${user.uid}/${Date.now()}_${
                        listingData.image.name
                    }`
                );
                const snapshot = await uploadBytes(
                    storageRef,
                    listingData.image
                );
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // Create the listing document
            const listing = {
                tradeWhat: listingData.tradeWhat,
                forWhat: listingData.forWhat,
                category_id: listingData.category_id,
                by_user_id: user.uid,
                owner: {
                    id: user.uid,
                    name: user.displayName,
                },
                status: "available",
                image_url: imageUrl,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, "listings"), listing);
            return { id: docRef.id, ...listing };
        } catch (error) {
            console.error("Error creating listing:", error);
            throw error;
        }
    },

    // Get all listings with filtering options
    async getListings(filters = {}, pagination = { page: 1, perPage: 9 }) {
        try {
            let q = collection(db, "listings");
            const queryConstraints = [];

            // Apply filters
            if (filters.search) {
                queryConstraints.push(where("tradeWhat", ">=", filters.search));
                queryConstraints.push(
                    where("tradeWhat", "<=", filters.search + "\uf8ff")
                );
            }

            if (filters.category) {
                queryConstraints.push(
                    where("category_id", "==", filters.category)
                );
            }

            // Apply ordering
            queryConstraints.push(orderBy("created_at", "desc"));

            // Apply pagination
            const startIndex = (pagination.page - 1) * pagination.perPage;
            queryConstraints.push(limit(pagination.perPage));

            q = query(q, ...queryConstraints);

            const querySnapshot = await getDocs(q);

            const listings = [];
            querySnapshot.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    ...doc.data(),
                    created_at: doc.data().created_at?.toDate(),
                    updated_at: doc.data().updated_at?.toDate(),
                });
            });

            return {
                data: listings,
                total: listings.length,
                current_page: pagination.page,
                per_page: pagination.perPage,
            };
        } catch (error) {
            console.error("Error getting listings:", error);
            throw error;
        }
    },

    // Get a single listing by ID
    async getListing(id) {
        try {
            const docRef = doc(db, "listings", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                    created_at: docSnap.data().created_at?.toDate(),
                    updated_at: docSnap.data().updated_at?.toDate(),
                };
            } else {
                throw new Error("Listing not found");
            }
        } catch (error) {
            console.error("Error getting listing:", error);
            throw error;
        }
    },

    // Update a listing
    async updateListing(id, listingData) {
        try {
            const user = auth.currentUser;
            if (!user)
                throw new Error("You must be logged in to update a listing");

            // Get the current listing to check permissions
            const listingRef = doc(db, "listings", id);
            const listingSnap = await getDoc(listingRef);

            if (!listingSnap.exists()) {
                throw new Error("Listing not found");
            }

            const listing = listingSnap.data();
            if (listing.by_user_id !== user.uid && !user.isAdmin) {
                throw new Error(
                    "You don't have permission to update this listing"
                );
            }

            // Handle image upload if present
            let imageUrl = listing.image_url;
            if (listingData.image) {
                const storageRef = ref(
                    storage,
                    `listings/${user.uid}/${Date.now()}_${
                        listingData.image.name
                    }`
                );
                const snapshot = await uploadBytes(
                    storageRef,
                    listingData.image
                );
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // Update the listing
            const updateData = {
                tradeWhat: listingData.tradeWhat,
                forWhat: listingData.forWhat,
                category_id: listingData.category_id,
                image_url: imageUrl,
                updated_at: serverTimestamp(),
            };

            await updateDoc(listingRef, updateData);

            return { id, ...listing, ...updateData };
        } catch (error) {
            console.error("Error updating listing:", error);
            throw error;
        }
    },

    // Update listing status
    async updateListingStatus(id, status) {
        try {
            const user = auth.currentUser;
            if (!user)
                throw new Error(
                    "You must be logged in to update a listing status"
                );

            // Get the current listing to check permissions
            const listingRef = doc(db, "listings", id);
            const listingSnap = await getDoc(listingRef);

            if (!listingSnap.exists()) {
                throw new Error("Listing not found");
            }

            const listing = listingSnap.data();
            if (listing.by_user_id !== user.uid && !user.isAdmin) {
                throw new Error(
                    "You don't have permission to update this listing"
                );
            }

            // Update the status
            await updateDoc(listingRef, {
                status: status,
                updated_at: serverTimestamp(),
            });

            return { id, ...listing, status };
        } catch (error) {
            console.error("Error updating listing status:", error);
            throw error;
        }
    },

    // Delete a listing
    async deleteListing(id) {
        try {
            const user = auth.currentUser;
            if (!user)
                throw new Error("You must be logged in to delete a listing");

            // Get the current listing to check permissions
            const listingRef = doc(db, "listings", id);
            const listingSnap = await getDoc(listingRef);

            if (!listingSnap.exists()) {
                throw new Error("Listing not found");
            }

            const listing = listingSnap.data();
            if (listing.by_user_id !== user.uid && !user.isAdmin) {
                throw new Error(
                    "You don't have permission to delete this listing"
                );
            }

            // Delete the listing
            await deleteDoc(listingRef);

            return true;
        } catch (error) {
            console.error("Error deleting listing:", error);
            throw error;
        }
    },

    // Get user's listings
    async getUserListings(userId) {
        try {
            const q = query(
                collection(db, "listings"),
                where("by_user_id", "==", userId),
                orderBy("created_at", "desc")
            );

            const querySnapshot = await getDocs(q);

            const listings = [];
            querySnapshot.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    ...doc.data(),
                    created_at: doc.data().created_at?.toDate(),
                    updated_at: doc.data().updated_at?.toDate(),
                });
            });

            return listings;
        } catch (error) {
            console.error("Error getting user listings:", error);
            throw error;
        }
    },
};

// Categories API
export const categoryAPI = {
    // Get all categories
    async getCategories() {
        try {
            const querySnapshot = await getDocs(collection(db, "categories"));

            const categories = [];
            querySnapshot.forEach((doc) => {
                categories.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            return categories;
        } catch (error) {
            console.error("Error getting categories:", error);
            throw error;
        }
    },
};

// Messages API
export const messageAPI = {
    // Send a message
    async sendMessage(messageData) {
        try {
            const user = auth.currentUser;
            if (!user)
                throw new Error("You must be logged in to send a message");

            const message = {
                from_user_id: user.uid,
                to_user_id: messageData.to_user_id,
                listing_id: messageData.listing_id || null,
                message: messageData.message,
                read: false,
                created_at: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, "messages"), message);
            return { id: docRef.id, ...message };
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    },

    // Get user's received messages
    async getReceivedMessages() {
        try {
            const user = auth.currentUser;
            if (!user)
                throw new Error("You must be logged in to view messages");

            const q = query(
                collection(db, "messages"),
                where("to_user_id", "==", user.uid),
                orderBy("created_at", "desc")
            );

            const querySnapshot = await getDocs(q);

            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push({
                    id: doc.id,
                    ...doc.data(),
                    created_at: doc.data().created_at?.toDate(),
                });
            });

            return messages;
        } catch (error) {
            console.error("Error getting received messages:", error);
            throw error;
        }
    },

    // Get user's sent messages
    async getSentMessages() {
        try {
            const user = auth.currentUser;
            if (!user)
                throw new Error("You must be logged in to view messages");

            const q = query(
                collection(db, "messages"),
                where("from_user_id", "==", user.uid),
                orderBy("created_at", "desc")
            );

            const querySnapshot = await getDocs(q);

            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push({
                    id: doc.id,
                    ...doc.data(),
                    created_at: doc.data().created_at?.toDate(),
                });
            });

            return messages;
        } catch (error) {
            console.error("Error getting sent messages:", error);
            throw error;
        }
    },

    // Get a single message
    async getMessage(id) {
        try {
            const user = auth.currentUser;
            if (!user)
                throw new Error("You must be logged in to view messages");

            const docRef = doc(db, "messages", id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error("Message not found");
            }

            const message = docSnap.data();

            // Check if user is either sender or recipient
            if (
                message.from_user_id !== user.uid &&
                message.to_user_id !== user.uid
            ) {
                throw new Error(
                    "You don't have permission to view this message"
                );
            }

            // Mark as read if user is recipient and message is unread
            if (message.to_user_id === user.uid && !message.read) {
                await updateDoc(docRef, { read: true });
                message.read = true;
            }

            return {
                id: docSnap.id,
                ...message,
                created_at: message.created_at?.toDate(),
            };
        } catch (error) {
            console.error("Error getting message:", error);
            throw error;
        }
    },

    // Get unread message count
    async getUnreadCount() {
        try {
            const user = auth.currentUser;
            if (!user) return 0;

            const q = query(
                collection(db, "messages"),
                where("to_user_id", "==", user.uid),
                where("read", "==", false)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.size;
        } catch (error) {
            console.error("Error getting unread count:", error);
            return 0;
        }
    },
};

// User API
export const userAPI = {
    // Get user profile
    async getUserProfile(userId) {
        try {
            const q = query(
                collection(db, "users"),
                where("uid", "==", userId)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error("User not found");
            }

            const userDoc = querySnapshot.docs[0];
            return {
                id: userDoc.id,
                ...userDoc.data(),
            };
        } catch (error) {
            console.error("Error getting user profile:", error);
            throw error;
        }
    },
};
