<!-- resources/js/Pages/Listing/Index/Components/Listing.vue -->
<template>
    <div
        class="card group hover:scale-[1.01] transform transition-all duration-200"
    >
        <!-- Status Badge -->
        <div v-if="listing.status" class="mb-3">
            <span
                class="px-2.5 py-1 text-xs font-medium rounded-full"
                :class="[listing.status_display.bg_color]"
            >
                {{ listing.status_display.text }}
            </span>
        </div>

        <div class="flex items-start justify-between mb-3">
            <Link
                :href="route('profile.show', { id: listing.owner.id })"
                class="flex items-center gap-2"
            >
                <div
                    class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm uppercase"
                >
                    {{ listing.owner.name.charAt(0)
                    }}{{ listing.owner.name.split(" ")[1]?.charAt(0) || "" }}
                </div>
                <span class="text-sm font-medium">{{
                    listing.owner.name
                }}</span>
            </Link>

            <div
                v-if="listing.category"
                class="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-md"
            >
                {{ listing.category.name }}
            </div>
        </div>

        <Link
            :href="route('listing.show', { listing: listing.id })"
            class="block mb-3"
        >
            <div
                class="p-5 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-center hover:bg-brand-50 dark:hover:bg-zinc-800/80 transition-colors"
            >
                <h3 class="font-semibold mb-1 text-lg">
                    {{ listing.tradeWhat }}
                </h3>
                <div
                    class="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
                >
                    <span>for</span>
                    <span class="font-medium text-brand-600">{{
                        listing.forWhat
                    }}</span>
                </div>
            </div>
        </Link>

        <!-- Status Controls - Only show if user is the owner -->
        <div
            v-if="canUpdateStatus"
            class="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-700"
        >
            <p class="text-xs mb-2 text-zinc-500 dark:text-zinc-400">
                Update Status:
            </p>
            <div class="flex gap-2">
                <StatusButton
                    :active="listing.status === 'available'"
                    @click="updateStatus('available')"
                    class="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800/30 dark:text-green-100"
                >
                    Available
                </StatusButton>

                <StatusButton
                    :active="listing.status === 'pending'"
                    @click="updateStatus('pending')"
                    class="bg-brand-100 text-brand-800 hover:bg-brand-200 dark:bg-brand-800/30 dark:text-brand-100"
                >
                    Pending
                </StatusButton>

                <StatusButton
                    :active="listing.status === 'completed'"
                    @click="updateStatus('completed')"
                    class="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/30 dark:text-blue-100"
                >
                    Completed
                </StatusButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Link, router } from "@inertiajs/vue3";
import { computed } from "vue";
import { usePage } from "@inertiajs/vue3";

// New component for status buttons
const StatusButton = defineComponent({
    props: {
        active: Boolean,
    },
    setup(props, { slots }) {
        return () =>
            h(
                "button",
                {
                    class: [
                        "px-2 py-1 text-xs rounded-md transition-colors",
                        props.active
                            ? "opacity-50 cursor-not-allowed"
                            : "opacity-100",
                    ],
                    disabled: props.active,
                },
                slots.default()
            );
    },
});

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
