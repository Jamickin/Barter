<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Compose New Message</h1>

        <div class="mb-6">
            <Link
                :href="route('messages.index')"
                class="text-orange-500 hover:text-orange-700"
            >
                &larr; Back to Messages
            </Link>
        </div>

        <Box>
            <form @submit.prevent="validateAndSubmit">
                <!-- Recipient -->
                <div class="mb-4">
                    <label for="recipient" class="label">Send To</label>
                    <div
                        v-if="recipient"
                        class="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md"
                    >
                        {{ recipient.name }} ({{ recipient.email }})
                        <input type="hidden" v-model="form.to_user_id" />
                    </div>
                    <div v-else class="text-zinc-500 dark:text-zinc-400 italic">
                        Please select a recipient
                    </div>
                </div>

                <!-- Related Listing -->
                <div class="mb-4" v-if="listing">
                    <label class="label">Related Listing</label>
                    <div class="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                        {{ listing.tradeWhat }} for {{ listing.forWhat }}
                        <input type="hidden" v-model="form.listing_id" />
                    </div>
                </div>

                <!-- Message Content -->
                <div class="mb-6">
                    <label for="message" class="label">Message</label>
                    <textarea
                        id="message"
                        v-model="form.message"
                        rows="6"
                        class="input"
                        :class="{ 'border-red-500': validationErrors.message }"
                        @blur="validateMessage"
                        placeholder="Write your message here..."
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
                        <span v-else>Send Message</span>
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
</script>
