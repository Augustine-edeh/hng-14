import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);

// Setup Pinia for state management
app.use(createPinia());

app.mount("#app");
