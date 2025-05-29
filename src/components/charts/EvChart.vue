<template>
  <div class="flex flex-col bg-[#1c1c1e] p-6 rounded-2xl gap-6">
    <!-- Tabs -->
    <div class="flex space-x-3 ml-auto mr-0">
      <button v-for="tab in tabs" :key="tab" @click="selectedTab = tab" :class="[
        'px-4 py-1 rounded border-0 text-sm cursor-pointer transition',
        selectedTab === tab
          ? 'bg-[#587aff] text-white'
          : 'border-[#5f5959] text-black hover:op-80'
      ]">
        {{ tab }}
      </button>
    </div>

    <!-- Chart -->
    <div ref="chartContainer" class="h-[360px] w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
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

// Tabs
const tabs = ["Chart A", "Chart B"];
const selectedTab = ref("Chart A");

const currentChartData = computed(() => {
  return selectedTab.value === "Chart A"
    ? props.chartData[0]
    : props.chartData[1];
});

// Chart container
const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: Highcharts.Chart | null = null;

// Функция отрисовки графика
const renderChart = () => {
  if (!chartContainer.value) return;
  if (!currentChartData.value || !currentChartData.value.data) return;
  if (chartInstance) chartInstance.destroy();

  const dataPoints = currentChartData.value.data;
  if (!dataPoints.length) return;

  const ath = Math.max(...dataPoints);
  const athIndex = dataPoints.indexOf(ath);

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
    rangeSelector: { enabled: false },
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
      gridLineWidth: 1,
      gridLineColor: "#333",
      gridLineDashStyle: "Dash",
      crosshair: { width: 1, color: "#616161" },
      plotLines: [{
        color: "#f96772",
        dashStyle: "Dash",
        width: 3,
        zIndex: 5
      }, {
        color: "#616161",
        dashStyle: "Dash",
        width: 1,
        value: athIndex,
        label: {
          text: `ATH`,
          align: "center",
          y: 5,
          style: {
            color: "#f96772",
            fontSize: "14px",
            fontWeight: "bold",
            rotate: "-90deg",
          }
        },
        zIndex: 5
      }]

    },
    yAxis: {
      gridLineWidth: 1,
      gridLineColor: "#333",
      gridLineDashStyle: "Dash",
      labels: { style: { color: "#b0abab", fontSize: "12px" } }
    },
    tooltip: {
      shape: "rect",
      borderWidth: 0,
      shared: true,
      valueDecimals: 5
    },
    series: [
      {
        type: "area",
        name: "Data",
        data: dataPoints,
        color: "#587aff",
        lineWidth: 2,
        fillColor: {
          linearGradient: [0, 0, 0, 300],
          stops: [
            [0, "rgba(88,122,255,0.25)"],
            [1, "rgba(28,28,30,0)"]
          ]
        },
        marker: { enabled: false },
        states: {
          hover: { enabled: true, lineWidth: 2 }
        }
      },
      {
        type: "scatter",
        name: "ATH",
        data: [{ x: athIndex, y: ath }],
        color: "#f96772",
        marker: {
          symbol: "circle",
          radius: 7,
          fillColor: "#f96772"
        },
        dataLabels: {
          enabled: true,
          format: `{y:.1%}`,
          align: "center",
          verticalAlign: "top",
          style: {
            color: "#f96772",
            fontSize: "14px",
            fontWeight: "bold"
          },
          y: -10
        },
        enableMouseTracking: false
      }
    ],
    scrollbar: { enabled: false },
    navigator: { enabled: false },
    rangeSelector: { enabled: false },
    credits: { enabled: false },
    legend: { enabled: false }
  });
};

// Первичный рендер
onMounted(() => {
  if (props.chartData.length) {
    renderChart();
  }
});


// Watch'еры на данные и вкладку
watch(
  () => props.chartData.length,
  (newLength) => {
    if (newLength) renderChart();
  }
);

watch(selectedTab, renderChart);
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>
