import { useEffect, useMemo } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CustomThemeTemplatePage } from '@ziplofy/create-theme/runtime';
import { postToParent } from './previewBridge';
import { previewPageToRoute, type ThemePreviewPage } from './previewBridge';

type Props = {
  page: ThemePreviewPage;
  pageRevision: number;
};

export function CustomThemeComposerPreview({ page, pageRevision }: Props) {
  useEffect(() => {
    postToParent({ source: 'ziplofy-theme-preview', type: 'ZIPLOFY_PREVIEW_LOADED' });
  }, []);

  const routeKey = `${page}-${pageRevision}`;
  const initialEntry = useMemo(() => previewPageToRoute(page), [page]);

  const templateId = page || 'index';

  return (
    <MemoryRouter key={routeKey} initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<CustomThemeTemplatePage templateId="index" />} />
        <Route path="/products" element={<CustomThemeTemplatePage templateId="index" />} />
        <Route path="/products/:id" element={<CustomThemeTemplatePage templateId="product" />} />
        <Route path="/collection" element={<CustomThemeTemplatePage templateId="index" />} />
        <Route path="/collections/:urlHandle" element={<CustomThemeTemplatePage templateId="index" />} />
        <Route path="/auth/login" element={<CustomThemeTemplatePage templateId="login" />} />
        <Route path="/auth/signup" element={<CustomThemeTemplatePage templateId="signup" />} />
        <Route path="/auth/forgot" element={<CustomThemeTemplatePage templateId="forgot_password" />} />
        <Route path="/profile" element={<CustomThemeTemplatePage templateId="profile" />} />
        <Route path="/my-orders" element={<CustomThemeTemplatePage templateId="orders" />} />
        <Route path="/preferences" element={<CustomThemeTemplatePage templateId="preferences" />} />
        <Route path="/cart" element={<CustomThemeTemplatePage templateId="cart" />} />
        <Route path="*" element={<CustomThemeTemplatePage templateId={templateId} />} />
      </Routes>
    </MemoryRouter>
  );
}
