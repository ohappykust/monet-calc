<template>
  <section class="overflow-x-hidden">
    <h2 class="text-lg font-semibold">Финансовый дашборд (36 мес)</h2>
    <p class="text-xs text-gray-600">Сценарии роста и P&L. Поля ФОТ, отчисления и инфра — синхронизированы со штатом и расчётом инфраструктуры (можно переопределить).</p>

    <div ref="gridRef" class="grid gap-4 items-start mt-3 w-full max-w-full" :style="gridStyle">
      <div class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm min-w-0">
        <h3 class="text-base font-semibold mb-2">Параметры (входные)</h3>

        <label class="block text-sm text-gray-700 mb-2">Пресеты сценариев
          <div class="flex gap-2 items-center mt-1">
            <select v-model="selectedPreset" class="flex-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option value="Conservative">Conservative (Консервативный)</option>
              <option value="Realistic">Realistic (Реалистичный)</option>
              <option value="Aggressive">Aggressive (Агрессивный)</option>
            </select>
            <button class="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm" @click="applyPreset">Применить</button>
          </div>
        </label>

        <h4 class="mt-2 mb-1 font-medium">Общие</h4>
        <label class="block text-sm text-gray-700 mb-2">Начальный капитал (₽)
          <input type="number" v-model.number="params.initialCash" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>
        <label class="block text-sm text-gray-700 mb-2">Комиссия платформы (%)
          <input type="number" step="0.01" v-model.number="params.commissionRatePct" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          <div class="text-xs text-gray-600">в процентах от бюджета сделки</div>
        </label>
        <label class="block text-sm text-gray-700 mb-2">Налог УСН (%)
          <input type="number" step="0.01" v-model.number="params.taxRatePct" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>
        <label class="block text-sm text-gray-700 mb-2">Отчисления на зарплаты работодателя (%)
          <input type="number" step="0.01" v-model.number="params.payrollTaxRatePct" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>
        <label class="block text-sm text-gray-700 mb-2">Месяцев интенсивного маркетинга
          <input type="number" v-model.number="params.monthsHeavy" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>

        <h4 class="mt-2 mb-1 font-medium">Штат и расходы</h4>
        <label class="block text-sm text-gray-700 mb-2">Сумма месячного фонда зарплат (gross), ₽
          <input type="number" v-model.number="params.staffGross" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          <div class="text-xs text-gray-600">Подставляется из раздела «Штат»</div>
        </label>
        <label class="block text-sm text-gray-700 mb-2">Инфраструктура (₽/мес)
          <input type="number" v-model.number="params.infraMonthly" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
          <div class="text-xs text-gray-600">Подставляется из раздела «Инфраструктура»</div>
        </label>
        <label class="block text-sm text-gray-700 mb-2">Инструменты (SaaS) — ₽/мес
          <input type="number" v-model.number="params.toolsMonthly" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>

        <h4 class="mt-2 mb-1 font-medium">Маркетинг</h4>
        <label class="block text-sm text-gray-700 mb-2">Маркетинг (тяжёлые месяцы) — ₽/мес
          <input type="number" v-model.number="params.marketingHeavy" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>
        <label class="block text-sm text-gray-700 mb-2">Маркетинг (steady) — ₽/мес
          <input type="number" v-model.number="params.marketingSteady" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>

        <h4 class="mt-2 mb-1 font-medium">Сценарий (рост и старт)</h4>
        <label class="block text-sm text-gray-700 mb-2">Брендов (старт)
          <input type="number" v-model.number="params.brandsStart" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>
        <label class="block text-sm text-gray-700 mb-2">Рост брендов (мес., %)
          <input type="number" step="0.01" v-model.number="params.brandsGrowthPct" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>
        <label class="block text-sm text-gray-700 mb-2">Средняя цена подписки бренда, ₽/мес
          <input type="number" v-model.number="params.avgBrandPrice" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>

        <label class="block text-sm text-gray-700 mb-2">Блогеров (старт)
          <input type="number" v-model.number="params.bloggersStart" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>
        <label class="block text-sm text-gray-700 mb-2">Рост блогеров (мес., %)
          <input type="number" step="0.01" v-model.number="params.bloggersGrowthPct" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>
        <label class="block text-sm text-gray-700 mb-2">Цена подписки блогера, ₽/мес
          <input type="number" v-model.number="params.bloggerPrice" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>

        <label class="block text-sm text-gray-700 mb-2">Сделок в месяц (старт)
          <input type="number" v-model.number="params.dealsStart" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>
        <label class="block text-sm text-gray-700 mb-2">Рост сделок (мес., %)
          <input type="number" step="0.01" v-model.number="params.dealsGrowthPct" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>
        <label class="block text-sm text-gray-700 mb-2">Средний бюджет сделки, ₽
          <input type="number" v-model.number="params.avgDeal" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>

        <label class="block text-sm text-gray-700 mb-2">Featured / promoted (старт, ₽/мес)
          <input type="number" v-model.number="params.featuredStart" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>
        <label class="block text-sm text-gray-700 mb-2">Рост featured (мес., %)
          <input type="number" step="0.01" v-model.number="params.featuredGrowthPct" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </label>

        <div class="mt-3">
          <button class="inline-flex items-center px-3 py-2 rounded-md bg-gray-100 text-gray-900 hover:bg-gray-200 text-sm" @click="downloadXlsx">Экспорт в Excel</button>
        </div>
      </div>

      <div
        v-if="isDesktop"
        class="flex items-stretch select-none cursor-col-resize"
        @mousedown="onDragStart"
        @touchstart.prevent="onDragStartTouch"
        role="separator"
        aria-orientation="vertical"
        :aria-valuenow="leftWidth"
        aria-label="Перетянуть для изменения ширины колонок"
      >
        <div class="w-2 bg-gray-200 hover:bg-gray-300 rounded"></div>
      </div>

      <div class="min-w-0">
        <div class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
          <h3 class="text-base font-semibold mb-2">Графики (36 мес)</h3>
          <canvas ref="chartCanvas" height="120"></canvas>
          <div class="grid sm:grid-cols-3 gap-3 mt-3">
            <div class="bg-slate-50 p-3 rounded-md text-center"><div class="text-xs text-gray-600">Ежемесячная выручка (последний мес)</div><div class="font-semibold text-lg">{{ lastMonth.revenue?.toLocaleString?.() ?? '—' }} ₽</div></div>
            <div class="bg-slate-50 p-3 rounded-md text-center"><div class="text-xs text-gray-600">Операционные расходы (последний мес)</div><div class="font-semibold text-lg">{{ lastMonth.opex?.toLocaleString?.() ?? '—' }} ₽</div></div>
            <div class="bg-slate-50 p-3 rounded-md text-center"><div class="text-xs text-gray-600">Cash на конец (последний мес)</div><div class="font-semibold text-lg">{{ lastMonth.cash?.toLocaleString?.() ?? '—' }} ₽</div></div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 p-4 rounded-lg shadow-sm mt-3">
          <h3 class="text-base font-semibold mb-2">Таблица (первые 12 мес)</h3>
          <div class="overflow-x-auto -mx-4">
            <table class="w-full min-w-[720px] border-collapse mt-2 text-sm">
            <thead>
              <tr>
                <th class="px-2 py-2 border-b text-left font-medium text-gray-700">M</th>
                <th class="px-2 py-2 border-b text-left font-medium text-gray-700">Бренды</th>
                <th class="px-2 py-2 border-b text-left font-medium text-gray-700">Блогеры</th>
                <th class="px-2 py-2 border-b text-left font-medium text-gray-700">Сделки</th>
                <th class="px-2 py-2 border-b text-left font-medium text-gray-700">Выручка</th>
                <th class="px-2 py-2 border-b text-left font-medium text-gray-700">OPEX</th>
                <th class="px-2 py-2 border-b text-left font-medium text-gray-700">Налог (УСН)</th>
                <th class="px-2 py-2 border-b text-left font-medium text-gray-700">Cash</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in first12" :key="row.month">
                <td class="px-2 py-2 border-b">{{ row.month }}</td>
                <td class="px-2 py-2 border-b">{{ row.brands }}</td>
                <td class="px-2 py-2 border-b">{{ row.bloggers }}</td>
                <td class="px-2 py-2 border-b">{{ row.deals }}</td>
                <td class="px-2 py-2 border-b">{{ row.revenue.toLocaleString() }}</td>
                <td class="px-2 py-2 border-b">{{ row.opex.toLocaleString() }}</td>
                <td class="px-2 py-2 border-b">{{ row.tax ? row.tax.toLocaleString() : '-' }}</td>
                <td class="px-2 py-2 border-b">{{ row.cash.toLocaleString() }}</td>
              </tr>
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import Chart from 'chart.js/auto'
import * as XLSX from 'xlsx'
import { calcFinance } from '../utils/calcFinance.js'
import { calcInfra } from '../utils/calcInfra.js'

const props = defineProps({
  staffGrossDefault: { type: Number, default: 0 },
  payrollTaxRateDefault: { type: Number, default: 0.3 }, // 0..1
  infraMonthlyDefault: { type: Number, default: 0 },
  staff: { type: Array, default: () => [] },
  infra: { type: Object, default: null },
  infraParams: { type: Object, default: null },
})

const PRESETS = {
  Conservative: {
    brandsStart: 10, brandsGrowthPct: 5, avgBrandPrice: 4900,
    bloggersStart: 20, bloggersGrowthPct: 3, bloggerPrice: 499,
    dealsStart: 10, dealsGrowthPct: 3, avgDeal: 5000,
    featuredStart: 5000, featuredGrowthPct: 2,
    marketingHeavy: 80000, marketingSteady: 30000,
  },
  Realistic: {
    brandsStart: 10, brandsGrowthPct: 8, avgBrandPrice: 7000,
    bloggersStart: 50, bloggersGrowthPct: 6, bloggerPrice: 499,
    dealsStart: 20, dealsGrowthPct: 10, avgDeal: 10000,
    featuredStart: 20000, featuredGrowthPct: 5,
    marketingHeavy: 150000, marketingSteady: 50000,
  },
  Aggressive: {
    brandsStart: 30, brandsGrowthPct: 12, avgBrandPrice: 10000,
    bloggersStart: 150, bloggersGrowthPct: 10, bloggerPrice: 999,
    dealsStart: 60, dealsGrowthPct: 12, avgDeal: 15000,
    featuredStart: 60000, featuredGrowthPct: 8,
    marketingHeavy: 400000, marketingSteady: 120000,
  },
}

const selectedPreset = ref('Realistic')

const params = ref({
  // Общие
  initialCash: 3000000,
  commissionRatePct: 10,
  taxRatePct: 6,
  payrollTaxRatePct: 30,
  monthsHeavy: 3,
  // Штат и расходы
  staffGross: 680000,
  infraMonthly: 50000,
  toolsMonthly: 30000,
  // Маркетинг
  marketingHeavy: 150000,
  marketingSteady: 50000,
  // Сценарий
  brandsStart: 10, brandsGrowthPct: 8, avgBrandPrice: 7000,
  bloggersStart: 50, bloggersGrowthPct: 6, bloggerPrice: 499,
  dealsStart: 20, dealsGrowthPct: 10, avgDeal: 10000,
  featuredStart: 20000, featuredGrowthPct: 5,
})

function applyPreset() {
  const p = PRESETS[selectedPreset.value]
  if (!p) return
  params.value.brandsStart = p.brandsStart
  params.value.brandsGrowthPct = p.brandsGrowthPct
  params.value.avgBrandPrice = p.avgBrandPrice
  params.value.bloggersStart = p.bloggersStart
  params.value.bloggersGrowthPct = p.bloggersGrowthPct
  params.value.bloggerPrice = p.bloggerPrice
  params.value.dealsStart = p.dealsStart
  params.value.dealsGrowthPct = p.dealsGrowthPct
  params.value.avgDeal = p.avgDeal
  params.value.featuredStart = p.featuredStart
  params.value.featuredGrowthPct = p.featuredGrowthPct
  params.value.marketingHeavy = p.marketingHeavy
  params.value.marketingSteady = p.marketingSteady
}

// Sync with external calculators
watch(() => props.staffGrossDefault, (v) => {
  params.value.staffGross = Math.round(v || 0)
}, { immediate: true })
watch(() => props.payrollTaxRateDefault, (v) => {
  params.value.payrollTaxRatePct = Math.round(((v || 0) * 100) * 100) / 100
}, { immediate: true })
watch(() => props.infraMonthlyDefault, (v) => {
  params.value.infraMonthly = Math.round(v || 0)
}, { immediate: true })

// Resizable split (settings | content)
const gridRef = ref(null)
const isDesktop = ref(false)
const widthKey = 'dashLeftWidth'
const verKey = 'dashLeftWidthVersion'
const splitterVersion = 2
const defaultLeft = 560
const leftWidth = ref(defaultLeft)
const handleWidth = 8
const minLeft = 280
const minRight = 320

const gridStyle = computed(() => {
  if (!isDesktop.value) return { 'grid-template-columns': '1fr' }
  return { 'grid-template-columns': `${leftWidth.value}px ${handleWidth}px 1fr` }
})

function updateIsDesktop() {
  isDesktop.value = window.matchMedia('(min-width: 1024px)').matches
  measureGap()
  if (isDesktop.value) clampLeftWidth()
}

let dragging = false
let startX = 0
let startLeft = 0
let gapPx = 16
function measureGap() {
  try {
    if (gridRef.value) {
      const cs = getComputedStyle(gridRef.value)
      const g = parseFloat(cs.columnGap || cs.gap || '16')
      if (!Number.isNaN(g) && g >= 0) gapPx = g
    }
  } catch {}
}

function onDragStart(e) {
  if (!isDesktop.value) return
  dragging = true
  startX = e.clientX
  startLeft = leftWidth.value
  measureGap()
  document.body.style.cursor = 'col-resize'
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
}

function onDragStartTouch(e) {
  if (!isDesktop.value) return
  const t = e.touches && e.touches[0]
  if (!t) return
  dragging = true
  startX = t.clientX
  startLeft = leftWidth.value
  measureGap()
  document.body.style.cursor = 'col-resize'
  window.addEventListener('touchmove', onDragMoveTouch, { passive: false })
  window.addEventListener('touchend', onDragEndTouch)
}

function onDragMove(e) {
  if (!dragging) return
  applyDelta(e.clientX - startX)
}

function onDragMoveTouch(e) {
  if (!dragging) return
  e.preventDefault()
  const t = e.touches && e.touches[0]
  if (!t) return
  applyDelta(t.clientX - startX)
}

function applyDelta(dx) {
  const total = gridRef.value ? gridRef.value.clientWidth : 0
  // total includes two gaps between three columns
  const maxLeft = total ? Math.max(minLeft, total - minRight - handleWidth - 2 * gapPx) : 900
  const next = Math.min(Math.max(minLeft, startLeft + dx), maxLeft)
  leftWidth.value = Math.round(next)
  try { localStorage.setItem(widthKey, String(leftWidth.value)) } catch {}
}

function clampLeftWidth() {
  if (!gridRef.value) return
  const total = gridRef.value.clientWidth || 0
  if (!total) return
  const maxLeft = Math.max(minLeft, total - minRight - handleWidth - 2 * gapPx)
  if (leftWidth.value > maxLeft) {
    leftWidth.value = Math.round(maxLeft)
  }
}

function onDragEnd() {
  if (!dragging) return
  dragging = false
  document.body.style.cursor = ''
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
}

function onDragEndTouch() {
  if (!dragging) return
  dragging = false
  document.body.style.cursor = ''
  window.removeEventListener('touchmove', onDragMoveTouch)
  window.removeEventListener('touchend', onDragEndTouch)
}

onMounted(() => {
  updateIsDesktop()
  window.addEventListener('resize', updateIsDesktop)
  measureGap()
  try {
    const savedVer = Number(localStorage.getItem(verKey) || '0')
    if (savedVer !== splitterVersion) {
      // apply new default once
      leftWidth.value = defaultLeft
      localStorage.setItem(widthKey, String(leftWidth.value))
      localStorage.setItem(verKey, String(splitterVersion))
    } else {
      const saved = Number(localStorage.getItem(widthKey) || '')
      if (!Number.isNaN(saved) && saved) leftWidth.value = saved
    }
  } catch {}
  clampLeftWidth()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsDesktop)
  onDragEnd(); onDragEndTouch()
})

// Auto-recalculate whenever any parameter changes
watch(params, () => {
  recalc()
}, { deep: true })

// Calculations
const projections = ref({ data: [], last: {} })
const first12 = computed(() => projections.value.data.slice(0, 12))
const lastMonth = computed(() => projections.value.last || {})

function normalize() {
  return {
    months: 36,
    initialCash: Number(params.value.initialCash || 0),
    commissionRate: Number(params.value.commissionRatePct || 0) / 100,
    taxRate: Number(params.value.taxRatePct || 0) / 100,
    payrollTaxRate: Number(params.value.payrollTaxRatePct || 0) / 100,
    monthsHeavy: Number(params.value.monthsHeavy || 0),
    staffGross: Number(params.value.staffGross || 0),
    infraMonthly: Number(params.value.infraMonthly || 0),
    toolsMonthly: Number(params.value.toolsMonthly || 0),
    marketingHeavy: Number(params.value.marketingHeavy || 0),
    marketingSteady: Number(params.value.marketingSteady || 0),
    brandsStart: Number(params.value.brandsStart || 0),
    brandsGrowth: Number(params.value.brandsGrowthPct || 0) / 100,
    avgBrandPrice: Number(params.value.avgBrandPrice || 0),
    bloggersStart: Number(params.value.bloggersStart || 0),
    bloggersGrowth: Number(params.value.bloggersGrowthPct || 0) / 100,
    bloggerPrice: Number(params.value.bloggerPrice || 0),
    dealsStart: Number(params.value.dealsStart || 0),
    dealsGrowth: Number(params.value.dealsGrowthPct || 0) / 100,
    avgDeal: Number(params.value.avgDeal || 0),
    featuredStart: Number(params.value.featuredStart || 0),
    featuredGrowth: Number(params.value.featuredGrowthPct || 0) / 100,
  }
}

function recalc() {
  projections.value = calcFinance(normalize())
  renderChart()
}

// Chart
const chartCanvas = ref(null)
let chart = null
function renderChart() {
  if (!chartCanvas.value) return
  const d = projections.value.data
  const labels = d.map(x => 'M' + x.month)
  const revenue = d.map(x => x.revenue)
  const opex = d.map(x => x.opex)
  const cash = d.map(x => x.cash)

  const ctx = chartCanvas.value.getContext('2d')
  if (chart) chart.destroy()
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Выручка', data: revenue, tension: 0.3, fill: false },
        { label: 'OPEX (расходы)', data: opex, tension: 0.3, fill: false },
        { label: 'Cash', data: cash, tension: 0.3, fill: false, yAxisID: 'y2' },
      ],
    },
    options: {
      interaction: { mode: 'index', intersect: false },
      scales: {
        y: { beginAtZero: true, position: 'left', ticks: { callback: v => Number(v).toLocaleString() } },
        y2: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: v => Number(v).toLocaleString() } },
      },
    },
  })
}

async function downloadXlsx() {
  // Collect data
  const normalized = normalize()
  const finance = projections.value.data.length ? projections.value : calcFinance(normalized)
  const infraOut = props.infra || calcInfra(props.infraParams || {})

  // Try ExcelJS (charts embedding). Fallback to XLSX if not installed.
  try {
    const ExcelJSmod = await import(/* @vite-ignore */ 'exceljs/dist/exceljs.min.js')
    const ExcelJS = ExcelJSmod.default || ExcelJSmod
    const wb = new ExcelJS.Workbook()

    // Assumptions
    const wsAss = wb.addWorksheet('Assumptions')
    wsAss.addRows([
      ['Параметр', 'Значение'],
      ['Начальный капитал (₽)', params.value.initialCash],
      ['Комиссия (%)', params.value.commissionRatePct],
      ['Налог УСН (%)', params.value.taxRatePct],
      ['Отчисления на зарплаты (%)', params.value.payrollTaxRatePct],
      ['Месяцев heavy marketing', params.value.monthsHeavy],
      ['Фонд зарплат (gross), ₽/мес', params.value.staffGross],
      ['Infra, ₽/мес', params.value.infraMonthly],
      ['Tools, ₽/мес', params.value.toolsMonthly],
      ['Маркетинг heavy, ₽/мес', params.value.marketingHeavy],
      ['Маркетинг steady, ₽/мес', params.value.marketingSteady],
    ])

    // Staff
    const wsStaff = wb.addWorksheet('Штат')
    wsStaff.addRow(['Роль', 'Зарплата_gross_₽/мес'])
    ;(props.staff || []).forEach(s => wsStaff.addRow([s.role, s.salary]))

    // Infra params
    const wsIP = wb.addWorksheet('Инфра_параметры')
    wsIP.addRow(['Параметр', 'Значение'])
    Object.entries(props.infraParams || {}).forEach(([k, v]) => wsIP.addRow([k, v]))

    // Infra results
    const wsInfra = wb.addWorksheet('Инфраструктура')
    wsInfra.addRow(['Показатель', 'Значение'])
    Object.entries(infraOut || {}).forEach(([k, v]) => wsInfra.addRow([k, v]))

    // Monthly 36m
    const wsM = wb.addWorksheet('Monthly_36m')
    wsM.addRow(['Месяц','Бренды','Блогеры','Сделки','Выручка','OPEX','Налог(УСН)','Net','Cash'])
    finance.data.forEach(d => wsM.addRow([d.month, d.brands, d.bloggers, d.deals, d.revenue, d.opex, d.tax, d.net, d.cash]))

    // Summary
    const wsS = wb.addWorksheet('Summary')
    wsS.addRows([
      ['Показатель','Значение'],
      ['Выручка (последний месяц)', finance.last?.revenue],
      ['OPEX (последний месяц)', finance.last?.opex],
      ['Cash (последний месяц)', finance.last?.cash],
    ])

    // Charts sheet with images
    const wsC = wb.addWorksheet('Charts')

    // Finance chart image from on-screen chart
    let financePng = null
    if (chart && typeof chart.toBase64Image === 'function') {
      try { financePng = chart.toBase64Image('image/png', 1) } catch {}
    }
    // RPS chart image via offscreen canvas
    let rpsPng = null
    try {
      const off = document.createElement('canvas')
      off.width = 1000; off.height = 300
      const ctx = off.getContext('2d')
      const labels = Array.from({ length: 36 }, (_, i) => 'M' + (i + 1))
      const build = (peak, months) => Array.from({ length: months }, (_, i) => {
        const m = i + 1
        return Math.round(peak * (m / months) * 0.8 + Math.random() * peak * 0.05)
      })
      const tmp = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [{ label: 'Оценочный peak RPS', data: build(infraOut?.peakRPS || 1, 36), tension: 0.3 }] },
        options: { scales: { y: { beginAtZero: true } } },
      })
      rpsPng = off.toDataURL('image/png')
      tmp.destroy()
    } catch {}

    // Add images if available
    let rowOffset = 1
    if (financePng) {
      const base64Finance = financePng.startsWith('data:image') ? financePng.split(',')[1] : financePng
      const id1 = wb.addImage({ base64: base64Finance, extension: 'png' })
      wsC.addImage(id1, { tl: { col: 0, row: rowOffset - 1 }, ext: { width: 960, height: 280 } })
      rowOffset += 24
    }
    if (rpsPng) {
      const base64Rps = rpsPng.startsWith('data:image') ? rpsPng.split(',')[1] : rpsPng
      const id2 = wb.addImage({ base64: base64Rps, extension: 'png' })
      wsC.addImage(id2, { tl: { col: 0, row: rowOffset - 1 }, ext: { width: 960, height: 280 } })
    }

    const buf = await wb.xlsx.writeBuffer()
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'monet_dashboard.xlsx'
    a.click()
    URL.revokeObjectURL(a.href)
    return
  } catch (e) {
    // Fallback: XLSX without images
  }

  // Fallback with XLSX (no charts embedding)
  const wb2 = XLSX.utils.book_new()
  const ass = [
    ['Параметр', 'Значение'],
    ['Начальный капитал (₽)', params.value.initialCash],
    ['Комиссия (%)', params.value.commissionRatePct],
    ['Налог УСН (%)', params.value.taxRatePct],
    ['Отчисления на зарплаты (%)', params.value.payrollTaxRatePct],
    ['Месяцев heavy marketing', params.value.monthsHeavy],
    ['Фонд зарплат (gross), ₽/мес', params.value.staffGross],
    ['Infra, ₽/мес', params.value.infraMonthly],
    ['Tools, ₽/мес', params.value.toolsMonthly],
    ['Marketing heavy, ₽/мес', params.value.marketingHeavy],
    ['Marketing steady, ₽/мес', params.value.marketingSteady],
  ]
  XLSX.utils.book_append_sheet(wb2, XLSX.utils.aoa_to_sheet(ass), 'Assumptions')

  const staffRows = [['Роль','Зарплата_gross_₽/мес'], ...(props.staff || []).map(s => [s.role, s.salary])]
  XLSX.utils.book_append_sheet(wb2, XLSX.utils.aoa_to_sheet(staffRows), 'Штат')

  const ipRows = [['Параметр','Значение'], ...Object.entries(props.infraParams || {}).map(([k, v]) => [k, v])]
  XLSX.utils.book_append_sheet(wb2, XLSX.utils.aoa_to_sheet(ipRows), 'Инфра_параметры')

  const infraRows = [['Показатель','Значение'], ...Object.entries(infraOut || {}).map(([k, v]) => [k, v])]
  XLSX.utils.book_append_sheet(wb2, XLSX.utils.aoa_to_sheet(infraRows), 'Инфраструктура')

  const header = ['Месяц','Бренды','Блогеры','Сделки','Выручка','OPEX','Налог(УСН)','Net','Cash']
  const rows = finance.data.map(d => [d.month, d.brands, d.bloggers, d.deals, d.revenue, d.opex, d.tax, d.net, d.cash])
  rows.unshift(header)
  XLSX.utils.book_append_sheet(wb2, XLSX.utils.aoa_to_sheet(rows), 'Monthly_36m')

  const summary = [['Показатель','Значение'],
    ['Выручка (последний месяц)', finance.last?.revenue],
    ['OPEX (последний месяц)', finance.last?.opex],
    ['Cash (последний месяц)', finance.last?.cash],
  ]
  XLSX.utils.book_append_sheet(wb2, XLSX.utils.aoa_to_sheet(summary), 'Summary')

  XLSX.writeFile(wb2, 'monet_dashboard.xlsx')
}

onMounted(() => {
  applyPreset()
  recalc()
})
</script>

<style scoped>
</style>
