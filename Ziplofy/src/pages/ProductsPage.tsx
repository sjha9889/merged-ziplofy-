import React, { useEffect } from "react";
import ProductsPageEmptyState from "../components/products/ProductsPageEmptyState";
import ProductsPageFilters from "../components/products/ProductsPageFilters";
import ProductsPageHeader from "../components/products/ProductsPageHeader";
import ProductsTable from "../components/products/ProductsTable";
import GridBackgroundWrapper from "../components/GridBackgroundWrapper";
import { useProducts } from "../contexts/product.context";
import { useStore } from "../contexts/store.context";

const ProductsPage: React.FC = () => {
  const { products, fetchProductsByStoreId } = useProducts();
  const { activeStoreId } = useStore();

  useEffect(() => {
    if (activeStoreId) {
      fetchProductsByStoreId(activeStoreId);
    }
  }, [activeStoreId, fetchProductsByStoreId]);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        <ProductsPageHeader />
        <ProductsPageFilters />

        <div className="max-w-7xl mx-auto py-6 px-4">
          {(!products || products.length === 0) ? (
            <ProductsPageEmptyState />
          ) : (
            <ProductsTable products={products} />
          )}
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default ProductsPage;