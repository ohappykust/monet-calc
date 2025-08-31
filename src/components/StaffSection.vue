<template>
  <h2 class="text-lg font-semibold">Штат — редактируемая таблица</h2>
  <div>
    <div class="flex gap-2 items-center mb-2">
      <input class="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" v-model.trim="roleName" type="text" placeholder="Роль (например, Backend dev)" />
      <input class="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm" v-model.number="roleSalary" type="number" placeholder="Зарплата gross, ₽/мес" />
      <button class="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm" @click="onAdd">Добавить</button>
    </div>

    <table class="w-full border-collapse mt-2 text-sm">
      <thead>
        <tr>
          <th class="px-2 py-2 border-b text-left font-medium text-gray-700">Роль</th>
          <th class="px-2 py-2 border-b text-left font-medium text-gray-700">Зарплата (gross) ₽/мес</th>
          <th class="px-2 py-2 border-b"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(s, idx) in staff" :key="idx">
          <td class="px-2 py-2 border-b">{{ s.role }}</td>
          <td class="px-2 py-2 border-b">{{ num(s.salary) }}</td>
          <td class="px-2 py-2 border-b text-right">
            <button class="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-900 hover:bg-gray-200 text-sm" @click="$emit('remove-role', idx)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex gap-2 flex-wrap mt-2">
      <button class="inline-flex items-center px-3 py-2 rounded-md bg-gray-100 text-gray-900 hover:bg-gray-200 text-sm" @click="$emit('reset-staff')">Сбросить пример</button>
    </div>
  </div>

  <h3 class="mt-3 text-base font-semibold">Результаты (штат)</h3>
  <div class="grid sm:grid-cols-3 gap-3 mt-3">
    <div class="bg-slate-50 p-3 rounded-md text-center">
      <div class="text-xs text-gray-600">Фонд зарплат (gross)/мес</div>
      <div class="font-semibold">{{ num(staffGrossSum) }} ₽/мес</div>
    </div>
    <div class="bg-slate-50 p-3 rounded-md text-center">
      <div class="text-xs text-gray-600">Отчисления (% от фонда)</div>
      <div class="font-semibold">{{ Math.round(payrollTaxRate*100) }}%</div>
    </div>
    <div class="bg-slate-50 p-3 rounded-md text-center">
      <div class="text-xs text-gray-600">Отчисления месяц ₽</div>
      <div class="font-semibold">{{ num(payrollTaxSum) }} ₽/мес</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { num } from '../utils/format.js'

const props = defineProps({
  staff: { type: Array, required: true },
  payrollTaxRate: { type: Number, default: 0.3 },
})
const emit = defineEmits(['add-role', 'remove-role', 'reset-staff'])

const roleName = ref('')
const roleSalary = ref(null)

const staffGrossSum = computed(() => props.staff.reduce((a,b)=> a + (Number(b.salary)||0), 0))
const payrollTaxSum = computed(() => Math.round(staffGrossSum.value * props.payrollTaxRate))

function onAdd(){
  const name = roleName.value.trim()
  const sal = parseInt(roleSalary.value || '0')
  if(!name || sal<=0){ alert('Введите роль и зарплату > 0'); return }
  emit('add-role', { name, salary: sal })
  roleName.value = ''
  roleSalary.value = null
}
</script>
