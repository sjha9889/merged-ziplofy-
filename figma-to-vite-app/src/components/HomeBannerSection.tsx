import { assets } from '../data/images'
import { Hero } from './Hero'
import { SwissWristHeader } from './SwissWristHeader'

/**
 * Top-of-home banner section:
 * fixed transparent header + hero art/copy exactly as the landing marquee.
 */
export function HomeBannerSection() {
  return (
    <>
      <SwissWristHeader variant="hero" />
      <Hero bannerSrc={assets.heroScene} />
    </>
  )
}
