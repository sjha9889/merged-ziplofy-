import React, { useEffect } from "react";
import ProductsPageEmptyState from "../components/products/ProductsPageEmptyState";
import ProductsPageFilters from "../components/products/ProductsPageFilters";
import ProductsPageHeader from "../components/products/ProductsPageHeader";
import ProductsTable from "../components/products/ProductsTable";
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
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
        <ProductsPageHeader />
        <ProductsPageFilters />

        <div>
          {(!products || products.length === 0) ? (
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
              <ProductsPageEmptyState />
            </div>
          ) : (
            <ProductsTable products={products} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;