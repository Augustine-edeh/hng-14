import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";
import App from "./App.vue";
import Dashboard from "./Dashboard.vue";
import { useThemeStore } from "./stores/themeStore";
import { useAuthStore } from "./stores/authStore";

// Import pages
import SignIn from "./pages/auth/SignIn.vue";
import SignUp from "./pages/auth/SignUp.vue";

const app = createApp(App);
const pinia = createPinia();

// Use Pinia
app.use(pinia);

// Initialize theme store and apply theme
const themeStore = useThemeStore();
themeStore.initializeTheme();

// Initialize auth store
const authStore = useAuthStore();
authStore.initialize();

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/auth/signin",
      component: SignIn,
      meta: { requiresGuest: true },
    },
    {
      path: "/auth/signup",
      component: SignUp,
      meta: { requiresGuest: true },
    },
    {
      path: "/dashboard",
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: "/",
      redirect: () => {
        return authStore.isAuthenticated ? "/dashboard" : "/auth/signin";
      },
    },
  ],
});

// Auth guard
router.beforeEach((to, _from, next) => {
  const isAuthenticated = authStore.isAuthenticated;
  const requiresAuth = to.meta.requiresAuth;
  const requiresGuest = to.meta.requiresGuest;

  if (requiresAuth && !isAuthenticated) {
    next("/auth/signin");
  } else if (requiresGuest && isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

app.use(router);
app.mount("#app");
