<template>
  <div class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
    <h2 class="text-lg font-semibold mb-2">Результаты инфраструктуры</h2>
    <div v-if="infra">
      <div class="text-sm text-gray-900 mb-1"><strong>Рекомендации по серверам:</strong></div>
      <ul class="list-disc pl-5 space-y-1 text-sm text-gray-900">
        <li>Пиковая нагрузка (RPS): <strong>{{ infra.peakRPS }}</strong> req/s (средн. RPS {{ infra.avgRPS }})</li>
        <li>Требуется vCPU: <strong>{{ infra.requiredCores }}</strong></li>
        <li>Инстансы (vCPU по {{ infra.vcpusPerInstance }} vCPU): <strong>{{ infra.instancesNeeded }} шт</strong></li>
        <li>RAM на инстанс: <strong>{{ infra.ramPerInstance }} GB</strong></li>
        <li>Хранилище (с учетом реплик/индексов): <strong>{{ infra.totalStorageGB }} GB</strong></li>
        <li>Redis: <strong>{{ infra.totalRedisGB }} GB</strong></li>
        <li>Оценочная ежемесячная стоимость инфраструктуры: <strong>{{ num(infra.estimatedMonthlyInfra) }} ₽/мес</strong></li>
      </ul>
      <div class="text-xs text-gray-500 mt-2">Примечание: расчёт приблизительный; под высоконагруженные эндпоинты (heavy queries) нужны отдельные расчёты. Рекомендуется нагрузочное тестирование.</div>
    </div>
    <template v-else>
      <p class="text-xs text-gray-500">Введите параметры инфраструктуры — расчёт выполняется автоматически. Здесь появятся рекомендуемая конфигурация серверов, объём хранения, Redis и оценка стоимости.</p>
    </template>
    <h3 class="mt-3 text-sm font-semibold">График нагрузки (requests/sec)</h3>
    <ChartRps v-if="infra" :peak-rps="infra.peakRPS" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import ChartRps from './ChartRps.vue'
import { num } from '../utils/format.js'

defineProps({
  infra: { type: Object, default: null },
})
</script>
