import type { ComponentType } from "react";

export type ThemeComponent = ComponentType;

export interface ThemeContract {
  id: "gaming" | "beauty";
  Header: ThemeComponent;
  Footer: ThemeComponent;
  HeroSection: ThemeComponent;
  TestimonialsSection: ThemeComponent;
  NewArrivalsSection: ThemeComponent;
  HomePage: ThemeComponent;
  ProductPage: ThemeComponent;
  LoginPage: ThemeComponent;
  SignupPage: ThemeComponent;
  ProfilePage: ThemeComponent;
  OrdersPage: ThemeComponent;
  PreferencesPage: ThemeComponent;
  CartPage: ThemeComponent;
}
