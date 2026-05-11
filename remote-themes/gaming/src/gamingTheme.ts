import type { ThemeContract } from './contract';
import { GamingCartPage } from './GamingCartPage';
import { GamingFooter } from './GamingFooter';
import { GamingHeader } from './GamingHeader';
import { GamingHeroSection } from './GamingHeroSection';
import { GamingHomePage } from './GamingHomePage';
import { GamingLoginPage } from './GamingLoginPage';
import { GamingNewArrivalsSection } from './GamingNewArrivalsSection';
import { GamingOrdersPage } from './GamingOrdersPage';
import { GamingPreferencesPage } from './GamingPreferencesPage';
import { GamingProductDetailsPage } from './GamingProductDetailsPage';
import { GamingProfilePage } from './GamingProfilePage';
import { GamingSignupPage } from './GamingSignupPage';
import { GamingTestimonialsSection } from './GamingTestimonialsSection';

export const gamingThemeContract: ThemeContract = {
  id: 'gaming',
  Header: GamingHeader,
  Footer: GamingFooter,
  HeroSection: GamingHeroSection,
  TestimonialsSection: GamingTestimonialsSection,
  NewArrivalsSection: GamingNewArrivalsSection,
  HomePage: GamingHomePage,
  ProductPage: GamingProductDetailsPage,
  LoginPage: GamingLoginPage,
  SignupPage: GamingSignupPage,
  ProfilePage: GamingProfilePage,
  OrdersPage: GamingOrdersPage,
  PreferencesPage: GamingPreferencesPage,
  CartPage: GamingCartPage,
};
