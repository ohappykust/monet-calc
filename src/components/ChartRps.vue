<template>
  <canvas ref="canvas" height="160"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  peakRps: { type: Number, required: true },
  months: { type: Number, default: 36 },
})

const canvas = ref(null)
let chart = null

function buildDataset(peak, months) {
  return Array.from({ length: months }, (_, i) => {
    const m = i + 1
    return Math.round(peak * (m / months) * 0.8 + Math.random() * peak * 0.05)
  })
}

function render() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (chart) chart.destroy()
  const labels = Array.from({ length: props.months }, (_, i) => `M${i + 1}`)
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Оценочный peak RPS',
          data: buildDataset(props.peakRps, props.months),
          tension: 0.3,
        },
      ],
    },
    options: {
      interaction: { mode: 'index', intersect: false },
      scales: { y: { beginAtZero: true } },
    },
  })
}

onMounted(render)
watch(() => props.peakRps, render)
onBeforeUnmount(() => { if (chart) chart.destroy() })
</script>
