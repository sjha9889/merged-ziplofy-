import type { ThemeContract } from './contract';
import { BeautyCartPage } from './BeautyCartPage';
import { BeautyFooter } from './BeautyFooter';
import { BeautyHeader } from './BeautyHeader';
import { BeautyHeroSection } from './BeautyHeroSection';
import { BeautyHomePage } from './BeautyHomePage';
import { BeautyLoginPage } from './BeautyLoginPage';
import { BeautyNewArrivalsSection } from './BeautyNewArrivalsSection';
import { BeautyOrdersPage } from './BeautyOrdersPage';
import { BeautyPreferencesPage } from './BeautyPreferencesPage';
import { BeautyProductDetailsPage } from './BeautyProductDetailsPage';
import { BeautyProfilePage } from './BeautyProfilePage';
import { BeautySignupPage } from './BeautySignupPage';
import { BeautyTestimonialsSection } from './BeautyTestimonialsSection';

export const beautyThemeContract: ThemeContract = {
  id: 'beauty',
  Header: BeautyHeader,
  Footer: BeautyFooter,
  HeroSection: BeautyHeroSection,
  TestimonialsSection: BeautyTestimonialsSection,
  NewArrivalsSection: BeautyNewArrivalsSection,
  HomePage: BeautyHomePage,
  ProductPage: BeautyProductDetailsPage,
  LoginPage: BeautyLoginPage,
  SignupPage: BeautySignupPage,
  ProfilePage: BeautyProfilePage,
  OrdersPage: BeautyOrdersPage,
  PreferencesPage: BeautyPreferencesPage,
  CartPage: BeautyCartPage,
};
