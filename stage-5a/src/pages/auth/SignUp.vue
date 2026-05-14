<template>
  <AuthLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-text-base mb-2">Create Account</h2>
        <p class="text-text-secondary text-sm">
          Join AeroPulse Ops and start managing your aviation operations
        </p>
      </div>

      <form @submit.prevent="handleSignUp" class="space-y-4">
        <!-- Full Name Input -->
        <Input
          v-model="fullName"
          label="Full Name"
          placeholder="John Doe"
          required
          :error="fullNameError"
        />

        <!-- Email Input -->
        <Input
          v-model="email"
          type="email"
          label="Email Address"
          placeholder="you@aeropulse.com"
          required
          :error="emailError"
          @blur="validateEmail"
        />

        <!-- Password Input -->
        <div>
          <Input
            v-model="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            required
            :error="passwordError"
            hint="At least 8 characters with uppercase, lowercase, and numbers"
            @input="validatePassword"
          />
        </div>

        <!-- Confirm Password -->
        <Input
          v-model="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          required
          :error="confirmPasswordError"
        />

        <!-- Terms Checkbox -->
        <div class="flex items-start">
          <input
            id="terms"
            type="checkbox"
            v-model="agreeToTerms"
            class="mt-1 rounded border-dark-border focus:ring-brand-primary"
          />
          <label for="terms" class="ml-2 text-sm text-text-secondary">
            I agree to the
            <a href="#" class="text-brand-primary hover:text-brand-secondary">
              Terms of Service
            </a>
            and
            <a href="#" class="text-brand-primary hover:text-brand-secondary">
              Privacy Policy
            </a>
          </label>
        </div>

        <!-- Error message -->
        <div
          v-if="submitError"
          class="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm"
        >
          {{ submitError }}
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          variant="primary"
          class="w-full"
          :is-loading="isLoading"
          :disabled="!agreeToTerms"
        >
          Create Account
        </Button>
      </form>

      <!-- Divider -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-dark-border" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-dark-surface text-text-tertiary">
            Or sign up with
          </span>
        </div>
      </div>

      <!-- OAuth Buttons -->
      <div class="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          @click="handleOAuthSignUp('github')"
          :is-loading="oauthLoading === 'github'"
          :disabled="isLoading"
        >
          GitHub
        </Button>

        <Button
          variant="outline"
          @click="handleOAuthSignUp('google')"
          :is-loading="oauthLoading === 'google'"
          :disabled="isLoading"
        >
          Google
        </Button>
      </div>
    </div>

    <template #footer>
      Already have an account?
      <router-link
        to="/auth/signin"
        class="text-brand-primary hover:text-brand-secondary font-medium transition-colors"
      >
        Sign in instead
      </router-link>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import AuthLayout from "../../shared/components/ui/AuthLayout.vue";
import Input from "../../shared/components/ui/Input.vue";
import Button from "../../shared/components/ui/Button.vue";

const router = useRouter();
const authStore = useAuthStore();

const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const agreeToTerms = ref(false);
const isLoading = ref(false);
const oauthLoading = ref<"github" | "google" | null>(null);
const submitError = ref("");
const fullNameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailError.value = emailRegex.test(email.value)
    ? ""
    : "Invalid email address";
};

const validatePassword = () => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  passwordError.value = passwordRegex.test(password.value)
    ? ""
    : "Password must be at least 8 characters with uppercase, lowercase, and numbers";
};

const handleSignUp = async () => {
  submitError.value = "";
  fullNameError.value = "";
  emailError.value = "";
  passwordError.value = "";
  confirmPasswordError.value = "";

  if (!fullName.value) {
    fullNameError.value = "Full name is required";
    return;
  }
  if (!email.value) {
    emailError.value = "Email is required";
    return;
  }
  if (!password.value) {
    passwordError.value = "Password is required";
    return;
  }
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = "Passwords do not match";
    return;
  }

  validateEmail();
  validatePassword();
  if (emailError.value || passwordError.value) return;

  isLoading.value = true;
  try {
    const result = await authStore.signup(email.value, password.value);
    if (result.success) {
      await router.push("/auth/verify-email");
    } else {
      submitError.value =
        result.error || "Failed to create account. Please try again.";
    }
  } catch (error: any) {
    submitError.value = error.message || "An error occurred";
  } finally {
    isLoading.value = false;
  }
};

const handleOAuthSignUp = async (provider: "github" | "google") => {
  oauthLoading.value = provider;
  try {
    const result = await authStore.loginWithOAuth(provider);
    if (!result.success) {
      submitError.value = result.error || `Failed to sign up with ${provider}`;
    }
  } catch (error: any) {
    submitError.value = error.message || "An error occurred";
  } finally {
    oauthLoading.value = null;
  }
};
</script>
