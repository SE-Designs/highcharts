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
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import Highcharts from "highcharts";

interface ScatterPoint {
  x: number;
  y: number;
}

interface SeriesItem {
  name: string;
  data: ScatterPoint[];
}

interface Props {
  chartData: SeriesItem[];
}

const props = defineProps<Props>();

const threshold = ref(1.54);

const tabs = ["PnL, %", "PnL, $"];
const selectedTab = ref("PnL, %");

const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: Highcharts.Chart | null = null;
let isMouseDown = false;

const updateThreshold = (e: MouseEvent) => {
  if (!chartInstance) return;

  const chartX = e.offsetX;
  const xAxis = chartInstance.xAxis[0];
  const xValue = xAxis.toValue(chartX);

  threshold.value = parseFloat(xValue.toFixed(2));
};

const renderChart = () => {
  if (!chartContainer.value) return;
  if (chartInstance) chartInstance.destroy();

  chartInstance = Highcharts.chart(chartContainer.value, {
    chart: {
      backgroundColor: "#1c1c1e",
      type: "scatter",
      height: 400,
      zoomType: 'xy',
      events: {
        click: (e) => {
          const xValue = e.xAxis[0].value;
          threshold.value = parseFloat(xValue.toFixed(2));
        }
      }
    },
    title: { text: null },
    xAxis: {
      title: { text: "MAE %", style: { color: "#ccc" } },
      gridLineWidth: 1,
      gridLineColor: "#333",
      gridLineDashStyle: "Dash",
      labels: { style: { color: "#b0abab", fontSize: "12px" } },
      plotLines: [
        {
          color: "#587aff",
          dashStyle: "Dash",
          width: 2,
          value: threshold.value,
          zIndex: 5,
          label: {
            text: `Stop: ${threshold.value.toFixed(2)}%`,
            align: "left",
            style: { color: "#ccc", fontSize: "11px" }
          }
        }
      ]
    },
    yAxis: {
      title: { text: "PnL $", style: { color: "#ccc" } },
      gridLineWidth: 1,
      gridLineColor: "#333",
      gridLineDashStyle: "Dash",
      labels: { style: { color: "#b0abab", fontSize: "12px" } }
    },
    tooltip: {
      backgroundColor: "#2c2c2e",
      borderColor: "#444",
      style: { color: "#fff" },
      formatter() {
        return `MAE: ${this.x.toFixed(2)}%<br>PnL: ${this.y.toFixed(2)} $`;
      }
    },
    series: props.chartData.map((series, idx) => ({
      type: 'scatter',
      name: series.name,
      data: series.data,
      color: idx === 0 ? "#fff" : "#587aff",
      marker: {
        radius: 5,
        symbol: 'circle',
        fillColor: "#1c1c1e",
        lineWidth: 2,
        lineColor: idx === 0 ? "#fff" : "#587aff"
      }
    })),
    credits: { enabled: false },
    legend: {
      itemStyle: { color: "#ccc" }
    }
  });

  const container = chartInstance.container;
  container.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    updateThreshold(e);
  });
  container.addEventListener("mousemove", (e) => {
    if (isMouseDown) updateThreshold(e);
  });
  window.addEventListener("mouseup", () => {
    isMouseDown = false;
  });
};

onMounted(() => {
  renderChart();
});

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy();
});

watch(
  () => [props.chartData, threshold.value],
  () => {
    renderChart();
  },
  { deep: true }
);
</script>