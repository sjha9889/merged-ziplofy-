// src/App.tsx
import React from "react";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";

import HomePage from "./components/HomePage";
import Sidebar from "./components/Sidebar";
import { AmountOffProductsDiscountProvider } from "./contexts/amount-off-products-discount.context";
import { CustomerTagsProvider } from "./contexts/customer-tags.context";
import { CustomerTimelineProvider } from "./contexts/customer-timeline.context";
import { CustomerProvider } from "./contexts/customer.context";
import { ProductTagsProvider } from "./contexts/product-tags.context";
import { SocketProvider } from "./contexts/socket.context";
import { StoreProvider } from "./contexts/store.context";
import { UserProvider } from "./contexts/user.context";
import Navbar from "./pages/Navbar";
import BasicElementor from "./pages/themes/BasicElementor";
import CustomThemeBuilder from "./pages/themes/CustomThemeBuilder";
import ThemeCodeEditor from "./pages/themes/ThemeCodeEditor";
import ThemeCodeEditorFullScreen from "./pages/themes/ThemeCodeEditorFullScreen";
import ThemeEditor from "./pages/themes/ThemeEditor";
import ThemeLayoutEditor from "./pages/themes/ThemeLayoutEditor";
/** Parent pages (top-level in /pages) */
import { CategoryProvider } from "./contexts/category.context";
import { NotificationOverridesProvider } from "./contexts/notification-overrides.context";
import { PermissionsProvider } from "./contexts/permissions.context";
import { PurchaseOrderProvider } from "./contexts/purchase-order.context";
import { StoreRolesProvider } from "./contexts/store-roles.context";
import { StoreSecuritySettingsProvider } from "./contexts/store-security-settings.context";
import AnalyticsPage from "./pages/AnalyticsPage";
import ContentPage from "./pages/ContentPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import CustomerDetailsPage from "./pages/CustomerDetailsPage";
import CustomerSegmentDetailsPage from "./pages/CustomerSegmentDetailsPage";
import CustomersPage from "./pages/CustomersPage";
import CustomersSegmentsPage from "./pages/CustomersSegmentsPage";
import DiscountsPage from "./pages/DiscountsPage";
import GiftCardDetailPage from "./pages/GiftCardDetailPage";
import GiftCardsPage from "./pages/GiftCardsPage";
import MarketingAttributionPage from "./pages/MarketingAttributionPage";
import MarketingAutomationsPage from "./pages/MarketingAutomationsPage";
import MarketingCampaignsPage from "./pages/MarketingCampaignsPage";
import MarketingPage from "./pages/MarketingPage";
import NewCustomerPage from "./pages/NewCustomerPage";
import NewGiftCardPage from "./pages/NewGiftCardPage";
import NewProductPage from "./pages/NewProductPage";
import NewTransferPage from "./pages/NewTransferPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import OrdersPage from "./pages/OrdersPage";
import ProductCollectionCreatePage from "./pages/ProductCollectionCreatePage";
import ProductCollectionDetailsPage from "./pages/ProductCollectionDetailsPage";
import ProductCollectionsPage from "./pages/ProductCollectionsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductVariantDetailsPage from "./pages/ProductVariantDetailsPage";
import ProductsInventoryPage from "./pages/ProductsInventoryPage";
import ProductsPage from "./pages/ProductsPage";
import PurchaseOrderDetailsPage from "./pages/PurchaseOrderDetailsPage";
import PurchaseOrderNewPage from "./pages/PurchaseOrderNewPage";
import PurchaseOrderReceivePage from "./pages/PurchaseOrderReceivePage";
import PurchaseOrdersListPage from "./pages/PurchaseOrdersListPage";
import ShipmentNewPage from "./pages/ShipmentNewPage";
import ShipmentReceivePage from "./pages/ShipmentReceivePage";
import TagManagement from "./pages/TagManagement";
import TransferDetailsPage from "./pages/TransferDetailsPage";
import TransfersPage from "./pages/TransfersPage";
import VendorsPage from "./pages/VendorsPage";
import AmountOffOrderDetailsPage from "./pages/discounts/AmountOffOrderDetailsPage";
import AmountOffOrderPage from "./pages/discounts/AmountOffOrderPage";
import AmountOffProductsPage from "./pages/discounts/AmountOffProductsPage";
import BuyXGetYDetailsPage from "./pages/discounts/BuyXGetYDetailsPage";
import BuyXGetYPage from "./pages/discounts/BuyXGetYPage";
import DiscountDetailsPage from "./pages/discounts/DiscountDetailsPage";
import FreeShippingDetailsPage from "./pages/discounts/FreeShippingDetailsPage";
import FreeShippingPage from "./pages/discounts/FreeShippingPage";
import AutomationCreatePage from "./pages/marketing/AutomationCreatePage";
import AutomationDetailsPage from "./pages/marketing/AutomationDetailsPage";
import AutomationNewPage from "./pages/marketing/AutomationNewPage";
import AutomationTemplatesPage from "./pages/marketing/AutomationTemplatesPage";
import BillingChargesPage from "./pages/settings/BillingChargesPage";
import BillingProfilePage from "./pages/settings/BillingProfilePage";
import BillingSettingsPage from "./pages/settings/BillingSettingsPage";
import BillingUpcomingPage from "./pages/settings/BillingUpcomingPage";
import BrandSettingsPage from "./pages/settings/BrandSettingsPage";
import CheckoutSettingsPage from "./pages/settings/CheckoutSettingsPage";
import CreateReturnRules from "./pages/settings/CreateReturnRules";
import CustomerAccountsAuthenticationPage from "./pages/settings/CustomerAccountsAuthenticationPage";
import CustomerAccountsFacebookPage from "./pages/settings/CustomerAccountsFacebookPage";
import CustomerAccountsGooglePage from "./pages/settings/CustomerAccountsGooglePage";
import CustomerAccountsPage from "./pages/settings/CustomerAccountsPage";
import CustomerNotificationsPage from "./pages/settings/CustomerNotificationsPage";
import CustomerPrivacyPage from "./pages/settings/CustomerPrivacyPage";
import DataSharingOptOutPage from "./pages/settings/DataSharingOptOutPage";
import DomainsPage from "./pages/settings/DomainsPage";
import EditNotificationOptionPage from "./pages/settings/EditNotificationOptionPage";
import GeneralSettingsPage from "./pages/settings/GeneralSettingsPage";
import IndiaTaxDetailsPage from "./pages/settings/IndiaTaxDetailsPage";
import LocalDeliveriesPage from "./pages/settings/LocalDeliveriesPage";
import LocalDeliveryLocationDetailPage from "./pages/settings/LocalDeliveryLocationDetailPage";
import LocationDetailsPage from "./pages/settings/LocationDetailsPage";
import LocationsSettings from "./pages/settings/LocationsSettings";
import ManageReturnRules from "./pages/settings/ManageReturnRules";
import NewLocationForm from "./pages/settings/NewLocationForm";
import NewRolePage from "./pages/settings/NewRolePage";
import NotificationOptionDetailPage from "./pages/settings/NotificationOptionDetailPage";
import NotificationsPage from "./pages/settings/NotificationsPage";
import PaymentsSettingsPage from "./pages/settings/PaymentsSettingsPage";
import PlanSelectPage from "./pages/settings/PlanSelectPage";
import PlanSettingsPage from "./pages/settings/PlanSettingsPage";
import PlanSubscriptionsPage from "./pages/settings/PlanSubscriptionsPage";
import PoliciesSettings from "./pages/settings/PoliciesSettings";
import RoleDetailsPage from "./pages/settings/RoleDetailsPage";
import RolesPage from "./pages/settings/RolesPage";
import SettingsIndex from "./pages/settings/SettingsIndex";
import SettingsLayout from "./pages/settings/SettingsLayout";
import SettingsPlaceholder from "./pages/settings/SettingsPlaceholder";
import ShippingSettings from "./pages/settings/ShippingSettings";
import ShopMetafieldsPage from "./pages/settings/ShopMetafieldsPage";
import StoreActivityLogPage from "./pages/settings/StoreActivityLogPage";
import TaxesAndDutiesPage from "./pages/settings/TaxesAndDutiesPage";
import UsersPage from "./pages/settings/UsersPage";
import UsersSecurityPage from "./pages/settings/UsersSecurityPage";
import CustomerTagsPage from "./pages/tag-management/CustomerTagsPage";
import ProductTagsPage from "./pages/tag-management/ProductTagsPage";
import ProductTypesPage from "./pages/tag-management/ProductTypesPage";
import PurchaseOrderTagsPage from "./pages/tag-management/PurchaseOrderTagsPage";
import TransferTagsPage from "./pages/tag-management/TransferTagsPage";
/** Orders children */
import { CustomerSegmentsEntryProvider } from "./contexts/CustomerSegmentsEntry.context";
import { AbandonedCartProvider } from "./contexts/abandoned-cart.context";
import { ActionProvider } from "./contexts/action.context";
import { AdminOrderProvider } from "./contexts/admin-order.context";
import { AmountOffOrderDiscountProvider } from "./contexts/amount-off-order-discount.context";
import { AutomationFlowProvider } from "./contexts/automation-flow.context";
import { BuyXGetYDiscountProvider } from "./contexts/buy-x-get-y-discount.context";
import { CatalogMarketProvider } from "./contexts/catalog-market.context";
import { CatalogProductProvider } from "./contexts/catalog-product.context";
import { CatalogProvider } from "./contexts/catalog.context";
import { CheckoutSettingsProvider } from "./contexts/checkout-settings.context";
import { CollectionEntriesProvider } from "./contexts/collection-entries.context";
import { CollectionProvider } from "./contexts/collection.context";
import { CountryTaxOverrideProvider } from "./contexts/country-tax-override.context";
import { CountryTaxProvider } from "./contexts/country-tax.context";
import { CountryProvider } from "./contexts/country.context";
import { CurrencyProvider } from "./contexts/currency.context";
import { CustomThemesProvider } from "./contexts/custom-themes.context";
import { CustomerAccountSettingsProvider } from "./contexts/customer-account-settings.context";
import { CustomerAddressProvider } from "./contexts/customer-address.context";
import { CustomerSegmentProvider } from "./contexts/customer-segment.context";
import { FinalSaleItemProvider } from "./contexts/final-sale-item.context";
import { FreeShippingDiscountProvider } from "./contexts/free-shipping-discount.context";
import { GeneralSettingsProvider } from "./contexts/general-settings.context";
import { GiftCardTimelineProvider } from "./contexts/gift-card-timeline.context";
import { GiftCardsProvider } from "./contexts/gift-cards.context";
import { InstalledThemesProvider } from "./contexts/installed-themes.context";
import { InventoryLevelsProvider } from "./contexts/inventory-level.contexts";
import { LocalDeliveryLocationEntriesProvider } from "./contexts/local-delivery-location-entries.context";
import { LocalDeliverySettingsProvider } from "./contexts/local-delivery-settings.context";
import { LocationsProvider } from "./contexts/location.context";
import { MarketIncludesProvider } from "./contexts/market-includes.context";
import { MarketProvider } from "./contexts/market.context";
import { NotificationCategoriesProvider } from "./contexts/notification-categories.context";
import { NotificationOptionsProvider } from "./contexts/notification-options.context";
import { PackagingProvider } from "./contexts/packaging.context";
import { PixelProvider } from "./contexts/pixel.context";
import { ProductOverrideEntryProvider } from "./contexts/product-override-entry.context";
import { ProductOverrideProvider } from "./contexts/product-override.context";
import { ProductTypeProvider } from "./contexts/product-type.context";
import { ProductVariantProvider } from "./contexts/product-variant.context";
import { ProductProvider } from "./contexts/product.context";
import { PurchaseOrderEntryProvider } from "./contexts/purchase-order-entry.context";
import { PurchaseOrderTagsProvider } from "./contexts/purchase-order-tags.context";
import { ReturnRulesProvider } from "./contexts/return-rules.context";
import { ShipmentProvider } from "./contexts/shipment.context";
import { ShippingOverrideProvider } from "./contexts/shipping-override.context";
import { ShippingProfileLocationSettingsProvider } from "./contexts/shipping-profile-location-settings.context";
import { ShippingProfileProductVariantsProvider } from "./contexts/shipping-profile-product-variants.context";
import { ShippingProfileProvider } from "./contexts/shipping-profile.context";
import { ShippingZoneRateProvider } from "./contexts/shipping-zone-rate.context";
import { ShippingZoneProvider } from "./contexts/shipping-zone.context";
import { StateProvider } from "./contexts/state.context";
import { StoreBrandingProvider } from "./contexts/store-branding.context";
import { StoreContactInfoProvider } from "./contexts/store-contact-info.context";
import { StoreNotificationEmailProvider } from "./contexts/store-notification-email.context";
import { StorePrivacyPolicyProvider } from "./contexts/store-privacy-policy.context";
import { StoreReturnRefundPolicyProvider } from "./contexts/store-return-refund-policy.context";
import { StoreShippingPolicyProvider } from "./contexts/store-shipping-policy.context";
import { StoreTermsPolicyProvider } from "./contexts/store-terms-policy.context";
import { StoreBillingAddressProvider } from "./contexts/storeBillingAddress.context";
import { StoreSubdomainProvider } from "./contexts/storeSubdomain.context";
import { TaxAndDutiesGlobalSettingsProvider } from "./contexts/tax-and-duties-global-settings.context";
import { TaxRateDefaultProvider } from "./contexts/tax-rate-default.context";
import { TaxRateOverrideProvider } from "./contexts/tax-rate-override.context";
import { ThemesProvider } from "./contexts/themes.context";
import { TransferEntriesProvider } from "./contexts/transfer-entries.context";
import { TransferTagsProvider } from "./contexts/transfer-tags.context";
import { TransferProvider } from "./contexts/transfer.context";
import { TriggerProvider } from "./contexts/trigger.context";
import { VendorProvider } from "./contexts/vendor.context";
import { BlogPostCreatePage } from "./pages/BlogPostCreatePage";
import { ContentBlogPostsPage } from "./pages/ContentBlogPostsPage";
import { ContentFilesPage } from "./pages/ContentFilesPage";
import { ContentMenusPage } from "./pages/ContentMenusPage";
import { ContentMetaObjectsPage } from "./pages/ContentMetaObjectsPage";
import { LanguageSettingsPage } from "./pages/LanguageSettingsPage";
import { MarketSettingsPage } from "./pages/MarketSettingsPage";
import { MetafeildsAndMetaObjectsSettingsPage } from "./pages/MetafeildsAndMetaObjectsSettingsPage";
import OnlineStorePage from "./pages/OnlineStorePage";
import OnlineStorePreferencePage from "./pages/OnlineStorePreferencePage";
import SelectDiscountToCreatePage from "./pages/SelectDiscountToCreatePage";
import MarketDetailsPage from "./pages/markets/MarketDetailsPage";
import MarketsCatalogDetailsPage from "./pages/markets/MarketsCatalogDetailsPage";
import MarketsCatalogsNewPage from "./pages/markets/MarketsCatalogsNewPage";
import MarketsCatalogsPage from "./pages/markets/MarketsCatalogsPage";
import MarketsNewPage from "./pages/markets/MarketsNewPage";
import MarketsPage from "./pages/markets/MarketsPage";
import AbandonedCartsPage from "./pages/orders/AbandonedCartPage";
import AbandonedCartDetailsPage from "./pages/orders/AbondonedCartDetailsPage";
import DraftsPage from "./pages/orders/DraftsPage";
import CustomerEventPixelDetailsPage from "./pages/settings/CustomerEventPixelDetailsPage";
import CustomerEventsPage from "./pages/settings/CustomerEventsPage";
import ShippingProfileCreatePage from "./pages/settings/ShippingProfileCreatePage";
import ShippingProfileDetailsPage from "./pages/settings/ShippingProfileDetailsPage";
import WebhooksNotificationsPage from "./pages/settings/WebhooksNotificationsPage";
import AllThemes from "./pages/themes/AllThemes";

/** Products children */

/** Customers child */

/** Marketing children */

const NAVBAR_HEIGHT = 48; // keep consistent with Sidebar offset (h-12 = 48px)
const SIDEBAR_WIDTH = 240; // keep consistent with Sidebar width
// This component is rendered INSIDE <Router>, so hooks like useLocation are safe here
const AdminApp: React.FC = () => {
  const location = useLocation();
  const isCodeFullScreen = location.pathname.startsWith('/themes/code-fullscreen/');
  const isBuilderFullScreen = location.pathname.startsWith('/themes/builder');
  const isBasicElementor = location.pathname.startsWith('/themes/basic-elementor');
  const hideSidebar = isCodeFullScreen || isBuilderFullScreen || isBasicElementor;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {!hideSidebar && <Navbar />}

      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden", position: "relative" }}>
        {!hideSidebar && <Sidebar />}

        <main
          style={{
            flexGrow: 1,
            padding: hideSidebar ? 0 : "24px",
            overflow: "auto",
            marginTop: hideSidebar ? 0 : `${NAVBAR_HEIGHT}px`,
            marginLeft: hideSidebar ? 0 : `${SIDEBAR_WIDTH}px`,
            width: hideSidebar ? '100%' : `calc(100% - ${SIDEBAR_WIDTH}px)`,
            height: hideSidebar ? `100vh` : `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            backgroundColor: hideSidebar ? 'transparent' : '#fff',
            color: '#000',
            transition: 'margin-left 0.3s ease',
          }}
        >
          <Routes>
            {/* Top-level */}
            <Route path="/" element={<HomePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/create" element={<CreateOrderPage />} />
            <Route path="/orders/abandoned-carts" element={<AbandonedCartsPage />} />
            <Route path="/orders/abandoned-carts/customer/:customerId" element={<AbandonedCartDetailsPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/products/:id/variants/:variantId" element={<ProductVariantDetailsPage />} />
            <Route path="/products/new" element={<NewProductPage />} />
            <Route path="/products/inventory" element={<ProductsInventoryPage />} />
            <Route path="/products/purchase-orders" element={<PurchaseOrdersListPage />} />
            <Route path="/products/purchase-orders/:id" element={<PurchaseOrderDetailsPage />} />
            <Route path="/products/purchase-orders/:id/receive" element={<PurchaseOrderReceivePage />} />
            <Route path="/products/purchase-orders/new" element={<PurchaseOrderNewPage />} />
            <Route path="/products/collections" element={<ProductCollectionsPage />} />
            <Route path="/products/collections/:id" element={<ProductCollectionDetailsPage />} />
            <Route path="/products/collections/new" element={<ProductCollectionCreatePage />} />
            <Route path="/products/gift-cards" element={<GiftCardsPage />} />
            <Route path="/products/gift-cards/new" element={<NewGiftCardPage />} />
            <Route path="/products/gift-cards/:giftCardId" element={<GiftCardDetailPage />} />
            <Route path="/products/transfers" element={<TransfersPage />} />
            <Route path="/products/transfers/:id" element={<TransferDetailsPage />} />
            <Route path="/products/transfers/new" element={<NewTransferPage />} />
            <Route path="/products/transfers/:id/shipment/new" element={<ShipmentNewPage />} />
            <Route path="/products/transfers/:id/shipment/:shipmentId/receive" element={<ShipmentReceivePage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/segments" element={<CustomersSegmentsPage />} />
            <Route path="/customers/segments/:id" element={<CustomerSegmentDetailsPage />} />
            <Route path="/customers/new" element={<NewCustomerPage />} />
            <Route path="/customers/:id" element={<CustomerDetailsPage />} />
            <Route path="/marketing" element={<MarketingPage />} />
            <Route path="/marketing/campaigns" element={<MarketingCampaignsPage />} />
            <Route path="/marketing/attribution" element={<MarketingAttributionPage />} />
            <Route path="/marketing/automations" element={<MarketingAutomationsPage />} />
            <Route path="/marketing/automations/templates" element={<AutomationTemplatesPage />} />
            <Route path="/marketing/automations/new" element={<AutomationNewPage />} />
            <Route path="/marketing/automations/create" element={<AutomationCreatePage />} />
            <Route path="/marketing/automations/:id" element={<AutomationDetailsPage />} />
            <Route path="/discounts" element={<DiscountsPage />} />
            <Route path="/discounts/select-discount-to-create" element={<SelectDiscountToCreatePage />} />
            <Route path="/discounts/:id" element={<DiscountDetailsPage />} />
            <Route path="/discounts/pyxgety/:id" element={<BuyXGetYDetailsPage />} />
            <Route path="/discounts/amount-off-order/:id" element={<AmountOffOrderDetailsPage />} />
            <Route path="/discounts/free-shipping/:id" element={<FreeShippingDetailsPage />} />
            <Route path="/discounts/new/amount-off-products" element={<AmountOffProductsPage />} />
            <Route path="/discounts/new/buy-x-get-y" element={<BuyXGetYPage />} />
            <Route path="/discounts/new/amount-off-order" element={<AmountOffOrderPage />} />
            <Route path="/discounts/new/free-shipping" element={<FreeShippingPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/content/blog-posts" element={<ContentBlogPostsPage />} />
            <Route path="/content/blog-posts/new" element={<BlogPostCreatePage />} />
            <Route path="/content/files" element={<ContentFilesPage />} />
            <Route path="/content/menus" element={<ContentMenusPage />} />
            <Route path="/content/metaobjects" element={<ContentMetaObjectsPage />} />
            <Route path="/online-store" element={<OnlineStorePage />} />
            <Route path="/online-store/preference" element={<OnlineStorePreferencePage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/markets/new" element={<MarketsNewPage />} />
            <Route path="/markets/catalogs" element={<MarketsCatalogsPage />} />
            <Route path="/markets/catalogs/new" element={<MarketsCatalogsNewPage />} />
            <Route path="/markets/catalogs/:id" element={<MarketsCatalogDetailsPage />} />
            <Route path="/markets/:id" element={<MarketDetailsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/tag-management" element={<TagManagement />} />
            <Route path="/tag-management/customer-tags" element={<CustomerTagsPage />} />
            <Route path="/tag-management/product-tags" element={<ProductTagsPage />} />
            <Route path="/tag-management/product-types" element={<ProductTypesPage />} />
            <Route path="/tag-management/transfer-tags" element={<TransferTagsPage />} />
            <Route path="/tag-management/purchase-order-tags" element={<PurchaseOrderTagsPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/settings" element={<SettingsLayout />}>
              <Route index element={<SettingsIndex />} />
              <Route path="general" element={<GeneralSettingsPage />} />
              <Route path="general/metafields" element={<ShopMetafieldsPage />} />
              <Route path="general/activity" element={<StoreActivityLogPage />} />
              <Route path="general/branding" element={<BrandSettingsPage />} />
              <Route path="plan" element={<PlanSettingsPage />} />
              <Route path="plan/subscriptions" element={<PlanSubscriptionsPage />} />
              <Route path="subscribe/select-plan" element={<PlanSelectPage />} />
              <Route path="billing" element={<BillingSettingsPage />} />
              <Route path="billing/charges" element={<BillingChargesPage />} />
              <Route path="billing/upcoming" element={<BillingUpcomingPage />} />
              <Route path="billing/profile" element={<BillingProfilePage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/roles" element={<RolesPage />} />
              <Route path="users/roles/:roleId" element={<RoleDetailsPage />} />
              <Route path="users/roles/new" element={<NewRolePage />} />
              <Route path="users/security" element={<UsersSecurityPage />} />
              <Route path="payments" element={<PaymentsSettingsPage />} />
              <Route path="checkout" element={<CheckoutSettingsPage />} />
              <Route path="customer-accounts" element={<CustomerAccountsPage />} />
              <Route path="customer-accounts/authentication" element={<CustomerAccountsAuthenticationPage />} />
              <Route path="customer-accounts/authentication/google" element={<CustomerAccountsGooglePage />} />
              <Route path="customer-accounts/authentication/facebook" element={<CustomerAccountsFacebookPage />} />
              <Route path="shipping-and-delivery" element={<ShippingSettings />} />
              <Route path="shipping-and-delivery/local_deliveries/:localDeliveryId" element={<LocalDeliveriesPage />} />
              <Route path="shipping-and-delivery/local_deliveries/:localDeliveryId/locations/:locationId" element={<LocalDeliveryLocationDetailPage />} />
              <Route path="shipping-and-delivery/profiles/create" element={<ShippingProfileCreatePage />} />
              <Route path="shipping-and-delivery/profiles/:profileId" element={<ShippingProfileDetailsPage />} />
              <Route path="taxes-and-duties" element={<TaxesAndDutiesPage />} />
              <Route path="taxes-and-duties/:countryId" element={<IndiaTaxDetailsPage />} />
              <Route path="locations" element={<LocationsSettings />} />
              <Route path="locations/new" element={<NewLocationForm />} />
              <Route path="locations/:locationId" element={<LocationDetailsPage />} />
              <Route path="markets" element={<MarketSettingsPage />} />
              <Route path="apps-and-sales-channels" element={<SettingsPlaceholder title="Apps and Sales Channels" />} />
              <Route path="domains" element={<DomainsPage />} />
              <Route path="customer-events" element={<CustomerEventsPage />} />
              <Route path="customer-events/:pixelId" element={<CustomerEventPixelDetailsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="notifications/:categoryId/:categorySlug" element={<CustomerNotificationsPage />} />
              <Route path="notifications/:categoryId/:categorySlug/:optionId" element={<NotificationOptionDetailPage />} />
              <Route path="notifications/:categoryId/:categorySlug/:optionId/edit" element={<EditNotificationOptionPage />} />
              <Route path="notifications/webhooks" element={<WebhooksNotificationsPage />} />
              <Route path="metafields-and-metaobjects" element={<MetafeildsAndMetaObjectsSettingsPage />} />
              <Route path="languages" element={<LanguageSettingsPage />} />
              <Route path="customer-privacy" element={<CustomerPrivacyPage />} />
              <Route path="customer-privacy/dns" element={<DataSharingOptOutPage />} />
              <Route path="policies" element={<PoliciesSettings />} />
              <Route path="policies/manage-return-rules" element={<ManageReturnRules />} />
              <Route path="policies/manage-return-rules/new" element={<CreateReturnRules />} />
            </Route>

            {/* Orders subsections */}
            <Route path="/orders/drafts" element={<DraftsPage />} />
            

            {/* Themes Subsection */}
            <Route path="/themes/all-themes" element={<AllThemes />} />
            <Route path="/themes/builder" element={<CustomThemeBuilder />} />
            <Route path="/themes/basic-elementor" element={<BasicElementor />} />
            <Route path="/themes/edit/:themeId" element={<ThemeEditor />} />
            <Route path="/themes/layout/:themeId" element={<ThemeLayoutEditor />} />
            <Route path="/themes/code/:themeId" element={<ThemeCodeEditor />} />
            <Route path="/themes/code-fullscreen/:themeId" element={<ThemeCodeEditorFullScreen />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <InstalledThemesProvider>
      <AmountOffProductsDiscountProvider>
      <CategoryProvider>
      <PackagingProvider>
      <CustomerTimelineProvider>
      <CustomerAddressProvider>
      <StoreProvider>
        <ThemesProvider>
          <CustomThemesProvider>
        <VendorProvider>
        <CollectionProvider>
        <CustomerTagsProvider>
        <ProductTagsProvider>
        <CustomerProvider>
        <SocketProvider>
        <ProductProvider>
        <ProductVariantProvider>
        <CollectionEntriesProvider>
        <ProductTypeProvider>
        <GiftCardsProvider>
        <GiftCardTimelineProvider>
        <LocationsProvider>
        <LocalDeliverySettingsProvider>
        <LocalDeliveryLocationEntriesProvider>
        <InventoryLevelsProvider>
        <TransferTagsProvider>
        <TransferProvider>
        <TransferEntriesProvider>
        <ShipmentProvider>
        <PurchaseOrderTagsProvider>
        <PurchaseOrderProvider>
        <PurchaseOrderEntryProvider>
        <CustomerSegmentProvider>
        <CustomerSegmentsEntryProvider>
        <BuyXGetYDiscountProvider>
        <AmountOffOrderDiscountProvider>
        <FreeShippingDiscountProvider>
        <StoreSubdomainProvider>
        <AbandonedCartProvider>
        <StoreBillingAddressProvider>
        <StoreBrandingProvider>
        <GeneralSettingsProvider>
        <CustomerAccountSettingsProvider>
        <ReturnRulesProvider>
        <FinalSaleItemProvider>
        <StoreContactInfoProvider>
        <StoreNotificationEmailProvider>
        <StoreShippingPolicyProvider>
        <StoreTermsPolicyProvider>
        <StorePrivacyPolicyProvider>
        <StoreReturnRefundPolicyProvider>
        <CatalogProvider>
        <CurrencyProvider>
        <CatalogProductProvider>
        <CatalogMarketProvider>
        <MarketProvider>
        <MarketIncludesProvider>
        <CountryProvider>
        <StateProvider>
        <ShippingZoneProvider>
          <ShippingZoneRateProvider>
        <TriggerProvider>
        <ActionProvider>
        <AutomationFlowProvider>
        <PixelProvider>
        <AdminOrderProvider>
        <NotificationCategoriesProvider>
        <NotificationOptionsProvider>
        <NotificationOverridesProvider>
        <PermissionsProvider>
        <StoreRolesProvider>
        <StoreSecuritySettingsProvider>
        <CheckoutSettingsProvider>
        <ShippingProfileProvider>
        <ShippingProfileLocationSettingsProvider>
        <ShippingProfileProductVariantsProvider>
        <TaxRateDefaultProvider>
        <CountryTaxProvider>
        <TaxRateOverrideProvider>
        <ShippingOverrideProvider>
        <ProductOverrideProvider>
        <ProductOverrideEntryProvider>
        <CountryTaxOverrideProvider>
        <TaxAndDutiesGlobalSettingsProvider>
          <Router>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
          <AdminApp />
        </Router>
        </TaxAndDutiesGlobalSettingsProvider>
        </CountryTaxOverrideProvider>
        </ProductOverrideEntryProvider>
        </ProductOverrideProvider>
        </ShippingOverrideProvider>
        </TaxRateOverrideProvider>
        </CountryTaxProvider>
        </TaxRateDefaultProvider>
        </ShippingProfileProductVariantsProvider>
        </ShippingProfileLocationSettingsProvider>
        </ShippingProfileProvider>
        </CheckoutSettingsProvider>
        </StoreSecuritySettingsProvider>
        </StoreRolesProvider>
        </PermissionsProvider>
        </NotificationOverridesProvider>
        </NotificationOptionsProvider>
        </NotificationCategoriesProvider>
        </AdminOrderProvider>
        </PixelProvider>
        </AutomationFlowProvider>
        </ActionProvider>
        </TriggerProvider>
          </ShippingZoneRateProvider>
        </ShippingZoneProvider>
        </StateProvider>
        </CountryProvider>
        </MarketIncludesProvider>
        </MarketProvider>
        </CatalogMarketProvider>
        </CatalogProductProvider>
        </CurrencyProvider>
        </CatalogProvider>
        </StoreReturnRefundPolicyProvider>
        </StorePrivacyPolicyProvider>
        </StoreTermsPolicyProvider>
        </StoreShippingPolicyProvider>
        </StoreNotificationEmailProvider>
        </StoreContactInfoProvider>
        </FinalSaleItemProvider>
        </ReturnRulesProvider>
        </CustomerAccountSettingsProvider>
        </GeneralSettingsProvider>
        </StoreBrandingProvider>
        </StoreBillingAddressProvider>
        </AbandonedCartProvider>
        </StoreSubdomainProvider>
        </FreeShippingDiscountProvider>
        </AmountOffOrderDiscountProvider>
        </BuyXGetYDiscountProvider>
        </CustomerSegmentsEntryProvider>
        </CustomerSegmentProvider>
        </PurchaseOrderEntryProvider>
        </PurchaseOrderProvider>
        </PurchaseOrderTagsProvider>
        </ShipmentProvider>
        </TransferEntriesProvider>
        </TransferProvider>
        </TransferTagsProvider>
        </InventoryLevelsProvider>
        </LocalDeliveryLocationEntriesProvider>
        </LocalDeliverySettingsProvider>
        </LocationsProvider>
        </GiftCardTimelineProvider>
        </GiftCardsProvider>
        </ProductTypeProvider>
        </CollectionEntriesProvider>
      </ProductVariantProvider>
      </ProductProvider>
        </SocketProvider>
        </CustomerProvider>
        </ProductTagsProvider>
        </CustomerTagsProvider>
        </CollectionProvider>
        </VendorProvider>
        </CustomThemesProvider>
        </ThemesProvider>
      </StoreProvider>
      
      </CustomerAddressProvider>
      </CustomerTimelineProvider>
      </PackagingProvider>
      </CategoryProvider>
      </AmountOffProductsDiscountProvider>
      </InstalledThemesProvider>
    </UserProvider>
  );
};

export default App;
