<template>
  <div class="flex flex-col md:flex-row bg-[#1c1c1e] p-6 rounded-2xl gap-6">
    <!-- Chart -->
    <div class="flex-1">
      <div ref="chartContainer" class="h-[360px] w-full"></div>

      <!-- Range Selector Buttons -->
      <!-- <div class="flex justify-end mt-4 space-x-3">
        <button v-for="period in periods" :key="period" @click="selectPeriod(period)" :class="[
          'px-4 py-1 rounded-xl border text-sm transition',
          selectedPeriod === period
            ? 'bg-[#f96772] text-black'
            : 'border-[#5f5959] text-gray-300 hover:bg-[#2c2c2e]'
        ]">
          {{ period }}
        </button>
      </div> -->
    </div>

    <!-- Stats Panel -->
    <div class="flex flex-col justify-between text-gray-300 w-full md:w-64 space-y-4">
      <div>
        <p class="text-sm">Gain to pain ratio</p>
        <p class="text-white text-2xl font-semibold">1.8</p>
      </div>
      <div>
        <p class="text-sm">Reward to risk ratio</p>
        <p class="text-white text-2xl font-semibold">2.4</p>
      </div>
      <div>
        <p class="text-sm">Leverage used</p>
        <p class="text-white text-xl font-semibold">
          $120,000 <span class="text-gray-400 text-base">(5.64x)</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Highcharts from "highcharts/highstock";

// Types
interface SeriesData {
  name: string;
  data: number[];
}

// Props
const props = defineProps<{
  chartData: SeriesData[];
}>();

const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: Highcharts.Chart | null = null;

const periods = ["1D", "1W", "1M", "ALL"];
const selectedPeriod = ref("1W");

const selectPeriod = (period: string) => {
  selectedPeriod.value = period;
  // placeholder for period switching logic
};

const renderChart = () => {
  if (!chartContainer.value) return;
  if (chartInstance) chartInstance.destroy();

  // Global chart options
  Highcharts.setOptions({
    chart: {
      backgroundColor: "#1c1c1e",
      style: { fontFamily: "Inter, sans-serif" }
    },
    xAxis: {
      labels: { style: { color: "#b0abab", fontSize: "12px" } }
    },
    yAxis: {
      labels: { style: { color: "#b0abab", fontSize: "12px" } }
    },
    tooltip: {
      backgroundColor: "#2c2c2e",
      borderColor: "#444",
      style: { color: "#fff" }
    },
    rangeSelector: {
      enabled: false
    },
    credits: { enabled: false }
  });

  chartInstance = Highcharts.stockChart(chartContainer.value, {
    chart: {
      backgroundColor: "#1c1c1e",
      height: 360
    },
    title: { text: null },
    xAxis: {
      tickLength: 0,
      lineWidth: 0,
      crosshair: {
        width: 1,
        color: "#616161"
      }
    },
    yAxis: {
      gridLineWidth: 0
    },
    tooltip: {
      shape: "rect",
      borderWidth: 0,
      shared: true,
      valueDecimals: 5
    },
    series: props.chartData.map((series) => ({
      type: "area",
      name: series.name,
      data: series.data.map((y, i) => ({
        y,
        // marker: {
        //   fillColor: "#587aff"
        // }
      })),
      color: "#587aff",
      lineWidth: 2,
      fillColor: {
        linearGradient: [0, 0, 0, 300],
        stops: [
          [0, "rgba(88,122,255,0.25)"],
          [1, "rgba(28,28,30,0)"]
        ]
      },
      marker: {
        enabled: false,
        radius: 5,
        lineWidth: 0
      },
      states: {
        hover: {
          enabled: true,
          lineWidth: 2
        }
      }
    })),
    scrollbar: { enabled: false },
    navigator: { enabled: false },
    rangeSelector: { enabled: false },
    credits: { enabled: false },
    legend: { enabled: false }
  });
};

onMounted(renderChart);
watch(() => props.chartData, renderChart, { deep: true });
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>
