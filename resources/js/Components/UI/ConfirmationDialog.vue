<template>
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop/overlay -->
        <div class="fixed inset-0 bg-black opacity-50" @click="cancel"></div>

        <!-- Dialog content -->
        <div class="flex items-center justify-center min-h-screen p-4">
            <div
                class="relative bg-white dark:bg-zinc-800 rounded-lg max-w-md w-full p-6 shadow-xl"
                @click.stop
            >
                <!-- Title -->
                <div
                    class="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-200"
                >
                    {{ title }}
                </div>

                <!-- Message -->
                <div class="mb-6 text-zinc-600 dark:text-zinc-300">
                    {{ message }}
                </div>

                <!-- Action buttons -->
                <div class="flex justify-end gap-3">
                    <button
                        class="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                        @click="cancel"
                    >
                        {{ cancelLabel }}
                    </button>
                    <button
                        class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        @click="confirm"
                    >
                        {{ confirmLabel }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "Confirmation",
    },
    message: {
        type: String,
        default: "Are you sure you want to proceed with this action?",
    },
    confirmLabel: {
        type: String,
        default: "Confirm",
    },
    cancelLabel: {
        type: String,
        default: "Cancel",
    },
});

const emit = defineEmits(["confirm", "cancel"]);

// When mounted, prevent body scrolling
watch(
    () => props.show,
    (newVal) => {
        if (newVal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }
);

const confirm = () => {
    emit("confirm");
};

const cancel = () => {
    emit("cancel");
};
</script>
