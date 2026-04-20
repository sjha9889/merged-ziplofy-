export type ProductItem = {
  /** Stable route id e.g. rolex-0, omega-3 */
  id: string
  image: string
  name: string
  price: string
  /** INR for PDP / related cards (Rs / ₹) */
  priceInr: number
  brand: string
}
