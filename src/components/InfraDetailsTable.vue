<template>
  <div class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm mt-3">
    <h2 class="text-lg font-semibold mb-2">Детальные числовые результаты</h2>
    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b border-gray-200">
          <th class="text-xs font-semibold text-gray-600 uppercase tracking-wide text-left p-2">Показатель</th>
          <th class="text-xs font-semibold text-gray-600 uppercase tracking-wide text-left p-2">Значение</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!infra">
          <td colspan="2" class="text-xs text-gray-500 p-2">Нет данных. Рассчитайте инфраструктуру.</td>
        </tr>
        <tr v-for="(v, k) in detailMap" :key="k" class="border-b border-gray-100">
          <td class="p-2 text-sm text-gray-900">{{ k }}</td>
          <td class="p-2 text-sm text-gray-900">{{ display(v) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  </template>

<script setup>
import { computed } from 'vue'
import { display } from '../utils/format.js'

const props = defineProps({
  infra: { type: Object, default: null },
})

const detailMap = computed(() => {
  if (!props.infra) return {}
  const r = props.infra
  return {
    'MAU (пользователей/мес)': r.mau,
    'Пиковое одновременное (примерно)': r.peakConcurrent,
    'Сумма запросов в сутки': r.totalDailyReqs,
    'Средний RPS': r.avgRPS,
    'Пиковый RPS (оценка)': r.peakRPS,
    'Требуемое кол-во vCPU': r.requiredCores,
    'Инстансы (число)': r.instancesNeeded,
    'vCPU на инстанс': r.vcpusPerInstance,
    'RAM на инстанс (GB)': r.ramPerInstance,
    'Хранилище (GB)': r.totalStorageGB,
    'Стоимость диска (₽/мес)': r.storageCost,
    'Redis (GB)': r.totalRedisGB,
    'Стоимость Redis (₽/мес)': r.redisCost,
    'Месячный трафик (GB)': r.monthlyBandwidthGB,
    'Стоимость инстансов (₽/мес)': r.infraCostInstances,
    'Оценочная инфраструктура итого (₽/мес)': r.estimatedMonthlyInfra,
  }
})
</script>
