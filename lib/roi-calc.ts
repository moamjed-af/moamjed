// Dubai Property Investment Calculator
// Covers: Gross Yield, Net Yield, IRR, Cash-on-Cash, Cap Rate,
//         Break-Even Occupancy, Price-to-Rent Ratio, Holding Costs,
//         Service Charges Impact, Operating Expenses breakdown

export type ROIInput = {
  propertyPrice: number
  downPaymentPercent: number
  expectedMonthlyRent: number
  appreciationPercent: number
  vacancyRatePercent?: number     // % of year property sits vacant (default 5%)
  managementFeePercent?: number   // % of rent paid to property manager (0 if self-managed)
  mortgageRate?: number
  mortgageTerm?: number
  includeCommission?: boolean     // 2% agency fee for ready properties
}

export type OperatingExpenses = {
  serviceCharge: number           // AED/year — ~1.2% of property price
  insurance: number               // AED/year — ~0.2% of property price
  maintenance: number             // AED/year — ~0.3% of property price
  managementFee: number           // AED/year — % of rent
  vacancyLoss: number             // AED/year — rental income lost to vacancy
  total: number                   // total annual opex
}

export type ROIResult = {
  // ── Yield metrics ──────────────────────────────────────────
  grossRentalYield: number        // Annual rent / Property price × 100
  netRentalYield: number          // (Annual rent − all opex) / Property price × 100
  capRate: number                 // NOI / Property price × 100 (ignores financing)

  // ── Cash flow metrics ──────────────────────────────────────
  monthlyGrossRent: number
  monthlyNetCashFlow: number      // After mortgage + all costs
  annualCashFlow: number
  cashOnCashReturn: number        // Annual cash flow / Total cash invested × 100

  // ── Investment metrics ─────────────────────────────────────
  irr5Year: number                // Internal Rate of Return over 5 years (%)
  breakEvenOccupancy: number      // % occupancy needed to cover all costs
  priceToRentRatio: number        // Property price / Annual rent (lower = better)
  tenantDemandScore: 'High' | 'Medium' | 'Low'
  tenantDemandReason: string

  // ── Cost breakdown ─────────────────────────────────────────
  operatingExpenses: OperatingExpenses
  monthlyHoldingCosts: number     // Mortgage + all monthly opex
  annualHoldingCosts: number
  serviceChargeAsRentPercent: number  // How much of rent is eaten by service charge

  // ── Total investment ───────────────────────────────────────
  totalInvestment: number         // Down payment + commission (if applicable)
  agencyCommission?: number
  mortgagePayment?: number        // Monthly mortgage P&I
  mortgageDetails?: {
    loanAmount: number            // AED borrowed
    ltvPercent: number            // Loan-to-Value %
    rate: number                  // Annual interest rate %
    termYears: number
    monthlyPayment: number
    totalRepayable: number        // Total paid over full term
    totalInterest: number         // Interest portion of total repayable
    annualInterestCost: number    // First-year interest (approximate)
    equityFromDay1: number        // Down payment = instant equity
  }

  // ── 5-year projections ─────────────────────────────────────
  equityAfter5Years: number
  projectedValueAfter5Years: number
  totalCashFlowAfter5Years: number
  totalReturnAfter5Years: number  // Total return on invested capital (%)
}

// ─── IRR via Newton-Raphson ───────────────────────────────────────────────────
function calcIRR(cashFlows: number[], guess = 0.1): number {
  let rate = guess
  for (let iter = 0; iter < 200; iter++) {
    let npv = 0, dnpv = 0
    for (let t = 0; t < cashFlows.length; t++) {
      const d = Math.pow(1 + rate, t)
      npv += cashFlows[t] / d
      if (t > 0) dnpv -= (t * cashFlows[t]) / (d * (1 + rate))
    }
    if (Math.abs(dnpv) < 1e-10) break
    const next = rate - npv / dnpv
    if (Math.abs(next - rate) < 0.00001) return next
    rate = next
  }
  return rate
}

// ─── Tenant demand heuristic ──────────────────────────────────────────────────
function tenantDemand(
  grossYield: number,
  priceToRent: number,
  propertyPrice: number,
): { score: 'High' | 'Medium' | 'Low'; reason: string } {
  if (grossYield >= 8 && priceToRent <= 15) {
    return { score: 'High', reason: 'Strong yield with low price-to-rent ratio — highly attractive to tenants' }
  }
  if (grossYield >= 6 && priceToRent <= 20) {
    return { score: 'High', reason: 'Above-average yield in a well-priced bracket — good rental demand expected' }
  }
  if (grossYield >= 5 && propertyPrice <= 3_000_000) {
    return { score: 'Medium', reason: 'Solid mid-market property — steady tenant pool, moderate competition' }
  }
  if (grossYield >= 4 && propertyPrice > 3_000_000) {
    return { score: 'Medium', reason: 'Premium segment — smaller tenant pool but high-quality, long-stay tenants' }
  }
  if (priceToRent > 25) {
    return { score: 'Low', reason: 'High price-to-rent ratio — property may be overpriced relative to rental market' }
  }
  return { score: 'Low', reason: 'Yield is below Dubai market average — consider adjusting rent or property selection' }
}

// ─── Main calculation ─────────────────────────────────────────────────────────
export function calculateROI({
  propertyPrice,
  downPaymentPercent,
  expectedMonthlyRent,
  appreciationPercent,
  vacancyRatePercent = 5,
  managementFeePercent = 0,
  mortgageRate = 4.5,
  mortgageTerm = 25,
  includeCommission = false,
}: ROIInput): ROIResult {

  // ── Capital invested ────────────────────────────────────────────────────────
  const downPayment = (propertyPrice * downPaymentPercent) / 100
  const agencyCommission = includeCommission ? propertyPrice * 0.02 : 0
  const totalInvestment = downPayment + agencyCommission
  const loanAmount = propertyPrice - downPayment

  // ── Rent figures ────────────────────────────────────────────────────────────
  const annualGrossRent = expectedMonthlyRent * 12
  const vacancyLoss = annualGrossRent * (vacancyRatePercent / 100)
  const effectiveAnnualRent = annualGrossRent - vacancyLoss

  // ── Operating expenses ──────────────────────────────────────────────────────
  const serviceCharge = propertyPrice * 0.012   // 1.2% — Dubai DLD avg
  const insurance     = propertyPrice * 0.002   // 0.2%
  const maintenance   = propertyPrice * 0.003   // 0.3% reserve
  const managementFee = effectiveAnnualRent * (managementFeePercent / 100)
  const totalOpex     = serviceCharge + insurance + maintenance + managementFee + vacancyLoss

  const operatingExpenses: OperatingExpenses = {
    serviceCharge: Math.round(serviceCharge),
    insurance:     Math.round(insurance),
    maintenance:   Math.round(maintenance),
    managementFee: Math.round(managementFee),
    vacancyLoss:   Math.round(vacancyLoss),
    total:         Math.round(totalOpex),
  }

  // ── NOI (Net Operating Income) — ignores financing ──────────────────────────
  const noi = effectiveAnnualRent - serviceCharge - insurance - maintenance - managementFee

  // ── Mortgage ────────────────────────────────────────────────────────────────
  let mortgagePayment = 0
  let mortgageDetails: ROIResult['mortgageDetails'] = undefined

  if (loanAmount > 0 && mortgageRate > 0) {
    const r = mortgageRate / 100 / 12
    const n = mortgageTerm * 12
    mortgagePayment = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

    const totalRepayable    = mortgagePayment * n
    const totalInterest     = totalRepayable - loanAmount
    // Approximate first-year interest: outstanding balance × annual rate
    const annualInterestCost = loanAmount * (mortgageRate / 100)
    const ltvPercent        = (loanAmount / propertyPrice) * 100

    mortgageDetails = {
      loanAmount:        Math.round(loanAmount),
      ltvPercent:        +ltvPercent.toFixed(1),
      rate:              mortgageRate,
      termYears:         mortgageTerm,
      monthlyPayment:    Math.round(mortgagePayment),
      totalRepayable:    Math.round(totalRepayable),
      totalInterest:     Math.round(totalInterest),
      annualInterestCost:Math.round(annualInterestCost),
      equityFromDay1:    Math.round(downPayment),
    }
  }
  const annualMortgage = mortgagePayment * 12

  // ── Cash flow ───────────────────────────────────────────────────────────────
  const annualCashFlow    = noi - annualMortgage
  const monthlyNetCashFlow = annualCashFlow / 12
  const annualHoldingCosts = annualMortgage + totalOpex
  const monthlyHoldingCosts = annualHoldingCosts / 12

  // ── Yield metrics ───────────────────────────────────────────────────────────
  const grossRentalYield = (annualGrossRent / propertyPrice) * 100
  const netRentalYield   = (noi / propertyPrice) * 100
  const capRate          = (noi / propertyPrice) * 100   // same as net yield (ignores financing by definition)
  const cashOnCashReturn = totalInvestment > 0 ? (annualCashFlow / totalInvestment) * 100 : 0

  // ── Price-to-rent ratio ─────────────────────────────────────────────────────
  const priceToRentRatio = annualGrossRent > 0 ? propertyPrice / annualGrossRent : 0

  // ── Service charge as % of rent ─────────────────────────────────────────────
  const serviceChargeAsRentPercent = annualGrossRent > 0 ? (serviceCharge / annualGrossRent) * 100 : 0

  // ── Break-even occupancy ────────────────────────────────────────────────────
  // The % of year that needs to be occupied to cover mortgage + non-vacancy opex
  const fixedAnnualCosts = annualMortgage + serviceCharge + insurance + maintenance + managementFee
  const breakEvenOccupancy = annualGrossRent > 0
    ? Math.min(100, (fixedAnnualCosts / annualGrossRent) * 100)
    : 100

  // ── Tenant demand ───────────────────────────────────────────────────────────
  const demand = tenantDemand(grossRentalYield, priceToRentRatio, propertyPrice)

  // ── 5-year projections ──────────────────────────────────────────────────────
  const projectedValueAfter5Years = propertyPrice * Math.pow(1 + appreciationPercent / 100, 5)
  const remainingLoan = loanAmount > 0 ? loanAmount * (1 - 5 / mortgageTerm) : 0
  const equityAfter5Years = projectedValueAfter5Years - remainingLoan
  const totalCashFlowAfter5Years = annualCashFlow * 5
  const capitalGain = projectedValueAfter5Years - propertyPrice
  const totalReturnAfter5Years = totalInvestment > 0
    ? ((totalCashFlowAfter5Years + capitalGain) / totalInvestment) * 100
    : 0

  // ── IRR (5-year) ────────────────────────────────────────────────────────────
  // CF0 = -totalInvestment; CF1-4 = annual cash flow; CF5 = cash flow + sale proceeds
  const exitProceeds = projectedValueAfter5Years - remainingLoan - (includeCommission ? projectedValueAfter5Years * 0.02 : 0)
  const irrCashFlows = [
    -totalInvestment,
    annualCashFlow,
    annualCashFlow,
    annualCashFlow,
    annualCashFlow,
    annualCashFlow + exitProceeds,
  ]
  const irr5Year = calcIRR(irrCashFlows) * 100

  return {
    grossRentalYield:           +grossRentalYield.toFixed(2),
    netRentalYield:             +netRentalYield.toFixed(2),
    capRate:                    +capRate.toFixed(2),
    monthlyGrossRent:           Math.round(expectedMonthlyRent),
    monthlyNetCashFlow:         Math.round(monthlyNetCashFlow),
    annualCashFlow:             Math.round(annualCashFlow),
    cashOnCashReturn:           +cashOnCashReturn.toFixed(2),
    irr5Year:                   +irr5Year.toFixed(2),
    breakEvenOccupancy:         +breakEvenOccupancy.toFixed(1),
    priceToRentRatio:           +priceToRentRatio.toFixed(1),
    tenantDemandScore:          demand.score,
    tenantDemandReason:         demand.reason,
    operatingExpenses,
    monthlyHoldingCosts:        Math.round(monthlyHoldingCosts),
    annualHoldingCosts:         Math.round(annualHoldingCosts),
    serviceChargeAsRentPercent: +serviceChargeAsRentPercent.toFixed(1),
    totalInvestment:            Math.round(totalInvestment),
    agencyCommission:           agencyCommission > 0 ? Math.round(agencyCommission) : undefined,
    mortgagePayment:            mortgagePayment > 0 ? Math.round(mortgagePayment) : undefined,
    mortgageDetails,
    equityAfter5Years:          Math.round(equityAfter5Years),
    projectedValueAfter5Years:  Math.round(projectedValueAfter5Years),
    totalCashFlowAfter5Years:   Math.round(totalCashFlowAfter5Years),
    totalReturnAfter5Years:     +totalReturnAfter5Years.toFixed(2),
  }
}
