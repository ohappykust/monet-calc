<template>
  <FinanceDashboard
    :staff-gross-default="staffGrossSum"
    :payroll-tax-rate-default="payrollTaxRate"
    :infra-monthly-default="infraMonthlyDefault"
    :staff="staff"
    :infra="infra"
    :infra-params="infraParams"
  />

  <h1 class="text-xl font-semibold mb-3 mt-5">Штат и инфраструктура</h1>

  <div class="grid gap-4 items-start w-full max-w-full lg:[grid-template-columns:420px_1fr]">
    <div class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm min-w-0">
      <StaffSection
        :staff="staff"
        :payroll-tax-rate="payrollTaxRate"
        @add-role="addRoleFromChild"
        @remove-role="removeRole"
        @reset-staff="resetStaff"
      />

      <h2 class="mt-3 text-lg font-semibold">Параметры инфраструктуры</h2>
      <InfraInputs v-model:params="infraParams" />
    </div>

    <div class="min-w-0">
      <InfraResults :infra="infra" />
      <InfraDetailsTable :infra="infra" />
    </div>
  </div>

  <!-- Floating font size control -->
  <div class="fixed right-3 bottom-3 z-50">
    <div v-if="fontPanelOpen" class="bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-64">
      <div class="flex items-center justify-between mb-2">
        <div class="text-sm font-medium">Размер шрифта</div>
        <button class="text-xs text-gray-500 hover:text-gray-700" @click="fontPanelOpen = false">Свернуть</button>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-2 py-1 border rounded" @click="setFontSize(fontSize - 1)">A-</button>
        <input type="range" min="12" max="22" step="1" v-model.number="fontSize" class="flex-1" />
        <button class="px-2 py-1 border rounded" @click="setFontSize(fontSize + 1)">A+</button>
      </div>
      <div class="mt-2 text-xs text-gray-600">Текущий: {{ fontSize }} px</div>
    </div>
    <button v-else class="bg-white border border-gray-200 shadow rounded-full px-3 py-2 text-sm" @click="fontPanelOpen = true" aria-label="Управление размером шрифта">
      A↕
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import StaffSection from './components/StaffSection.vue'
import InfraInputs from './components/InfraInputs.vue'
import InfraResults from './components/InfraResults.vue'
import InfraDetailsTable from './components/InfraDetailsTable.vue'
import FinanceDashboard from './components/FinanceDashboard.vue'
import { calcInfra } from './utils/calcInfra.js'

// Staff state
const staff = ref([
  { role: 'CTO / Lead dev', salary: 150000 },
  { role: 'Backend dev', salary: 120000 },
  { role: 'Frontend / Mobile', salary: 100000 },
  { role: 'UI/UX (part-time)', salary: 70000 },
  { role: 'Marketing / growth', salary: 70000 },
  { role: 'BD / Community', salary: 70000 },
  { role: 'Support / CS', salary: 50000 },
  { role: 'Юрист (контракт)', salary: 50000 },
])
const payrollTaxRate = ref(0.30)

const staffGrossSum = computed(() => staff.value.reduce((a, b) => a + (Number(b.salary) || 0), 0))
const payrollTaxSum = computed(() => Math.round(staffGrossSum.value * payrollTaxRate.value))

function addRoleFromChild(payload) {
  const name = String(payload?.name || '').trim()
  const sal = parseInt(payload?.salary || '0')
  if (!name || sal <= 0) { alert('Введите роль и зарплату > 0'); return }
  staff.value.push({ role: name, salary: sal })
}
function removeRole(idx) { staff.value.splice(idx, 1) }
function resetStaff() {
  staff.value = [
    { role: 'CTO / Lead dev', salary: 150000 },
    { role: 'Backend dev', salary: 120000 },
    { role: 'Frontend / Mobile', salary: 100000 },
    { role: 'UI/UX (part-time)', salary: 70000 },
    { role: 'Marketing / growth', salary: 70000 },
    { role: 'BD / Community', salary: 70000 },
    { role: 'Support / CS', salary: 50000 },
    { role: 'Юрист (контракт)', salary: 50000 },
  ]
}
// recalcStaff removed — staff-related totals are reactive

// Infra inputs (single object)
const infraParams = ref({
  mau: 10000,
  peakPercent: 2,
  reqsPerUserPerDay: 20,
  avgResponseMs: 150,
  reqsPerCore: 50,
  vcpusPerInstance: 4,
  ramPerInstance: 8,
  costPerInstance: 12000,
  dataPerUserMB: 5,
  storageOverheadPct: 40,
  costPerGB: 10,
  redisUsersPct: 10,
  ramPerRedisUserKB: 50,
  costRedisPerGB: 3000,
})
const infra = ref(null)
// Fully reactive infra recalculation
watch(infraParams, (v) => {
  infra.value = calcInfra(v)
}, { deep: true, immediate: true })

const infraMonthlyDefault = computed(() => (infra.value?.estimatedMonthlyInfra || 0))

// Global font size control
const fontSize = ref(16)
const fontPanelOpen = ref(false)
function setFontSize(px) {
  const clamped = Math.max(12, Math.min(22, Math.round(Number(px) || 16)))
  fontSize.value = clamped
}
onMounted(() => {
  try {
    const saved = Number(localStorage.getItem('fontSizePx') || '')
    if (!Number.isNaN(saved) && saved) setFontSize(saved)
  } catch (e) { /* noop */ }
})
watch(fontSize, (v) => {
  try {
    document.documentElement.style.fontSize = v + 'px'
    localStorage.setItem('fontSizePx', String(v))
  } catch (e) { /* noop */ }
}, { immediate: true })
</script>

<!-- Styled with Tailwind CSS (see src/tailwind.css) -->
