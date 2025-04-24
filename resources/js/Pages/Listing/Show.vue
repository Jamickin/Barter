<template>
    <div class="space-y-6">
        <!-- Listing Details -->
        <Box>
            <!-- Status Badge -->
            <div v-if="listing.status" class="mb-2">
                <span
                    class="px-2 py-1 text-xs rounded-full"
                    :class="[listing.status_display.bg_color]"
                >
                    {{ listing.status_display.text }}
                </span>
            </div>

            <h1 class="text-2xl font-bold mb-2">
                {{ listing.tradeWhat }} for {{ listing.forWhat }}
            </h1>

            <!-- Category info if available -->
            <div v-if="listing.category" class="mb-4">
                <span class="font-medium">Category:</span>
                <span class="text-orange-500">{{ listing.category.name }}</span>
            </div>

            <!-- Owner info -->
            <div class="mb-4">
                <span class="font-medium">Listed by:</span>
                <Link
                    :href="route('profile.show', listing.owner.id)"
                    class="text-orange-500"
                >
                    {{ listing.owner.name }}
                </Link>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
                <!-- Contact Seller button - Only show if user is logged in and not the owner -->
                <Link
                    v-if="canContactOwner"
                    :href="
                        route('messages.create', {
                            to: listing.owner.id,
                            listing: listing.id,
                        })
                    "
                    class="btn-primary"
                >
                    Contact Seller
                </Link>

                <!-- Edit button - Only show if user can edit -->
                <Link
                    v-if="canEdit"
                    :href="route('listing.edit', { listing: listing.id })"
                    class="btn-normal"
                >
                    Edit Listing
                </Link>

                <!-- Delete button - Only show if user can delete -->
                <button
                    v-if="canDelete"
                    @click="openDeleteConfirmation"
                    class="input-error"
                >
                    Delete
                </button>
            </div>
        </Box>

        <!-- Status Controls - Only show if user is the owner -->
        <Box v-if="canUpdateStatus">
            <h2 class="font-semibold mb-2">Update Listing Status</h2>
            <div class="flex flex-wrap gap-2">
                <form @submit.prevent="updateStatus('available')">
                    <button
                        type="submit"
                        class="px-3 py-1 rounded-md bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700"
                        :disabled="listing.status === 'available'"
                    >
                        Available
                    </button>
                </form>

                <form @submit.prevent="updateStatus('pending')">
                    <button
                        type="submit"
                        class="px-3 py-1 rounded-md bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-800 dark:text-orange-100 dark:hover:bg-orange-700"
                        :disabled="listing.status === 'pending'"
                    >
                        Trade Pending
                    </button>
                </form>

                <form @submit.prevent="updateStatus('completed')">
                    <button
                        type="submit"
                        class="px-3 py-1 rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700"
                        :disabled="listing.status === 'completed'"
                    >
                        Mark Completed
                    </button>
                </form>
            </div>
        </Box>

        <!-- Confirmation Dialog -->
        <ConfirmationDialog
            :show="showDeleteConfirmation"
            title="Delete Listing"
            :message="
                'Are you sure you want to delete this listing: ' +
                listing.tradeWhat +
                '?'
            "
            confirmLabel="Delete"
            cancelLabel="Cancel"
            @confirm="confirmDelete"
            @cancel="cancelDelete"
        />
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Link, router, usePage } from "@inertiajs/vue3";
import Box from "@/Components/UI/Box.vue";
import ConfirmationDialog from "@/Components/UI/ConfirmationDialog.vue";

const props = defineProps({
    listing: Object,
    owner: Object,
});

const page = usePage();
const authUser = computed(() => page.props.auth.user);

// Check permissions
const canUpdateStatus = computed(() => {
    return (
        authUser.value &&
        (authUser.value.id === props.listing.by_user_id ||
            authUser.value.is_admin)
    );
});

const canEdit = computed(() => {
    return (
        authUser.value &&
        (authUser.value.id === props.listing.by_user_id ||
            authUser.value.is_admin)
    );
});

const canDelete = computed(() => {
    return (
        authUser.value &&
        (authUser.value.id === props.listing.by_user_id ||
            authUser.value.is_admin)
    );
});

const canContactOwner = computed(() => {
    return authUser.value && authUser.value.id !== props.listing.by_user_id;
});

// Function to update listing status
const updateStatus = (status) => {
    router.patch(
        route("listing.update-status", { listing: props.listing.id }),
        { status },
        { preserveScroll: true }
    );
};

// Delete confirmation state
const showDeleteConfirmation = ref(false);

// Open delete confirmation dialog
const openDeleteConfirmation = () => {
    showDeleteConfirmation.value = true;
};

// Handle confirmation
const confirmDelete = () => {
    router.delete(route("listing.destroy", { listing: props.listing.id }), {
        onSuccess: () => {
            router.visit(route("listing.index"));
        },
    });
};

// Handle cancel
const cancelDelete = () => {
    showDeleteConfirmation.value = false;
};
</script>
