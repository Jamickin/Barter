<template>
    <header
        class="border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 w-full"
    >
        <div class="container mx-auto w-full">
            <nav class="p-4 flex items-center justify-between">
                <div>
                    <h1><Link :href="route('listing.index')">BARTER</Link></h1>
                </div>
                <div v-if="authUser" class="flex items-center gap-4">
                    <div class="text-sm text-zinc-500">
                        <Link :href="route('profile.show', authUser.id)">
                            {{ authUser.name }}
                        </Link>
                    </div>

                    <!-- Messages Link with Notification Indicator -->
                    <Link :href="route('messages.index')" class="relative">
                        <span>Messages</span>
                        <span
                            v-if="unreadMessagesCount > 0"
                            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                        >
                            {{
                                unreadMessagesCount > 9
                                    ? "9+"
                                    : unreadMessagesCount
                            }}
                        </span>
                    </Link>

                    <Link :href="route('listing.create')" class="btn-primary">
                        + NEW LISTING
                    </Link>
                    <div>
                        <!-- Replace Link with form submit for proper POST logout -->
                        <form @submit.prevent="logout">
                            <button type="submit" class="input-error">
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
                <div v-else class="flex gap-4 items-center">
                    <Link :href="route('login')">Sign-in</Link>
                    <Link :href="route('user-account.create')">Register</Link>
                </div>
            </nav>
        </div>
    </header>

    <main class="container mx-auto p-4 w-full">
        <div
            v-if="flashSuccess"
            class="mb-4 border rounded-md shadow-sm border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900 p-2"
        >
            {{ flashSuccess }}
        </div>
        <slot>Default</slot>
    </main>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { Link, usePage, router } from "@inertiajs/vue3";

const page = usePage();
const flashSuccess = computed(() => page.props.flash.success);
const authUser = computed(() => page.props.auth.user); // Reference the authenticated user
const unreadMessagesCount = computed(
    () => page.props.auth.unreadMessagesCount || 0
);

// Logout function that uses POST method
const logout = () => {
    router.post(route("logout"));
};
</script>
