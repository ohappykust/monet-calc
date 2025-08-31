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

  <div class="grid gap-4 items-start lg:[grid-template-columns:420px_1fr]">
    <div class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
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

    <div>
      <InfraResults :infra="infra" />
      <InfraDetailsTable :infra="infra" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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
</script>

<!-- Styled with Tailwind CSS (see src/tailwind.css) -->
