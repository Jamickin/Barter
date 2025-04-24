<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Message Details</h1>

        <div class="mb-6 flex justify-between">
            <Link
                :href="route('messages.index')"
                class="text-orange-500 hover:text-orange-700"
            >
                &larr; Back to Messages
            </Link>

            <Link
                :href="route('messages.reply', message.id)"
                class="btn-primary"
            >
                Reply
            </Link>
        </div>

        <Box>
            <!-- Message Header -->
            <div
                class="border-b border-zinc-200 dark:border-zinc-700 pb-4 mb-4"
            >
                <div class="flex justify-between items-start">
                    <div>
                        <div class="mb-1">
                            <span class="font-medium">From:</span>
                            {{ message.sender.name }}
                        </div>
                        <div class="mb-1">
                            <span class="font-medium">To:</span>
                            {{ message.recipient.name }}
                        </div>
                        <div v-if="message.listing" class="mb-1">
                            <span class="font-medium">Regarding Listing:</span>
                            <Link
                                :href="
                                    route('listing.show', message.listing.id)
                                "
                                class="text-orange-500 hover:text-orange-700"
                            >
                                {{ message.listing.tradeWhat }} for
                                {{ message.listing.forWhat }}
                            </Link>
                        </div>
                        <div class="text-sm text-zinc-500 dark:text-zinc-400">
                            {{ formatDate(message.created_at) }}
                        </div>
                    </div>

                    <div>
                        <span
                            v-if="message.read"
                            class="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs px-2 py-1 rounded-full"
                        >
                            Read
                        </span>
                        <span
                            v-else
                            class="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 text-xs px-2 py-1 rounded-full"
                        >
                            Unread
                        </span>
                    </div>
                </div>
            </div>

            <!-- Message Content -->
            <div class="whitespace-pre-wrap">
                {{ message.message }}
            </div>
        </Box>
    </div>
</template>

<script setup>
import { Link } from "@inertiajs/vue3";
import Box from "@/Components/UI/Box.vue";

const props = defineProps({
    message: Object,
});

// Format date to a more readable format
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
</script>
