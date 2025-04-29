// resources/js/middleware/auth.js

import { auth } from "../firebase";
import { router } from "@inertiajs/vue3";

export default function firebaseAuth({ next }) {
    // Get the current auth state
    const user = auth.currentUser;

    // If no user is logged in, redirect to login page
    if (!user) {
        return router.visit("/login");
    }

    // User is authenticated, continue to the requested page
    return next();
}
