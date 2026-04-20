import { useEffect } from 'react'
import { assets, hublotImages, omegaImages, rolexImages } from '../data/images'
import { buildCatalog } from '../data/catalog'
import { BrandStrip } from '../components/BrandStrip'
import { ExploreSwisswristSection } from '../components/ExploreSwisswristSection'
import { HomeBannerSection } from '../components/HomeBannerSection'
import { HomeDiscoverySection } from '../components/HomeDiscoverySection'
import { InstagramGallerySection } from '../components/InstagramGallerySection'
import { InvestmentFeatureSection } from '../components/InvestmentFeatureSection'
import { InvestmentSection } from '../components/InvestmentSection'
import { NewArrivalsSection } from '../components/NewArrivalsSection'
import { ProductSection } from '../components/ProductSection'
import { SwissWristFooter } from '../components/SwissWristFooter'
import { TestimonialsSection } from '../components/TestimonialsSection'

const catalog = buildCatalog(rolexImages, omegaImages, hublotImages)

/** 8 lifestyle tiles — mixed maisons for Instagram grid */
const instagramGridImages = [
  catalog.hublot[4].image,
  catalog.omega[1].image,
  catalog.hublot[2].image,
  catalog.rolex[8].image,
  catalog.rolex[3].image,
  catalog.omega[4].image,
  catalog.rolex[0].image,
  catalog.hublot[0].image,
]

const exploreSwisswristImages = [
  catalog.hublot[2].image,
  catalog.rolex[10].image,
  catalog.omega[1].image,
  catalog.rolex[7].image,
  catalog.hublot[0].image,
  catalog.omega[5].image,
  catalog.rolex[5].image,
  catalog.hublot[4].image,
]

const newArrivalProducts = [catalog.omega[2], catalog.rolex[0], catalog.omega[10], catalog.omega[7]]

const testimonials = [
  {
    image: catalog.rolex[7].image,
    name: 'Rahul Mehta',
    role: 'Working Professional',
    quote:
      'The Design looks very premium and the finishing is impressive. I’ve received multiple compliments, and honestly it feels much more expensive than what I paid.',
  },
  {
    image: catalog.hublot[4].image,
    name: 'Rahul Mehta',
    role: 'College Student',
    quote:
      'The Design looks very premium and the finishing is impressive. I’ve received multiple compliments, and honestly it feels much more expensive than what I paid.',
  },
  {
    image: catalog.rolex[5].image,
    name: 'Rahul Mehta',
    role: 'Working Professional',
    quote:
      'The Design looks very premium and the finishing is impressive. I’ve received multiple compliments, and honestly it feels much more expensive than what I paid.',
  },
  {
    image: catalog.rolex[10].image,
    name: 'Rahul Mehta',
    role: 'College Student',
    quote:
      'The Design looks very premium and the finishing is impressive. I’ve received multiple compliments, and honestly it feels much more expensive than what I paid.',
  },
  {
    image: catalog.rolex[10].image,
    name: 'Rahul Mehta',
    role: 'College Student',
    quote:
      'The Design looks very premium and the finishing is impressive. I’ve received multiple compliments, and honestly it feels much more expensive than what I paid.',
  },
]

export default function HomePage() {
  useEffect(() => {
    const { hash } = window.location
    if (hash) {
      requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [])

  return (
    <div className="min-h-svh bg-[#f7f6f4]">
      <main>
        <HomeBannerSection />
        <HomeDiscoverySection catalog={catalog} />
        <ExploreSwisswristSection images={exploreSwisswristImages} />
        <NewArrivalsSection promoImage={catalog.rolex[7].image} products={newArrivalProducts} />
        <InvestmentSection image={assets.heroScene} />
        <InvestmentFeatureSection image={catalog.hublot[1].image} />
        <TestimonialsSection testimonials={testimonials} />
        <InstagramGallerySection images={instagramGridImages} />
        {/* <BrandStrip /> */}
        {/* <ProductSection
          id="rolex"
          eyebrow="Geneva"
          title="Rolex"
          description="Professional and classic lines — selected for condition, completeness, and provenance."
          products={catalog.rolex}
        />
        <ProductSection
          id="omega"
          eyebrow="Biel"
          title="Omega"
          description="From the Moonwatch to Seamaster: precision chronometry with enduring design."
          products={catalog.omega}
        />
        <ProductSection
          id="hublot"
          eyebrow="Nyon"
          title="Hublot"
          description="Fusion case materials and manufacture calibres for collectors who lead."
          products={catalog.hublot}
          gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        /> */}
      </main>
      <SwissWristFooter />
    </div>
  )
}
