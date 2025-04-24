<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Reply to Message</h1>

        <div class="mb-6">
            <Link
                :href="route('messages.show', originalMessage.id)"
                class="text-orange-500 hover:text-orange-700"
            >
                &larr; Back to Message
            </Link>
        </div>

        <!-- Original Message -->
        <Box class="mb-6">
            <div
                class="border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-3"
            >
                <div class="text-sm text-zinc-500 dark:text-zinc-400">
                    <div>
                        <span class="font-medium">From:</span>
                        {{ originalMessage.sender.name }}
                    </div>
                    <div>
                        <span class="font-medium">Date:</span>
                        {{ formatDate(originalMessage.created_at) }}
                    </div>
                    <div v-if="originalMessage.listing">
                        <span class="font-medium">Regarding:</span>
                        {{ originalMessage.listing.tradeWhat }}
                    </div>
                </div>
            </div>

            <div
                class="text-sm whitespace-pre-wrap text-zinc-500 dark:text-zinc-400 line-clamp-3"
            >
                {{ originalMessage.message }}
            </div>
        </Box>

        <!-- Reply Form -->
        <Box>
            <form @submit.prevent="validateAndSubmit">
                <!-- Hidden Fields -->
                <input type="hidden" v-model="form.to_user_id" />
                <input type="hidden" v-model="form.listing_id" />

                <!-- Recipient -->
                <div class="mb-4">
                    <label class="label">Reply To</label>
                    <div class="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                        {{ recipient.name }} ({{ recipient.email }})
                    </div>
                </div>

                <!-- Message Content -->
                <div class="mb-6">
                    <label for="message" class="label">Your Reply</label>
                    <textarea
                        id="message"
                        v-model="form.message"
                        rows="6"
                        class="input"
                        :class="{ 'border-red-500': validationErrors.message }"
                        @blur="validateMessage"
                        placeholder="Write your reply here..."
                        autofocus
                    ></textarea>
                    <div
                        v-if="validationErrors.message"
                        class="input-error mt-1"
                    >
                        {{ validationErrors.message }}
                    </div>
                    <div
                        v-else-if="form.errors.message"
                        class="input-error mt-1"
                    >
                        {{ form.errors.message }}
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="flex justify-end">
                    <button
                        type="submit"
                        class="btn-primary"
                        :disabled="isSubmitting"
                    >
                        <span v-if="isSubmitting">Sending...</span>
                        <span v-else>Send Reply</span>
                    </button>
                </div>
            </form>
        </Box>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Link, useForm } from "@inertiajs/vue3";
import Box from "@/Components/UI/Box.vue";

const props = defineProps({
    originalMessage: Object,
    recipient: Object,
    listing: Object,
});

const form = useForm({
    to_user_id: "",
    listing_id: "",
    message: "",
});

const validationErrors = ref({
    message: null,
});

const isSubmitting = ref(false);

// Set initial values from props
onMounted(() => {
    if (props.recipient) {
        form.to_user_id = props.recipient.id;
    }

    if (props.listing) {
        form.listing_id = props.listing.id;
    }
});

const validateMessage = () => {
    validationErrors.value.message = null;

    if (!form.message) {
        validationErrors.value.message = "Please enter a message";
        return false;
    }

    if (form.message.length < 2) {
        validationErrors.value.message = "Message is too short";
        return false;
    }

    return true;
};

const validateForm = () => {
    let isValid = validateMessage();

    if (!form.to_user_id) {
        isValid = false;
    }

    return isValid;
};

const validateAndSubmit = () => {
    if (validateForm()) {
        isSubmitting.value = true;
        form.post(route("messages.store"), {
            onFinish: () => {
                isSubmitting.value = false;
            },
        });
    }
};

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
