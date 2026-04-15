// Pure client-side ROI calculation — works on static/GitHub Pages hosting

export type ROIInput = {
  propertyPrice: number
  downPaymentPercent: number
  expectedMonthlyRent: number
  appreciationPercent: number
  mortgageRate?: number
  mortgageTerm?: number
}

export type ROIResult = {
  grossRentalYield: number
  netRentalYield: number
  annualROI: number
  monthlyNetCashFlow: number
  annualCashFlow: number
  totalInvestment: number
  equityAfter5Years: number
  totalReturnAfter5Years: number
  mortgagePayment?: number
}

export function calculateROI({
  propertyPrice,
  downPaymentPercent,
  expectedMonthlyRent,
  appreciationPercent,
  mortgageRate = 4.5,
  mortgageTerm = 25,
}: ROIInput): ROIResult {
  const downPayment = (propertyPrice * downPaymentPercent) / 100
  const loanAmount = propertyPrice - downPayment
  const annualRent = expectedMonthlyRent * 12

  // Gross rental yield
  const grossRentalYield = (annualRent / propertyPrice) * 100

  // Dubai cost estimates: service charge + insurance
  const annualCosts = propertyPrice * 0.015
  const netAnnualRent = annualRent - annualCosts
  const netRentalYield = (netAnnualRent / propertyPrice) * 100

  // Mortgage calculation
  let mortgagePayment = 0
  if (loanAmount > 0 && mortgageRate > 0) {
    const monthlyRate = mortgageRate / 100 / 12
    const n = mortgageTerm * 12
    mortgagePayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
      (Math.pow(1 + monthlyRate, n) - 1)
  }

  const monthlyNetCashFlow = expectedMonthlyRent - mortgagePayment - annualCosts / 12
  const annualCashFlow = monthlyNetCashFlow * 12

  const valueAfter5Years = propertyPrice * Math.pow(1 + appreciationPercent / 100, 5)
  const equityAfter5Years = valueAfter5Years - loanAmount * (1 - 5 / mortgageTerm)
  const totalCashFlow5Years = annualCashFlow * 5
  const totalReturnAfter5Years =
    ((totalCashFlow5Years + (valueAfter5Years - propertyPrice)) / downPayment) * 100
  const annualROI =
    ((netAnnualRent + (propertyPrice * appreciationPercent) / 100) / downPayment) * 100

  return {
    grossRentalYield: Number(grossRentalYield.toFixed(2)),
    netRentalYield: Number(netRentalYield.toFixed(2)),
    annualROI: Number(annualROI.toFixed(2)),
    monthlyNetCashFlow: Number(monthlyNetCashFlow.toFixed(0)),
    annualCashFlow: Number(annualCashFlow.toFixed(0)),
    totalInvestment: Number(downPayment.toFixed(0)),
    equityAfter5Years: Number(equityAfter5Years.toFixed(0)),
    totalReturnAfter5Years: Number(totalReturnAfter5Years.toFixed(2)),
    mortgagePayment: mortgagePayment ? Number(mortgagePayment.toFixed(0)) : undefined,
  }
}
