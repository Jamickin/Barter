<template>
    <form @submit.prevent="validateAndSubmit">
        <div class="grid grid-cols-6 gap-4">
            <div class="col-span-6">
                <label
                    class="block mb-1 text-gray-500 dark:text-gray-300 font-medium"
                    >Item</label
                >
                <input
                    v-model="form.tradeWhat"
                    type="text"
                    class="block w-full p-2 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 text-gray-500"
                    @blur="validateTradeWhat"
                    :class="{ 'border-red-500': validationErrors.tradeWhat }"
                />
                <div v-if="validationErrors.tradeWhat" class="input-error">
                    {{ validationErrors.tradeWhat }}
                </div>
                <div v-else-if="form.errors.tradeWhat" class="input-error">
                    {{ form.errors.tradeWhat }}
                </div>
            </div>

            <div class="col-span-6">
                <label
                    class="block mb-1 text-gray-500 dark:text-gray-300 font-medium"
                    >What do you want?</label
                >
                <input
                    v-model="form.forWhat"
                    type="text"
                    class="block w-full p-2 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 text-gray-500"
                    @blur="validateForWhat"
                    :class="{ 'border-red-500': validationErrors.forWhat }"
                />
                <div v-if="validationErrors.forWhat" class="input-error">
                    {{ validationErrors.forWhat }}
                </div>
                <div v-else-if="form.errors.forWhat" class="input-error">
                    {{ form.errors.forWhat }}
                </div>
            </div>

            <!-- Category Selection -->
            <div class="col-span-6">
                <label
                    class="block mb-1 text-gray-500 dark:text-gray-300 font-medium"
                    >Category</label
                >
                <select
                    v-model="form.category_id"
                    class="block w-full p-2 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 text-gray-500"
                    @blur="validateCategory"
                    :class="{ 'border-red-500': validationErrors.category_id }"
                >
                    <option value="" disabled>Select a category</option>
                    <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                    >
                        {{ category.name }}
                    </option>
                </select>
                <div v-if="validationErrors.category_id" class="input-error">
                    {{ validationErrors.category_id }}
                </div>
                <div v-else-if="form.errors.category_id" class="input-error">
                    {{ form.errors.category_id }}
                </div>
            </div>
        </div>

        <div class="mt-4">
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting">Updating...</span>
                <span v-else>Update</span>
            </button>
        </div>
    </form>
</template>

<script setup>
import { useForm } from "@inertiajs/vue3";
import { ref } from "vue";

const props = defineProps({
    listing: Object,
    categories: Array,
});

const form = useForm({
    tradeWhat: props.listing.tradeWhat,
    forWhat: props.listing.forWhat,
    category_id: props.listing.category_id || "",
});

const validationErrors = ref({
    tradeWhat: null,
    forWhat: null,
    category_id: null,
});

const isSubmitting = ref(false);

const validateTradeWhat = () => {
    validationErrors.value.tradeWhat = null;

    if (!form.tradeWhat) {
        validationErrors.value.tradeWhat =
            "Please specify what you are offering";
        return false;
    }

    if (form.tradeWhat.length < 3) {
        validationErrors.value.tradeWhat =
            "Description must be at least 3 characters";
        return false;
    }

    return true;
};

const validateForWhat = () => {
    validationErrors.value.forWhat = null;

    if (!form.forWhat) {
        validationErrors.value.forWhat =
            "Please specify what you want in return";
        return false;
    }

    if (form.forWhat.length < 3) {
        validationErrors.value.forWhat =
            "Description must be at least 3 characters";
        return false;
    }

    return true;
};

const validateCategory = () => {
    validationErrors.value.category_id = null;

    if (!form.category_id) {
        validationErrors.value.category_id = "Please select a category";
        return false;
    }

    return true;
};

const validateForm = () => {
    const isTradeWhatValid = validateTradeWhat();
    const isForWhatValid = validateForWhat();
    const isCategoryValid = validateCategory();

    return isTradeWhatValid && isForWhatValid && isCategoryValid;
};

const validateAndSubmit = () => {
    if (validateForm()) {
        isSubmitting.value = true;
        form.put(route("listing.update", { listing: props.listing.id }), {
            onFinish: () => {
                isSubmitting.value = false;
            },
        });
    }
};
</script>

<style scoped>
label {
    margin-right: 2em;
}
div {
    padding: 2px;
}
</style>
