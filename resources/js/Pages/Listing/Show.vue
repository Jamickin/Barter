<template>
    <Listing :listing="listing"></Listing>
</template>

<script setup>
import Listing from "./Index/Components/Listing.vue";
import { usePage } from "@inertiajs/vue3";

const { listing } = usePage().props;
</script>
