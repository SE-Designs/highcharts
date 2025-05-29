<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useStoplossStore } from "../store/stoploss";
import { storeToRefs } from "pinia";
import PnLChart from "../components/charts/PnLChart.vue";
import EvChart from "../components/charts/EvChart.vue";
import SliderChart from "../components/charts/SliderChart.vue";

const stoplossStore = useStoplossStore();
const { fetchData } = stoplossStore;
const { data, isLoading, error } = storeToRefs(stoplossStore);

const parsedData = computed(() => {
  if (!data.value) return null;

  try {
    const safeString = data.value.replace(/\bNaN\b/g, 0);
    const final = JSON.parse(safeString);

    console.log("Final data:", final.data);

    return final.data;
  } catch (err) {
    console.error("Failed to parse data:", err);
    return null;
  }
});


const selectedStoploss = ref(data.value?.data.optimal_stop?.optimal_stoploss ?? null);

const chartArray1 = computed(() => {
  if (!parsedData.value) return [];

  const trades = parsedData.value.trades;
  const stop = selectedStoploss.value;

  const realPnL = trades.map(t => t.pnl_usd);

  const simulatedPnL = stop === null
    ? realPnL
    : trades.map(t => {
      if (t.mae_percent > stop) {
        const pnlWithoutFees = t.pnl_usd - t.fees;
        const updatedPnl = Math.abs(pnlWithoutFees) * (stop / t.mae_percent) + t.fees;
        return updatedPnl;
      }
      return t.pnl_usd;
    });

  return [
    { name: "Absolute PnL $", data: realPnL },
    { name: `Simulated PnL $ (Stop ${stop ?? '∞'})`, data: simulatedPnL },
  ];
});


const chartArray2 = computed(() => {
  if (!parsedData.value) return [];

  const trades = [...parsedData.value.trades].sort((a, b) => a.timestamp - b.timestamp);
  const stop = selectedStoploss.value;

  const realPnLCumsum = [];
  const simulatedPnLCumsum = [];

  let realSum = 0;
  let simulatedSum = 0;

  trades.forEach(t => {
    realSum += t.pnl_usd;
    realPnLCumsum.push(realSum);

    let pnl = t.pnl_usd;
    if (stop !== null && t.mae_percent > stop) {
      const pnlWithoutFees = t.pnl_usd - t.fees;
      pnl = Math.abs(pnlWithoutFees) * (stop / t.mae_percent) + t.fees;
    }
    simulatedSum += pnl;
    simulatedPnLCumsum.push(simulatedSum);
  });

  return [
    { name: "Real Cumulative PnL", data: realPnLCumsum },
    { name: `Simulated Cumulative PnL (Stop ${stop ?? '∞'})`, data: simulatedPnLCumsum },
  ];
});

const chartArray3 = computed(() => {
  if (!parsedData.value) return [];

  const evValues = parsedData.value.ev_by_mae;
  const recoveryRates = parsedData.value.recovery_rate_by_mae;

  return [
    { name: "Expected Value", data: evValues },
    { name: "Recovery Rate", data: recoveryRates },
  ];
});


onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div>
    <h1>Stoploss Data</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <!-- {{ chartArray1 }}
      {{ chartArray2 }}
      {{ chartArray3 }} -->

      <SliderChart :chartData="chartArray1" />
      <PnLChart :chartData="chartArray2" />
      <EvChart :chartData="chartArray3" />
    </div>
  </div>
</template>
