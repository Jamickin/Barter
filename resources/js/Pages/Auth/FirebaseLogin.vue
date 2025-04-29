<!-- resources/js/Pages/Auth/FirebaseLogin.vue -->
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
                <div class="input-error" v-if="authError">
                    {{ authError }}
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
import { Link, router } from "@inertiajs/vue3";
import { ref } from "vue";
import { authAPI } from "@/services/firebase-api";

const form = ref({
    email: "",
    password: "",
});

const validationErrors = ref({
    email: null,
    password: null,
});

const isSubmitting = ref(false);
const authError = ref(null);

const validateEmail = () => {
    validationErrors.value.email = null;

    if (!form.value.email) {
        validationErrors.value.email = "Email is required";
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.value.email)) {
        validationErrors.value.email = "Please enter a valid email address";
        return false;
    }

    return true;
};

const validatePassword = () => {
    validationErrors.value.password = null;

    if (!form.value.password) {
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

const validateAndSubmit = async () => {
    authError.value = null;

    if (validateForm()) {
        isSubmitting.value = true;

        try {
            // Attempt to log in with Firebase
            await authAPI.login(form.value.email, form.value.password);

            // If successful, redirect to listings page
            router.visit(route("listing.index"), {
                onSuccess: () => {
                    // Show success message if needed
                },
            });
        } catch (error) {
            // Handle authentication errors
            authError.value = getAuthErrorMessage(error);
        } finally {
            isSubmitting.value = false;
        }
    }
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (error) => {
    const errorCode = error.code;

    switch (errorCode) {
        case "auth/invalid-email":
            return "Invalid email format";
        case "auth/user-disabled":
            return "This account has been disabled";
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "Invalid email or password";
        default:
            return "An error occurred during login. Please try again.";
    }
};
</script>
