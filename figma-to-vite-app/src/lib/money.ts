/** Main PDP price — matches mockup "Rs.3,999.00" */
export function formatRs(amount: number) {
  return `Rs.${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** Related cards — matches mockup "₹2300.00" */
export function formatInrSymbol(amount: number) {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
