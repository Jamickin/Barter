<template>
    <form @submit.prevent="login">
        <div class="w-1/2 mx-auto">
            <div>
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
            <div class="mt-4 flex gap-4">
                <button class="btn-primary w-full" type="submit">Login</button>
                <Link
                    :href="route('user-account.create')"
                    class="btn-primary w-full"
                    as="button"
                >
                    Register
                </Link>
            </div>
        </div>
    </form>
</template>

<script setup>
import { Link, useForm } from "@inertiajs/vue3";
const form = useForm({
    email: null,
    password: null,
});
const login = () => form.post(route("login.store"));
</script>
