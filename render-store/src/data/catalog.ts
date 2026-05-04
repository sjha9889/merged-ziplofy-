import type { SwissWristProduct } from '../types/swisswrist-product';

const toPaisa = (inr: number) => Math.round(inr * 100);

function mapWithIds(prefix: string, images: string[]): SwissWristProduct[] {
  return images.map((image, i) => ({
    id: `${prefix}-${i}`,
    image,
    brand: prefix === 'rolex' ? 'Rolex' : prefix === 'omega' ? 'Omega' : 'Hublot',
    name: `Collection ${i + 1}`,
    priceInPaisa: toPaisa(2300),
  }));
}

export function buildCatalog(rolex: string[], omega: string[], hublot: string[]) {
  return {
    rolex: mapWithIds('rolex', rolex),
    omega: mapWithIds('omega', omega),
    hublot: mapWithIds('hublot', hublot),
  };
}
