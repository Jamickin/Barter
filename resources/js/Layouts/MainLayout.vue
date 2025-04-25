<!-- resources/js/Layouts/MainLayout.vue -->
<template>
    <div class="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col">
        <header
            class="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10 shadow-sm"
        >
            <div class="container mx-auto w-full px-4">
                <nav class="py-4 flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-display font-bold">
                            <Link
                                :href="route('listing.index')"
                                class="text-brand-600 hover:text-brand-500"
                                >BARTER</Link
                            >
                        </h1>
                    </div>

                    <div v-if="authUser" class="flex items-center gap-4">
                        <div class="text-sm text-zinc-600 dark:text-zinc-400">
                            <Link
                                :href="route('profile.show', authUser.id)"
                                class="flex items-center gap-2"
                            >
                                <div
                                    class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs uppercase"
                                >
                                    {{ authUser.name.charAt(0) }}
                                </div>
                                <span>{{ authUser.name }}</span>
                            </Link>
                        </div>

                        <!-- Messages Link with Notification Indicator -->
                        <Link
                            :href="route('messages.index')"
                            class="relative btn-normal py-2 px-3"
                        >
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

                        <Link
                            :href="route('listing.create')"
                            class="btn-primary"
                        >
                            + New Listing
                        </Link>

                        <div>
                            <form @submit.prevent="logout">
                                <button
                                    type="submit"
                                    class="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                                >
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>

                    <div v-else class="flex gap-4 items-center">
                        <Link :href="route('login')" class="btn-normal py-2"
                            >Sign In</Link
                        >
                        <Link
                            :href="route('user-account.create')"
                            class="btn-primary"
                            >Register</Link
                        >
                    </div>
                </nav>
            </div>
        </header>

        <main class="container mx-auto p-4 w-full flex-grow">
            <div
                v-if="flashSuccess"
                class="mb-6 border rounded-md shadow-sm border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900 p-4 fade-in flex items-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-green-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                    />
                </svg>
                {{ flashSuccess }}
            </div>

            <slot>Default</slot>
        </main>

        <footer
            class="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-6 mt-12"
        >
            <div class="container mx-auto px-4">
                <div
                    class="text-center text-zinc-500 dark:text-zinc-400 text-sm"
                >
                    © {{ new Date().getFullYear() }} Barter. All rights
                    reserved.
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { Link, usePage, router } from "@inertiajs/vue3";

const page = usePage();
const flashSuccess = computed(() => page.props.flash.success);
const authUser = computed(() => page.props.auth.user);
const unreadMessagesCount = computed(
    () => page.props.auth.unreadMessagesCount || 0
);

// Logout function that uses POST method
const logout = () => {
    router.post(route("logout"));
};
</script>
