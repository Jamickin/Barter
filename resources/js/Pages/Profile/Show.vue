<template>
    <div>
        <h1>User Profile</h1>
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
        <div v-if="listings.length > 0">
            <h2>Listings:</h2>
            <br />
            <ul>
                <li v-for="listing in listings" :key="listing.id">
                    <Box>
                        <div>
                            <span class="text-orange-500">{{
                                listing.tradeWhat
                            }}</span>
                            for a
                            <span class="text-orange-500">{{
                                listing.forWhat
                            }}</span>
                        </div>

                        <div v-if="canEditOrDelete">
                            <Link
                                :href="
                                    route('listing.edit', {
                                        listing: listing.id,
                                    })
                                "
                            >
                                Edit
                            </Link>
                        </div>
                        <div v-if="canEditOrDelete">
                            <button
                                @click="openDeleteConfirmation(listing)"
                                class="input-error"
                            >
                                Delete
                            </button>
                        </div>
                    </Box>
                </li>
            </ul>
        </div>
        <div v-else>No listings yet!</div>

        <!-- Confirmation Dialog -->
        <ConfirmationDialog
            :show="showDeleteConfirmation"
            title="Delete Listing"
            :message="
                'Are you sure you want to delete this listing: ' +
                (listingToDelete ? listingToDelete.tradeWhat : '') +
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
import Box from "@/Components/UI/Box.vue";
import { Link, router } from "@inertiajs/vue3";
import { computed, ref } from "vue";
import { usePage } from "@inertiajs/vue3";
import ConfirmationDialog from "@/Components/UI/ConfirmationDialog.vue";

const props = defineProps({
    listings: Array,
    user: Object,
});

const page = usePage();

const currentUser = computed(() => page.props.auth.user);

const canEditOrDelete = computed(() => {
    return (
        currentUser.value &&
        (currentUser.value.id === props.user.id || currentUser.value.is_admin)
    );
});

// Delete confirmation state
const showDeleteConfirmation = ref(false);
const listingToDelete = ref(null);

// Open delete confirmation dialog
const openDeleteConfirmation = (listing) => {
    listingToDelete.value = listing;
    showDeleteConfirmation.value = true;
};

// Handle confirmation
const confirmDelete = () => {
    if (listingToDelete.value) {
        router.delete(
            route("listing.destroy", { listing: listingToDelete.value.id }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Hide the confirmation dialog after successful deletion
                    showDeleteConfirmation.value = false;
                    listingToDelete.value = null;
                },
            }
        );
    }
};

// Handle cancel
const cancelDelete = () => {
    showDeleteConfirmation.value = false;
    listingToDelete.value = null;
};
</script>
