// resources/js/app.js

import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import MainLayout from "@/Layouts/MainLayout.vue";
import { ZiggyVue } from "ziggy";
import { Ziggy } from "./ziggy";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { userAPI } from "./services/firebase-api";
import "../css/app.css";

// Auth state observer
let authInitialized = false;
let currentUser = null;

// Watch for auth state changes
onAuthStateChanged(auth, async (user) => {
    currentUser = user;

    if (user && !authInitialized) {
        // User is signed in, get additional profile data if needed
        try {
            const userProfile = await userAPI.getUserProfile(user.uid);
            // You could store this in a global state if needed
            console.log("User profile loaded:", userProfile);
        } catch (error) {
            console.error("Error loading user profile:", error);
        }
    }

    authInitialized = true;
});

// Create Inertia App
createInertiaApp({
    resolve: async (name) => {
        const pages = import.meta.glob("./Pages/**/*.vue");
        const page = await pages[`./Pages/${name}.vue`]();
        page.default.layout = page.default.layout || MainLayout;

        // Add auth middleware if needed
        if (
            page.default.middleware &&
            page.default.middleware.includes("auth")
        ) {
            // You can add middleware logic here
        }

        return page;
    },
    setup({ el, App, props, plugin }) {
        createApp({
            render: () => h(App, props),
            // Provide the Firebase user to all components
            provide: {
                firebaseUser: () => currentUser,
            },
        })
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .mount(el);
    },
    progress: {
        color: "#ea580c", // Brand orange
        showSpinner: true,
    },
});
