<template>
    <form @submit.prevent="register">
        <div class="w-1/2 mx-auto">
            <div class="mt-4">
                <label for="email" class="label">E-Mail (username)</label>
                <input
                    type="text"
                    id="email"
                    class="input"
                    v-model="form.email"
                />
                <div class="input-error" v-if="form.errors.email">
                    {{ form.errors.email }}
                </div>
            </div>
            <div class="mt-4">
                <label for="name" class="label">Your Name</label>
                <input
                    type="text"
                    id="name"
                    class="input"
                    v-model="form.name"
                />
                <div class="input-error" v-if="form.errors.name">
                    {{ form.errors.name }}
                </div>
            </div>
            <div class="mt-4">
                <label for="password" class="label">Password</label>
                <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="input"
                />
                <div class="input-error" v-if="form.errors.password">
                    {{ form.errors.password }}
                </div>
            </div>
            <div class="mt-4">
                <label for="password_confirmation" class="label"
                    >Confirm Password</label
                >
                <input
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    class="input"
                />
                <div
                    class="input-error"
                    v-if="form.errors.password_confirmation"
                >
                    {{ form.errors.password_confirmation }}
                </div>
            </div>
            <div class="mt-4 flex flex-col gap-4">
                <button class="btn-primary w-full" type="submit">
                    Confirm Details
                </button>
                <div class="px-4 text-center text-slate-600">
                    Already got an account? Click<Link
                        class="text-indigo-500 underline"
                        :href="route('login')"
                    >
                        Here</Link
                    >
                    to go to the login page
                </div>
            </div>
        </div>
    </form>
</template>

<script setup>
import { Link, useForm } from "@inertiajs/vue3";

const form = useForm({
    email: "",
    password: "",
    name: "",
    password_confirmation: "",
});

const register = () => form.post(route("user-account.store"));
</script>
