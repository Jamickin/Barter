// resources/js/services/listing-service.js
import { db, auth, storage } from "../firebase";
import {
    collection,
    addDoc,
    getDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const listingService = {
    async createListing(listingData) {
        try {
            const user = auth.currentUser;
            if (!user)
                throw new Error("User must be logged in to create a listing");

            // If there's an image to upload
            let imageUrl = null;
            if (listingData.image) {
                const imageRef = ref(
                    storage,
                    `listings/${user.uid}/${Date.now()}_${
                        listingData.image.name
                    }`
                );
                await uploadBytes(imageRef, listingData.image);
                imageUrl = await getDownloadURL(imageRef);
            }

            // Prepare the listing document
            const listing = {
                tradeWhat: listingData.tradeWhat,
                forWhat: listingData.forWhat,
                categoryId: listingData.category_id,
                status: "available",
                byUserId: user.uid,
                ownerName: user.displayName,
                imageUrl: imageUrl,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Add to Firestore
            const docRef = await addDoc(collection(db, "listings"), listing);
            return { id: docRef.id, ...listing };
        } catch (error) {
            console.error("Error creating listing:", error);
            throw error;
        }
    },

    async getListings(filters = {}, lastDoc = null, pageSize = 9) {
        try {
            let listingsQuery = collection(db, "listings");
            const queryConstraints = [];

            // Add filters
            if (filters.search) {
                // Firebase doesn't support OR queries well, so you might need multiple queries
                // This is a simplified approach
                queryConstraints.push(where("tradeWhat", ">=", filters.search));
                queryConstraints.push(
                    where("tradeWhat", "<=", filters.search + "\uf8ff")
                );
            }

            if (filters.category) {
                queryConstraints.push(
                    where("categoryId", "==", filters.category)
                );
            }

            // Add sorting
            queryConstraints.push(orderBy("createdAt", "desc"));

            // Add pagination
            queryConstraints.push(limit(pageSize));
            if (lastDoc) {
                queryConstraints.push(startAfter(lastDoc));
            }

            // Execute query
            const q = query(listingsQuery, ...queryConstraints);
            const querySnapshot = await getDocs(q);

            // Format results
            const listings = [];
            querySnapshot.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            // Get the last document for pagination
            const lastVisible =
                querySnapshot.docs[querySnapshot.docs.length - 1];

            return {
                listings,
                lastDoc: lastVisible,
                hasMore: querySnapshot.docs.length === pageSize,
            };
        } catch (error) {
            console.error("Error fetching listings:", error);
            throw error;
        }
    },

    async getListing(id) {
        try {
            const docRef = doc(db, "listings", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                };
            } else {
                throw new Error("Listing not found");
            }
        } catch (error) {
            console.error("Error fetching listing:", error);
            throw error;
        }
    },

    async updateListing(id, listingData) {
        try {
            const user = auth.currentUser;
            if (!user)
                throw new Error("User must be logged in to update a listing");

            // Get the listing to check ownership
            const listing = await this.getListing(id);
            if (listing.byUserId !== user.uid && !user.isAdmin) {
                throw new Error("Not authorized to update this listing");
            }

            // Process image if provided
            let imageUrl = listing.imageUrl;
            if (listingData.image) {
                const imageRef = ref(
                    storage,
                    `listings/${user.uid}/${Date.now()}_${
                        listingData.image.name
                    }`
                );
                await uploadBytes(imageRef, listingData.image);
                imageUrl = await getDownloadURL(imageRef);
            }

            // Update the listing
            const updateData = {
                tradeWhat: listingData.tradeWhat,
                forWhat: listingData.forWhat,
                categoryId: listingData.category_id,
                imageUrl: imageUrl,
                updatedAt: new Date().toISOString(),
            };

            await updateDoc(doc(db, "listings", id), updateData);
            return { id, ...listing, ...updateData };
        } catch (error) {
            console.error("Error updating listing:", error);
            throw error;
        }
    },

    async updateListingStatus(id, status) {
        try {
            const user = auth.currentUser;
            if (!user)
                throw new Error(
                    "User must be logged in to update listing status"
                );

            // Get the listing to check ownership
            const listing = await this.getListing(id);
            if (listing.byUserId !== user.uid && !user.isAdmin) {
                throw new Error("Not authorized to update this listing");
            }

            // Update status
            await updateDoc(doc(db, "listings", id), {
                status: status,
                updatedAt: new Date().toISOString(),
            });

            return { ...listing, status };
        } catch (error) {
            console.error("Error updating listing status:", error);
            throw error;
        }
    },

    async deleteListing(id) {
        try {
            const user = auth.currentUser;
            if (!user)
                throw new Error("User must be logged in to delete a listing");

            // Get the listing to check ownership
            const listing = await this.getListing(id);
            if (listing.byUserId !== user.uid && !user.isAdmin) {
                throw new Error("Not authorized to delete this listing");
            }

            // Delete the listing
            await deleteDoc(doc(db, "listings", id));
            return true;
        } catch (error) {
            console.error("Error deleting listing:", error);
            throw error;
        }
    },

    async getUserListings(userId) {
        try {
            const q = query(
                collection(db, "listings"),
                where("byUserId", "==", userId),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);

            const listings = [];
            querySnapshot.forEach((doc) => {
                listings.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            return listings;
        } catch (error) {
            console.error("Error fetching user listings:", error);
            throw error;
        }
    },
};
