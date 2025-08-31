<template>
  <label class="block text-xs font-medium text-gray-700 mt-3">MAU — месячно активные пользователи (бренды+блогеры+пользователи)
    <input v-model.number="local.mau" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
  </label>
  <label class="block text-xs font-medium text-gray-700 mt-3">Peak concurrent users (пиковое одновременное) — примерно % от MAU
    <input v-model.number="local.peakPercent" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
    <div class="text-xs text-gray-500 mt-1">процент от MAU (например, 2% = 0.02*MAU)</div>
  </label>
  <label class="block text-xs font-medium text-gray-700 mt-3">Среднее количество запросов на пользователя в день
    <input v-model.number="local.reqsPerUserPerDay" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
    <div class="text-xs text-gray-500 mt-1">например: лента, поиск, отклики, статистика</div>
  </label>
  <label class="block text-xs font-medium text-gray-700 mt-3">Среднее время ответа (ms)
    <input v-model.number="local.avgResponseMs" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
    <div class="text-xs text-gray-500 mt-1">в миллисекундах (включая сетку и DB)</div>
  </label>
  <label class="block text-xs font-medium text-gray-700 mt-3">Requests/sec на один vCPU (настройка; зависит от нагрузки и оптимизации)
    <input v-model.number="local.reqsPerCore" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
    <div class="text-xs text-gray-500 mt-1">по умолчанию 50 req/s на vCPU (можно уменьшить/увеличить)</div>
  </label>
  
  <h3 class="mt-3 text-sm font-semibold text-gray-900">Типичный инстанс (на сервере)</h3>
  <label class="block text-xs font-medium text-gray-700 mt-2">vCPU на инстанс
    <input v-model.number="local.vcpusPerInstance" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
  </label>
  <label class="block text-xs font-medium text-gray-700 mt-2">RAM на инстанс (GB)
    <input v-model.number="local.ramPerInstance" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
  </label>
  <label class="block text-xs font-medium text-gray-700 mt-2">Стоимость инстанса ₽/мес (примерная)
    <input v-model.number="local.costPerInstance" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
  </label>
  
  <h3 class="mt-3 text-sm font-semibold text-gray-900">СУБД и хранение</h3>
  <label class="block text-xs font-medium text-gray-700 mt-2">Средний размер данных на пользователя (MB)
    <input v-model.number="local.dataPerUserMB" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
  </label>
  <label class="block text-xs font-medium text-gray-700 mt-2">Резерв для индексов/репликаций (%)
    <input v-model.number="local.storageOverheadPct" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
  </label>
  <label class="block text-xs font-medium text-gray-700 mt-2">Стоимость диска (SSD) ₽/GB/мес
    <input v-model.number="local.costPerGB" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
  </label>
  
  <h3 class="mt-3 text-sm font-semibold text-gray-900">Кеш / Redis</h3>
  <label class="block text-xs font-medium text-gray-700 mt-2">Процент пользователей, чьи сессии/кеш хранятся в Redis (%)
    <input v-model.number="local.redisUsersPct" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
  </label>
  <label class="block text-xs font-medium text-gray-700 mt-2">Средний RAM на пользователя в Redis (KB)
    <input v-model.number="local.ramPerRedisUserKB" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
  </label>
  <label class="block text-xs font-medium text-gray-700 mt-2">Стоимость Redis (пример ₽/GB/мес)
    <input v-model.number="local.costRedisPerGB" type="number" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
  </label>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  params: { type: Object, required: true },
})
const emit = defineEmits(['update:params'])

const local = ref({ ...props.params })

watch(() => props.params, (nv) => { local.value = { ...nv } }, { deep: true })
watch(local, (nv) => emit('update:params', { ...nv }), { deep: true })
</script>
