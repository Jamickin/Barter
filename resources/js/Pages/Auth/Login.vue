<template>
    <form @submit.prevent="validateAndSubmit">
        <div class="w-1/2 mx-auto">
            <div>
                <label for="email" class="label">E-Mail (username)</label>
                <input
                    type="text"
                    id="email"
                    class="input"
                    v-model="form.email"
                    @blur="validateEmail"
                    :class="{ 'border-red-500': validationErrors.email }"
                />
                <div class="input-error" v-if="validationErrors.email">
                    {{ validationErrors.email }}
                </div>
                <div class="input-error" v-else-if="form.errors.email">
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
                    @blur="validatePassword"
                    :class="{ 'border-red-500': validationErrors.password }"
                />
                <div class="input-error" v-if="validationErrors.password">
                    {{ validationErrors.password }}
                </div>
                <div class="input-error" v-else-if="form.errors.password">
                    {{ form.errors.password }}
                </div>
            </div>
            <div class="mt-4 flex gap-4">
                <button
                    class="btn-primary w-full"
                    type="submit"
                    :disabled="isSubmitting"
                >
                    <span v-if="isSubmitting">Logging in...</span>
                    <span v-else>Login</span>
                </button>
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
import { ref } from "vue";

const form = useForm({
    email: null,
    password: null,
});

const validationErrors = ref({
    email: null,
    password: null,
});

const isSubmitting = ref(false);

const validateEmail = () => {
    validationErrors.value.email = null;

    if (!form.email) {
        validationErrors.value.email = "Email is required";
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
        validationErrors.value.email = "Please enter a valid email address";
        return false;
    }

    return true;
};

const validatePassword = () => {
    validationErrors.value.password = null;

    if (!form.password) {
        validationErrors.value.password = "Password is required";
        return false;
    }

    return true;
};

const validateForm = () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    return isEmailValid && isPasswordValid;
};

const validateAndSubmit = () => {
    if (validateForm()) {
        isSubmitting.value = true;
        form.post(route("login.store"), {
            onFinish: () => {
                isSubmitting.value = false;
            },
        });
    }
};
</script>
