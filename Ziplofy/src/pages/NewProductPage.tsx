import {
  PlusIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import GridBackgroundWrapper from "../components/GridBackgroundWrapper";
import ProductBasicInformationSection from "../components/products/ProductBasicInformationSection";
import ProductImagesSection from "../components/products/ProductImagesSection";
import ProductInventorySection from "../components/products/ProductInventorySection";
import ProductOrganizationSection from "../components/products/ProductOrganizationSection";
import ProductPriceSection from "../components/products/ProductPriceSection";
import ProductSearchEngineListingSection from "../components/products/ProductSearchEngineListingSection";
import ProductShippingSection from "../components/products/ProductShippingSection";
import ProductStatusSection from "../components/products/ProductStatusSection";
import { useCategories } from "../contexts/category.context";
import { useProducts } from "../contexts/product.context";
import { useStore } from "../contexts/store.context";
const NewProductPage: React.FC = () => {
  const { categories, fetchBaseCategories } = useCategories();
  const { createProduct, loading: productLoading } = useProducts();
  const { activeStoreId } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    category: "",
    description: "",
    
    // Status
    status: "draft" as "draft" | "active",
    
    // Product Organization
    productType: "",
    vendor: "",
    tags: [] as string[],
    
    // Price
    price: "",
    compareAtPrice: "",
    unitPriceTotalAmount: "",
    unitPriceBaseMeasure: "",
    selectedUnit: "",
    selectedBaseMeasureUnit: "",
    chargeTaxOnProduct: false,
    cost: "",
    inventoryTrackingEnabled: false,
    quantity: "",
    sku: "",
    barcode: "",
    continueSellingWhenOutOfStock: false,
    physicalProduct: false,
    selectedPackage: "",
    productWeight: "",
    weightUnit: "",
    countryOfOrigin: "",
    hsCode: "",
    variants: [] as Array<{ optionName: string; values: string[] }>,
    pageTitle: "",
    metaDescription: "",
    urlHandle: "",
    images: [] as string[],
  });

  // Fetch categories when component mounts
  useEffect(() => {
    fetchBaseCategories();
  }, [fetchBaseCategories]);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!activeStoreId) {
      alert('Please select a store first');
      return;
    }

    try {
      // Calculate profit and margin
      const price = parseFloat(formData.price) || 0;
      const cost = parseFloat(formData.cost) || 0;
      const profit = price - cost;
      const marginPercent = price > 0 ? (profit / price) * 100 : 0;

      // Format the request body according to API expectations
      const requestBody = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: price,
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        chargeTax: formData.chargeTaxOnProduct,
        cost: cost,
        profit: profit,
        marginPercent: marginPercent,
        storeId: activeStoreId,
        unitPriceTotalAmount: formData.unitPriceTotalAmount ? parseFloat(formData.unitPriceTotalAmount) : undefined,
        unitPriceTotalAmountMetric: formData.selectedUnit || undefined,
        unitPriceBaseMeasure: formData.unitPriceBaseMeasure ? parseFloat(formData.unitPriceBaseMeasure) : undefined,
        unitPriceBaseMeasureMetric: formData.selectedBaseMeasureUnit || undefined,
        inventoryTrackingEnabled: formData.inventoryTrackingEnabled,
        continueSellingWhenOutOfStock: formData.continueSellingWhenOutOfStock,
        sku: formData.sku,
        barcode: formData.barcode,
        isPhysicalProduct: formData.physicalProduct,
        package: formData.physicalProduct ? formData.selectedPackage : undefined,
        productWeight: formData.physicalProduct ? parseFloat(formData.productWeight) : undefined,
        productWeightUnit: formData.physicalProduct ? formData.weightUnit : undefined,
        countryOfOrigin: formData.physicalProduct ? formData.countryOfOrigin : undefined,
        harmonizedSystemCode: formData.physicalProduct ? formData.hsCode : undefined,
        variants: formData.variants,
        pageTitle: formData.pageTitle,
        metaDescription: formData.metaDescription,
        urlHandle: formData.urlHandle,
        status: formData.status,
        onlineStorePublishing: true,
        pointOfSalePublishing: false,
        images: formData.images.filter(img => img.trim() !== ''),
        productType: formData.productType,
        vendor: formData.vendor,
        tagIds: formData.tags || []
      };      
      await createProduct(requestBody);
      setTimeout(() => navigate('/products'), 800);
      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
        status: "draft" as "draft" | "active",
        productType: "",
        vendor: "",
        tags: [],
        price: "",
        compareAtPrice: "",
        unitPriceTotalAmount: "",
        unitPriceBaseMeasure: "",
        selectedUnit: "",
        selectedBaseMeasureUnit: "",
        chargeTaxOnProduct: false,
        cost: "",
        inventoryTrackingEnabled: false,
        quantity: "",
        sku: "",
        barcode: "",
        continueSellingWhenOutOfStock: false,
        physicalProduct: false,
        selectedPackage: "",
        productWeight: "",
        weightUnit: "kg",
        countryOfOrigin: "",
        hsCode: "",
        variants: [],
        pageTitle: "",
        metaDescription: "",
        urlHandle: "",
        images: [] as string[]
      });
    } catch (error: any) {
      console.error('Error creating product:', error);
      alert(`Error creating product: ${error.message || 'Unknown error'}`);
      toast.error('Error creating product');
    }
  }, [activeStoreId, formData, createProduct, navigate]);

  // Image management functions
  const addImage = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  }, []);

  const updateImage = useCallback((index: number, url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? url : img)
    }));
  }, []);

  const removeImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, []);

  // Variant management functions
  const addVariant = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { optionName: '', values: [''] }]
    }));
  }, []);

  const removeVariant = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  }, []);

  const updateVariantOptionName = useCallback((index: number, optionName: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, optionName } : variant
      )
    }));
  }, []);

  const addVariantValue = useCallback((variantIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex 
          ? { ...variant, values: [...variant.values, ''] }
          : variant
      )
    }));
  }, []);

  const removeVariantValue = useCallback((variantIndex: number, valueIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex 
          ? { ...variant, values: variant.values.filter((_, j) => j !== valueIndex) }
          : variant
      )
    }));
  }, []);

  const updateVariantValue = useCallback((variantIndex: number, valueIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex 
          ? { 
              ...variant, 
              values: variant.values.map((v, j) => j === valueIndex ? value : v)
            }
          : variant
      )
    }));
  }, []);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto pt-6 px-4 pb-6">
          
          {/* Basic Information Section */}
          <ProductBasicInformationSection
            title={formData.title}
            category={formData.category}
            description={formData.description}
            activeStoreId={activeStoreId}
            onTitleChange={(value) => handleInputChange('title', value)}
            onCategoryChange={(categoryId) => handleInputChange('category', categoryId)}
            onDescriptionChange={(value) => handleInputChange('description', value)}
          />

          {/* Product Images Sub-section */}
          <ProductImagesSection
            images={formData.images}
            onAddImage={addImage}
            onUpdateImage={updateImage}
            onRemoveImage={removeImage}
          />

          <div className="border-t border-gray-200 my-6"></div>

          {/* Status Section */}
          <ProductStatusSection
            status={formData.status}
            onChange={(status) => handleInputChange('status', status)}
          />

          <div className="border-t border-gray-200 my-6"></div>

          {/* Product Organization Section */}
          <ProductOrganizationSection
            productType={formData.productType}
            vendor={formData.vendor}
            tags={formData.tags}
            onProductTypeChange={(productTypeId) => handleInputChange('productType', productTypeId)}
            onVendorChange={(vendorId) => handleInputChange('vendor', vendorId)}
            onTagsChange={(tags) => handleInputChange('tags', tags)}
            activeStoreId={activeStoreId}
          />

          <div className="border-t border-gray-200 my-6"></div>

          {/* Price Section */}
          <ProductPriceSection
            price={formData.price}
            compareAtPrice={formData.compareAtPrice}
            unitPriceTotalAmount={formData.unitPriceTotalAmount}
            unitPriceBaseMeasure={formData.unitPriceBaseMeasure}
            selectedUnit={formData.selectedUnit}
            selectedBaseMeasureUnit={formData.selectedBaseMeasureUnit}
            chargeTaxOnProduct={formData.chargeTaxOnProduct}
            cost={formData.cost}
            onPriceChange={(value) => handleInputChange('price', value)}
            onCompareAtPriceChange={(value) => handleInputChange('compareAtPrice', value)}
            onUnitPriceTotalAmountChange={(value) => handleInputChange('unitPriceTotalAmount', value)}
            onUnitPriceBaseMeasureChange={(value) => handleInputChange('unitPriceBaseMeasure', value)}
            onSelectedUnitChange={(value) => handleInputChange('selectedUnit', value)}
            onSelectedBaseMeasureUnitChange={(value) => handleInputChange('selectedBaseMeasureUnit', value)}
            onChargeTaxOnProductChange={(checked) => handleInputChange('chargeTaxOnProduct', checked)}
            onCostChange={(value) => handleInputChange('cost', value)}
          />

          <div className="border-t border-gray-200 my-6"></div>

          {/* Inventory Section */}
          <ProductInventorySection
            inventoryTrackingEnabled={formData.inventoryTrackingEnabled}
            sku={formData.sku}
            barcode={formData.barcode}
            continueSellingWhenOutOfStock={formData.continueSellingWhenOutOfStock}
            onInventoryTrackingEnabledChange={(checked) => handleInputChange('inventoryTrackingEnabled', checked)}
            onSkuChange={(value) => handleInputChange('sku', value)}
            onBarcodeChange={(value) => handleInputChange('barcode', value)}
            onContinueSellingWhenOutOfStockChange={(checked) => handleInputChange('continueSellingWhenOutOfStock', checked)}
          />

          <div className="border-t border-gray-200 my-6"></div>

          {/* Shipping Section */}
          <ProductShippingSection
            physicalProduct={formData.physicalProduct}
            selectedPackage={formData.selectedPackage}
            productWeight={formData.productWeight}
            weightUnit={formData.weightUnit}
            countryOfOrigin={formData.countryOfOrigin}
            hsCode={formData.hsCode}
            onPhysicalProductChange={(checked) => handleInputChange('physicalProduct', checked)}
            onSelectedPackageChange={(value) => handleInputChange('selectedPackage', value)}
            onProductWeightChange={(value) => handleInputChange('productWeight', value)}
            onWeightUnitChange={(value) => handleInputChange('weightUnit', value)}
            onCountryOfOriginChange={(value) => handleInputChange('countryOfOrigin', value)}
            onHsCodeChange={(value) => handleInputChange('hsCode', value)}
            activeStoreId={activeStoreId}
          />

          <div className="border-t border-gray-200 my-6"></div>

          {/* Variants Section */}
          <div className="mb-6 border border-gray-200 p-3 bg-white/95">
            <h2 className="text-base font-medium text-gray-900 mb-4">
              Variants
            </h2>
            
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors mb-4"
            >
              <PlusIcon className="w-4 h-4" />
              Add options like size or color
            </button>

            {/* Variants List */}
            {formData.variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="mb-3 p-4 border border-gray-200 rounded bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Option {variantIndex + 1}
                  </h4>
                  <button 
                    type="button"
                    onClick={() => removeVariant(variantIndex)}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Option Name
                    </label>
                    <input
                      type="text"
                      value={variant.optionName}
                      onChange={(e) => updateVariantOptionName(variantIndex, e.target.value)}
                      placeholder="e.g., Size, Color, Material"
                      className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Option Values
                    </label>
                    
                    {variant.values.map((value, valueIndex) => (
                      <div key={valueIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateVariantValue(variantIndex, valueIndex, e.target.value)}
                          placeholder="Enter value"
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                        />
                        <button 
                          type="button"
                          onClick={() => removeVariantValue(variantIndex, valueIndex)}
                          disabled={variant.values.length === 1}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addVariantValue(variantIndex)}
                      className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 mt-2"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      Add another value
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Search Engine Listing Section */}
          <ProductSearchEngineListingSection
            pageTitle={formData.pageTitle}
            metaDescription={formData.metaDescription}
            urlHandle={formData.urlHandle}
            onPageTitleChange={(value) => handleInputChange('pageTitle', value)}
            onMetaDescriptionChange={(value) => handleInputChange('metaDescription', value)}
            onUrlHandleChange={(value) => handleInputChange('urlHandle', value)}
          />
        </div>

        {/* Add Product Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={productLoading || !activeStoreId}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {productLoading ? 'Creating Product...' : 'Add Product'}
          </button>
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default NewProductPage;
