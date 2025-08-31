// Financial projections calculator for 36 months
// Input expects normalized fractions for rates (e.g., 0.1 for 10%)
// and absolute ruble values for costs.

export function calcFinance(input = {}) {
  const months = Number(input.months ?? 36)

  const initialCash = Number(input.initialCash ?? 0)
  const commissionRate = Number(input.commissionRate ?? 0.1) // 0..1
  const taxRate = Number(input.taxRate ?? 0.06) // 0..1
  const payrollTaxRate = Number(input.payrollTaxRate ?? 0.3) // 0..1
  const monthsHeavy = Number(input.monthsHeavy ?? 3)

  const staffGross = Number(input.staffGross ?? 0)
  const infraMonthly = Number(input.infraMonthly ?? 0)
  const toolsMonthly = Number(input.toolsMonthly ?? 0)

  const marketingHeavy = Number(input.marketingHeavy ?? 150000)
  const marketingSteady = Number(input.marketingSteady ?? 50000)

  let brandsCount = Number(input.brandsStart ?? 10)
  const brandsGrowth = Number(input.brandsGrowth ?? 0.08) // 0..1 per month
  const avgBrandPrice = Number(input.avgBrandPrice ?? 7000)

  let bloggersCount = Number(input.bloggersStart ?? 50)
  const bloggersGrowth = Number(input.bloggersGrowth ?? 0.06)
  const bloggerPrice = Number(input.bloggerPrice ?? 499)

  let dealsCount = Number(input.dealsStart ?? 20)
  const dealsGrowth = Number(input.dealsGrowth ?? 0.1)
  const avgDeal = Number(input.avgDeal ?? 10000)

  let featuredStart = Number(input.featuredStart ?? 20000)
  const featuredGrowth = Number(input.featuredGrowth ?? 0.05)

  const data = []
  let cash = initialCash

  for (let m = 1; m <= months; m++) {
    const brand_subs = Math.round(brandsCount * avgBrandPrice)
    const blogger_subs = Math.round(bloggersCount * bloggerPrice)
    const commission_rev = Math.round(dealsCount * avgDeal * commissionRate)
    const featured_rev = Math.round(featuredStart)

    const revenue = brand_subs + blogger_subs + commission_rev + featured_rev
    const tax = Math.round(revenue * taxRate)
    const payroll_gross = staffGross
    const payroll_tax = Math.round(payroll_gross * payrollTaxRate)
    const marketing = (m <= monthsHeavy) ? marketingHeavy : marketingSteady
    const opex = payroll_gross + payroll_tax + marketing + infraMonthly + toolsMonthly
    const net = revenue - opex - tax
    cash += net

    data.push({
      month: m,
      brands: Math.round(brandsCount),
      bloggers: Math.round(bloggersCount),
      deals: Math.round(dealsCount),
      revenue, opex, tax, net, cash
    })

    // grow for next month
    brandsCount = brandsCount * (1 + brandsGrowth)
    bloggersCount = bloggersCount * (1 + bloggersGrowth)
    dealsCount = dealsCount * (1 + dealsGrowth)
    featuredStart = featuredStart * (1 + featuredGrowth)
  }

  const last = data[data.length - 1]
  return { data, last }
}
