<template>
    <div
        class="border border-zinc-200 dark:border-zinc-800 rounded-md p-4 shadow-sm dark:text-zinc-300"
    >
        <div class="text-zinc-500 font-medium mb-1">
            <slot name="header" />
        </div>
        <slot />
    </div>
</template>
