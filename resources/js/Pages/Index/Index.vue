<template>
    <div class="index-container">
        <h1>Welcome to Our Website!</h1>
        <p class="message">{{ message }}</p>
        <Link class="btn-primary" :href="route('listing.index')"
            >Go to the main page</Link
        >
    </div>
</template>

<script setup>
import { Link } from "@inertiajs/vue3";
defineProps({ message: String });
</script>

<style scoped>
.index-container {
    @apply flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-800 py-12 mt-24 px-4 text-center;
}
.message {
    @apply mb-4 text-zinc-600 dark:text-zinc-300;
}
</style>
