import axios from "axios";
import type { App } from "vue";

interface AxiosOptions {
  token?: string;
}

export default {
  install: (app: App, options?: AxiosOptions) => {
    const baseURL = `${import.meta.env.VITE_API_ENDPOINT}?uid=${
      import.meta.env.VITE_API_UID
    }&session_id=${import.meta.env.VITE_API_SESSION_ID}`;

    console.log("API baseURL:", baseURL); // проверка, как ты хотел

    const instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        // Authorization: options?.token ? `Bearer ${options.token}` : "",
      },
    });

    // Добавляем axios instance в глобальные свойства приложения
    app.config.globalProperties.$axios = instance;

    // И на window для использования вне компонентов (например, в сторе)
    (window as any).$axios = instance;
  },
};
