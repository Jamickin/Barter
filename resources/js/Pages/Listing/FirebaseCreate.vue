<!-- resources/js/Pages/Listing/FirebaseCreate.vue -->
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
                    placeholder="What are you offering to trade?"
                    @blur="validateTradeWhat"
                    :class="{ 'border-red-500': validationErrors.tradeWhat }"
                />
                <div v-if="validationErrors.tradeWhat" class="input-error">
                    {{ validationErrors.tradeWhat }}
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
                    placeholder="What are you looking for in return?"
                    @blur="validateForWhat"
                    :class="{ 'border-red-500': validationErrors.forWhat }"
                />
                <div v-if="validationErrors.forWhat" class="input-error">
                    {{ validationErrors.forWhat }}
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
            </div>

            <!-- Image Upload -->
            <div class="col-span-6">
                <label
                    class="block mb-1 text-gray-500 dark:text-gray-300 font-medium"
                    >Image (optional)</label
                >
                <input
                    type="file"
                    @change="handleImageUpload"
                    accept="image/*"
                    class="block w-full p-2 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 text-gray-500"
                />
                <div v-if="validationErrors.image" class="input-error">
                    {{ validationErrors.image }}
                </div>

                <!-- Image Preview -->
                <div v-if="imagePreview" class="mt-2">
                    <img
                        :src="imagePreview"
                        alt="Preview"
                        class="h-32 rounded-md"
                    />
                    <button
                        @click.prevent="clearImage"
                        class="text-red-500 text-sm mt-1"
                    >
                        Remove image
                    </button>
                </div>
            </div>
        </div>

        <div class="mt-4">
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting">Creating...</span>
                <span v-else>Create</span>
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { router } from "@inertiajs/vue3";
import { listingAPI, categoryAPI } from "@/services/firebase-api";

const props = defineProps({
    categories: Array,
});

const form = ref({
    tradeWhat: "",
    forWhat: "",
    category_id: "",
    image: null,
});

const validationErrors = ref({
    tradeWhat: null,
    forWhat: null,
    category_id: null,
    image: null,
});

const isSubmitting = ref(false);
const imagePreview = ref(null);
const categories = ref(props.categories || []);

// Load categories from Firebase if not provided as props
onMounted(async () => {
    if (!categories.value || categories.value.length === 0) {
        try {
            categories.value = await categoryAPI.getCategories();
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    }
});

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.match("image.*")) {
        validationErrors.value.image = "Please select an image file";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        validationErrors.value.image = "Image size should not exceed 5MB";
        return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);

    // Store file for upload
    form.value.image = file;
    validationErrors.value.image = null;
};

const clearImage = () => {
    form.value.image = null;
    imagePreview.value = null;
};

const validateTradeWhat = () => {
    validationErrors.value.tradeWhat = null;

    if (!form.value.tradeWhat) {
        validationErrors.value.tradeWhat =
            "Please specify what you are offering";
        return false;
    }

    if (form.value.tradeWhat.length < 3) {
        validationErrors.value.tradeWhat =
            "Description must be at least 3 characters";
        return false;
    }

    return true;
};

const validateForWhat = () => {
    validationErrors.value.forWhat = null;

    if (!form.value.forWhat) {
        validationErrors.value.forWhat =
            "Please specify what you want in return";
        return false;
    }

    if (form.value.forWhat.length < 3) {
        validationErrors.value.forWhat =
            "Description must be at least 3 characters";
        return false;
    }

    return true;
};

const validateCategory = () => {
    validationErrors.value.category_id = null;

    if (!form.value.category_id) {
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

const validateAndSubmit = async () => {
    if (validateForm()) {
        isSubmitting.value = true;

        try {
            // Call Firebase API to create the listing
            const listing = await listingAPI.createListing({
                tradeWhat: form.value.tradeWhat,
                forWhat: form.value.forWhat,
                category_id: form.value.category_id,
                image: form.value.image,
            });

            // Redirect to the listing page
            router.visit(route("listing.index"), {
                data: {
                    message: "Listing created successfully!",
                },
            });
        } catch (error) {
            console.error("Error creating listing:", error);
            alert("Failed to create listing. " + error.message);
        } finally {
            isSubmitting.value = false;
        }
    }
};
</script>

<style scoped>
.input-error {
    @apply text-red-500 text-sm mt-1;
}
</style>
