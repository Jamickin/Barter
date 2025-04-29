<!-- resources/js/Pages/UserAccount/FirebaseCreate.vue -->
<template>
    <form @submit.prevent="validateAndSubmit">
        <div class="w-1/2 mx-auto">
            <div class="mt-4">
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
                <label for="name" class="label">Your Name</label>
                <input
                    type="text"
                    id="name"
                    class="input"
                    v-model="form.name"
                    @blur="validateName"
                    :class="{ 'border-red-500': validationErrors.name }"
                />
                <div class="input-error" v-if="validationErrors.name">
                    {{ validationErrors.name }}
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
            <div class="mt-4">
                <label for="password_confirmation" class="label"
                    >Confirm Password</label
                >
                <input
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    class="input"
                    @blur="validatePasswordConfirmation"
                    :class="{
                        'border-red-500':
                            validationErrors.password_confirmation,
                    }"
                />
                <div
                    class="input-error"
                    v-if="validationErrors.password_confirmation"
                >
                    {{ validationErrors.password_confirmation }}
                </div>
            </div>
            <div class="mt-4 flex flex-col gap-4">
                <button
                    class="btn-primary w-full"
                    type="submit"
                    :disabled="isSubmitting"
                >
                    <span v-if="isSubmitting">Registering...</span>
                    <span v-else>Create Account</span>
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
import { Link, router } from "@inertiajs/vue3";
import { ref } from "vue";
import { authAPI } from "@/services/firebase-api";

const form = ref({
    email: "",
    name: "",
    password: "",
    password_confirmation: "",
});

const validationErrors = ref({
    email: null,
    name: null,
    password: null,
    password_confirmation: null,
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

const validateName = () => {
    validationErrors.value.name = null;

    if (!form.value.name) {
        validationErrors.value.name = "Name is required";
        return false;
    }

    if (form.value.name.length < 2) {
        validationErrors.value.name = "Name must be at least 2 characters";
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

    if (form.value.password.length < 8) {
        validationErrors.value.password =
            "Password must be at least 8 characters";
        return false;
    }

    return true;
};

const validatePasswordConfirmation = () => {
    validationErrors.value.password_confirmation = null;

    if (!form.value.password_confirmation) {
        validationErrors.value.password_confirmation =
            "Please confirm your password";
        return false;
    }

    if (form.value.password !== form.value.password_confirmation) {
        validationErrors.value.password_confirmation = "Passwords do not match";
        return false;
    }

    return true;
};

const validateForm = () => {
    const isEmailValid = validateEmail();
    const isNameValid = validateName();
    const isPasswordValid = validatePassword();
    const isPasswordConfirmationValid = validatePasswordConfirmation();

    return (
        isEmailValid &&
        isNameValid &&
        isPasswordValid &&
        isPasswordConfirmationValid
    );
};

const validateAndSubmit = async () => {
    authError.value = null;

    if (validateForm()) {
        isSubmitting.value = true;

        try {
            // Register with Firebase
            await authAPI.register(
                form.value.email,
                form.value.password,
                form.value.name
            );

            // If successful, redirect to listings page
            router.visit(route("listing.index"), {
                onSuccess: () => {
                    // Show success message
                },
            });
        } catch (error) {
            // Handle registration errors
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
        case "auth/email-already-in-use":
            return "This email is already registered";
        case "auth/invalid-email":
            return "Invalid email format";
        case "auth/weak-password":
            return "Password is too weak";
        default:
            return "An error occurred during registration. Please try again.";
    }
};
</script>
