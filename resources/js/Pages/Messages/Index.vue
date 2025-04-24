<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">My Messages</h1>

        <div class="mb-4">
            <Link :href="route('messages.create')" class="btn-primary">
                Compose New Message
            </Link>
        </div>

        <!-- Tab navigation -->
        <div class="border-b border-zinc-200 dark:border-zinc-700 mb-6">
            <div class="flex">
                <button
                    class="px-4 py-2 mr-2 rounded-t-md"
                    :class="
                        activeTab === 'received'
                            ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 border-b-2 border-orange-500'
                            : 'text-zinc-500 dark:text-zinc-400'
                    "
                    @click="activeTab = 'received'"
                >
                    Received ({{ receivedMessages.length }})
                </button>
                <button
                    class="px-4 py-2 rounded-t-md"
                    :class="
                        activeTab === 'sent'
                            ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 border-b-2 border-orange-500'
                            : 'text-zinc-500 dark:text-zinc-400'
                    "
                    @click="activeTab = 'sent'"
                >
                    Sent ({{ sentMessages.length }})
                </button>
            </div>
        </div>

        <!-- Received messages -->
        <div v-if="activeTab === 'received'">
            <div
                v-if="receivedMessages.length === 0"
                class="text-center py-8 text-zinc-500 dark:text-zinc-400"
            >
                You haven't received any messages yet.
            </div>

            <div v-else class="space-y-4">
                <Box
                    v-for="message in receivedMessages"
                    :key="message.id"
                    class="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                    <Link
                        :href="route('messages.show', message.id)"
                        class="block"
                    >
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-semibold mb-1">
                                    From: {{ message.sender.name }}
                                    <span
                                        v-if="!message.read"
                                        class="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full"
                                    >
                                        New
                                    </span>
                                </div>
                                <div
                                    v-if="message.listing"
                                    class="text-sm text-zinc-500 dark:text-zinc-400 mb-1"
                                >
                                    Re: {{ message.listing.tradeWhat }}
                                </div>
                                <div
                                    class="text-zinc-700 dark:text-zinc-300 line-clamp-2"
                                >
                                    {{
                                        message.message.length > 100
                                            ? message.message.substring(
                                                  0,
                                                  100
                                              ) + "..."
                                            : message.message
                                    }}
                                </div>
                            </div>
                            <div
                                class="text-sm text-zinc-500 dark:text-zinc-400"
                            >
                                {{ formatDate(message.created_at) }}
                            </div>
                        </div>
                    </Link>
                </Box>
            </div>
        </div>

        <!-- Sent messages -->
        <div v-if="activeTab === 'sent'">
            <div
                v-if="sentMessages.length === 0"
                class="text-center py-8 text-zinc-500 dark:text-zinc-400"
            >
                You haven't sent any messages yet.
            </div>

            <div v-else class="space-y-4">
                <Box
                    v-for="message in sentMessages"
                    :key="message.id"
                    class="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                    <Link
                        :href="route('messages.show', message.id)"
                        class="block"
                    >
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-semibold mb-1">
                                    To: {{ message.recipient.name }}
                                </div>
                                <div
                                    v-if="message.listing"
                                    class="text-sm text-zinc-500 dark:text-zinc-400 mb-1"
                                >
                                    Re: {{ message.listing.tradeWhat }}
                                </div>
                                <div
                                    class="text-zinc-700 dark:text-zinc-300 line-clamp-2"
                                >
                                    {{
                                        message.message.length > 100
                                            ? message.message.substring(
                                                  0,
                                                  100
                                              ) + "..."
                                            : message.message
                                    }}
                                </div>
                            </div>
                            <div
                                class="text-sm text-zinc-500 dark:text-zinc-400"
                            >
                                {{ formatDate(message.created_at) }}
                            </div>
                        </div>
                    </Link>
                </Box>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { Link } from "@inertiajs/vue3";
import Box from "@/Components/UI/Box.vue";

const props = defineProps({
    receivedMessages: Array,
    sentMessages: Array,
});

const activeTab = ref("received");

// Format date to a more readable format
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // If it's today, just show the time
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // If it's this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    // Otherwise show full date
    return date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
</script>
