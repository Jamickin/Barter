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
                    <Link :href="route('listing.create')" class="btn-primary">
                        + NEW LISTING
                    </Link>
                    <div>
                        <Link
                            :href="route('logout')"
                            as="button"
                            class="input-error"
                        >
                            Logout
                        </Link>
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
import { computed } from "vue";
import { Link, usePage } from "@inertiajs/vue3";

const page = usePage();
const flashSuccess = computed(() => page.props.flash.success);
const authUser = computed(() => page.props.auth.user); // Reference the authenticated user
</script>
