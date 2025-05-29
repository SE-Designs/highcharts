import "virtual:uno.css";

import HighchartsVue from "highcharts-vue";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import axios from "./api/axios";
import "./style.css";

// import router from "./router";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(axios);

// app.use(router);
app.use(HighchartsVue);

createApp(App).mount("#app");
