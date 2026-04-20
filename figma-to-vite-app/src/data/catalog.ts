import type { ProductItem } from '../types/product'

const price = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

const toInr = (usd: number) => Math.max(999, Math.round(usd * 83))

const rolexNames = [
  'Oyster Perpetual 41',
  'Submariner Date',
  'GMT-Master II',
  'Day-Date 40',
  'Yacht-Master 42',
  'Explorer II',
  'Datejust 36',
  'Sea-Dweller',
  'Sky-Dweller',
  'Cosmograph Daytona',
  'Deepsea Challenge',
]

const rolexPrices = [
  6150, 10100, 10700, 41700, 14900, 9650, 7450, 13600, 16100, 15800, 26200,
]

const omegaNames = [
  'Speedmaster Moonwatch',
  'Seamaster Diver 300M',
  'Constellation Co-Axial',
  'Aqua Terra 150M',
  'De Ville Prestige',
  'Planet Ocean 600M',
  'Seamaster 300',
  'Speedmaster Racing',
  'Constellation Manhattan',
  'Seamaster Bullhead',
  'De Ville Tourbillon',
]

const omegaPrices = [
  7200, 5600, 6800, 5900, 4100, 7200, 8900, 5400, 7700, 9200, 168000,
]

const hublotNames = [
  'Big Bang Unico',
  'Classic Fusion Titanium',
  'Spirit of Big Bang',
  'Square Bang Unico',
  'King Power Unico',
]

const hublotPrices = [19800, 8900, 22400, 17600, 28500]

function mapWithIds(
  prefix: string,
  images: string[],
  names: string[],
  usdPrices: number[],
): ProductItem[] {
  return images.map((image, i) => {
    const usd = usdPrices[i] ?? 10000
    return {
      id: `${prefix}-${i}`,
      image,
      brand:
        prefix === 'rolex' ? 'Rolex' : prefix === 'omega' ? 'Omega' : 'Hublot',
      name: names[i] ?? `Collection ${i + 1}`,
      price: price(usd),
      priceInr: toInr(usd),
    }
  })
}

export function buildCatalog(
  rolex: string[],
  omega: string[],
  hublot: string[],
): { rolex: ProductItem[]; omega: ProductItem[]; hublot: ProductItem[] } {
  return {
    rolex: mapWithIds('rolex', rolex, rolexNames, rolexPrices),
    omega: mapWithIds('omega', omega, omegaNames, omegaPrices),
    hublot: mapWithIds('hublot', hublot, hublotNames, hublotPrices),
  }
}
