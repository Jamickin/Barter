<template>
    <form @submit.prevent="update">
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
                />
                <div v-if="form.errors.tradeWhat" class="input-error">
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
                />
                <div v-if="form.errors.forWhat" class="input-error">
                    {{ form.errors.forWhat }}
                </div>
            </div>
        </div>

        <div class="col-span-6">
            <button type="submit" class="btn-primary">Update</button>
        </div>
    </form>
</template>

<script setup>
import { useForm } from "@inertiajs/vue3";

const props = defineProps({
    listing: Object,
});

const form = useForm({
    tradeWhat: props.listing.tradeWhat,
    forWhat: props.listing.forWhat,
});

const update = () =>
    form.put(route("listing.update", { listing: props.listing.id }));
</script>

<style scoped>
label {
    margin-right: 2em;
}
div {
    padding: 2px;
}
</style>
