import { defineStore } from "pinia";
import { ref } from "vue";

export const useStoplossStore = defineStore("stoploss", () => {
  const data = ref(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchData = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await (window as any).$axios.get("");

      data.value = response.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch data";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchData,
  };
});
