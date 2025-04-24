<template>
    <!-- Search and filter form -->
    <div class="mb-8 w-full">
        <form @submit.prevent="search">
            <div class="flex flex-col md:flex-row gap-4">
                <!-- Search input -->
                <div class="flex-grow">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search for items to trade..."
                        class="input w-full"
                    />
                </div>

                <!-- Category filter -->
                <div class="w-full md:w-1/3">
                    <select
                        v-model="selectedCategory"
                        class="input w-full"
                        @change="filterByCategory"
                    >
                        <option value="">All Categories</option>
                        <option
                            v-for="category in categories"
                            :key="category.id"
                            :value="category.id"
                        >
                            {{ category.name }}
                        </option>
                    </select>
                </div>

                <!-- Search buttons -->
                <div class="flex gap-2">
                    <button
                        type="submit"
                        class="btn-primary px-4 py-2 whitespace-nowrap"
                    >
                        Search
                    </button>
                    <button
                        v-if="filters.search || filters.category"
                        @click="resetFilters"
                        type="button"
                        class="btn-normal px-4 py-2 whitespace-nowrap"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </form>
    </div>

    <!-- Show filter information -->
    <div
        v-if="filters.search || filters.category"
        class="mb-4 text-zinc-600 dark:text-zinc-400"
    >
        <span v-if="filters.search">
            Search results for:
            <span class="font-bold">{{ filters.search }}</span>
        </span>
        <span v-if="filters.search && filters.category"> | </span>
        <span v-if="filters.category">
            Category:
            <span class="font-bold">{{
                getCategoryName(filters.category)
            }}</span>
        </span>
        <span v-if="listings.data.length === 0"> - No results found</span>
        <span v-else> - {{ listings.total }} results found</span>
    </div>

    <!-- Listings grid -->
    <div
        v-if="listings.data.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
        <Listing
            v-for="listing in listings.data"
            :key="listing.id"
            :listing="listing"
        />
    </div>
    <div v-else class="text-center py-10 text-zinc-500 dark:text-zinc-400">
        No listings found. Try a different search or create a new listing.
    </div>

    <!-- Pagination -->
    <div
        v-if="listings.data.length"
        class="w-full flex justify-center mt-4 mb-4"
    >
        <Pagination :links="listings.links"></Pagination>
    </div>
</template>

<script setup>
import Listing from "./Index/Components/Listing.vue";
import Pagination from "@/Components/UI/Pagination.vue";
import { ref, computed } from "vue";
import { router } from "@inertiajs/vue3";

const props = defineProps({
    listings: Object,
    filters: Object,
    categories: Array,
});

// Initialize search query and category with existing values from filters
const searchQuery = ref(props.filters.search || "");
const selectedCategory = ref(props.filters.category || "");

// Search function that preserves category filter
const search = () => {
    const params = {};

    if (searchQuery.value) {
        params.search = searchQuery.value;
    }

    if (selectedCategory.value) {
        params.category = selectedCategory.value;
    }

    router.get(route("listing.index"), params, { preserveState: true });
};

// Filter by category (preserves search term)
const filterByCategory = () => {
    const params = {};

    if (searchQuery.value) {
        params.search = searchQuery.value;
    }

    if (selectedCategory.value) {
        params.category = selectedCategory.value;
    }

    router.get(route("listing.index"), params, { preserveState: true });
};

// Reset all filters
const resetFilters = () => {
    searchQuery.value = "";
    selectedCategory.value = "";
    router.get(route("listing.index"), {}, { preserveState: true });
};

// Get category name from category ID
const getCategoryName = (categoryId) => {
    const category = props.categories.find((cat) => cat.id == categoryId);
    return category ? category.name : "Unknown";
};
</script>
