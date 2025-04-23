<template>
    <Box>
        <div>
            <div class="flex items-center gap-1">
                <span>
                    <Link
                        :href="route('profile.show', { id: listing.owner.id })"
                    >
                        {{ listing.owner.name }}
                    </Link>
                </span>
            </div>
            <Link :href="route('listing.show', { listing: listing.id })">
                <Box class="text-center px-auto">
                    wants a <span> {{ listing.tradeWhat }}</span>
                    for a
                    <span>{{ listing.forWhat }}</span>
                </Box>
            </Link>
        </div>
    </Box>
</template>

<script setup>
import { Link } from "@inertiajs/vue3";
import Box from "@/Components/UI/Box.vue";

const props = defineProps({
    listing: Object,
});
</script>
