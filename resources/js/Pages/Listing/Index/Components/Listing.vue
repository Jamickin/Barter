<template>
    <Box>
        <div>
            <!-- Status Badge -->
            <div v-if="listing.status" class="mb-2">
                <span
                    class="px-2 py-1 text-xs rounded-full"
                    :class="[listing.status_display.bg_color]"
                >
                    {{ listing.status_display.text }}
                </span>
            </div>

            <div class="flex items-center gap-1">
                <span>
                    <Link
                        :href="route('profile.show', { id: listing.owner.id })"
                    >
                        {{ listing.owner.name }}
                    </Link>
                </span>
            </div>

            <Link :href="route('listing.show', { listing: listing.id })">
                <Box class="text-center px-auto">
                    wants a <span> {{ listing.tradeWhat }}</span>
                    for a
                    <span>{{ listing.forWhat }}</span>
                </Box>
            </Link>

            <!-- Category info if available -->
            <div v-if="listing.category" class="mt-2 text-sm text-zinc-500">
                Category:
                <span class="text-orange-500">{{ listing.category.name }}</span>
            </div>

            <!-- Status Controls - Only show if user is the owner -->
            <div
                v-if="canUpdateStatus"
                class="mt-4 border-t pt-2 border-zinc-200 dark:border-zinc-700"
            >
                <p class="text-sm mb-2">Update Status:</p>
                <div class="flex gap-2">
                    <form @submit.prevent="updateStatus('available')">
                        <button
                            type="submit"
                            class="px-2 py-1 text-xs rounded-md bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700"
                            :disabled="listing.status === 'available'"
                        >
                            Available
                        </button>
                    </form>

                    <form @submit.prevent="updateStatus('pending')">
                        <button
                            type="submit"
                            class="px-2 py-1 text-xs rounded-md bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-800 dark:text-orange-100 dark:hover:bg-orange-700"
                            :disabled="listing.status === 'pending'"
                        >
                            Trade Pending
                        </button>
                    </form>

                    <form @submit.prevent="updateStatus('completed')">
                        <button
                            type="submit"
                            class="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700"
                            :disabled="listing.status === 'completed'"
                        >
                            Mark Completed
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </Box>
</template>

<script setup>
import { Link, router } from "@inertiajs/vue3";
import Box from "@/Components/UI/Box.vue";
import { computed } from "vue";
import { usePage } from "@inertiajs/vue3";

const props = defineProps({
    listing: Object,
});

const page = usePage();
const authUser = computed(() => page.props.auth.user);

// Check if current user can update the status (if they are the owner)
const canUpdateStatus = computed(() => {
    return (
        authUser.value &&
        (authUser.value.id === props.listing.by_user_id ||
            authUser.value.is_admin === true)
    );
});

// Function to update listing status
const updateStatus = (status) => {
    router.patch(
        route("listing.update-status", { listing: props.listing.id }),
        { status },
        { preserveScroll: true }
    );
};
</script>
