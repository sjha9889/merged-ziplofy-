import {
  ArrowLeftIcon,
  CubeIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ProductBasicInformationSection from "../components/products/ProductBasicInformationSection";
import ProductInventorySection from "../components/products/ProductInventorySection";
import ProductOrganizationSection from "../components/products/ProductOrganizationSection";
import ProductPriceSection from "../components/products/ProductPriceSection";
import ProductSearchEngineListingSection from "../components/products/ProductSearchEngineListingSection";
import ProductShippingSection from "../components/products/ProductShippingSection";
import ProductStatusSection from "../components/products/ProductStatusSection";
import { useAwsUpload } from "../contexts/aws-upload.context";
import { useCategories } from "../contexts/category.context";
import { useProducts } from "../contexts/product.context";
import { useStore } from "../contexts/store.context";

type SelectedProductImage = {
  file: File;
  previewUrl: string;
};

const NewProductPage: React.FC = () => {
  const { categories, fetchBaseCategories } = useCategories();
  const { createProduct, loading: productLoading } = useProducts();
  const { activeStoreId } = useStore();
  const { uploadImageWithSignedUrl } = useAwsUpload();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedProductImage[]>([]);
  const selectedImagesRef = useRef<SelectedProductImage[]>([]);
  
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
    weightUnit: "kg",
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

  useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const getErrorMessage = useCallback((error: any): string => {
    const apiMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.details?.message ||
      error?.response?.data?.data?.message;

    if (typeof apiMessage === "string" && apiMessage.trim()) {
      return apiMessage;
    }

    if (Array.isArray(error?.response?.data?.errors) && error.response.data.errors.length > 0) {
      const firstError = error.response.data.errors[0];
      if (typeof firstError === "string") return firstError;
      if (typeof firstError?.message === "string") return firstError.message;
    }

    if (typeof error?.message === "string" && error.message.trim()) {
      return error.message;
    }

    return "Failed to create product";
  }, []);

  const stripHtml = useCallback((html: string): string => {
    if (!html) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
  }, []);

  const slugify = useCallback((input: string): string => {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }, []);

  const dataUrlToFile = useCallback((dataUrl: string, fallbackName: string): File | null => {
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) return null;
    const mimeType = match[1];
    const base64Data = match[2];
    const binary = window.atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    const extension = mimeType.split("/")[1] || "png";
    return new File([bytes], `${fallbackName}.${extension}`, { type: mimeType });
  }, []);

  const uploadDescriptionImages = useCallback(
    async (descriptionHtml: string): Promise<string> => {
      if (!descriptionHtml.trim()) return descriptionHtml;

      const parser = new DOMParser();
      const doc = parser.parseFromString(descriptionHtml, "text/html");
      const imageNodes = Array.from(doc.querySelectorAll("img[src]"));
      const localImages = imageNodes.filter((img) => {
        const src = img.getAttribute("src") || "";
        return src.startsWith("data:image/");
      });

      if (!localImages.length) return descriptionHtml;

      const uploadToastId = toast.loading(
        `Uploading ${localImages.length} description image${localImages.length > 1 ? "s" : ""}...`
      );

      try {
        await Promise.all(
          localImages.map(async (img, index) => {
            const src = img.getAttribute("src") || "";
            const file = dataUrlToFile(src, `description-image-${index + 1}`);
            if (!file) return;

            const uploaded = await uploadImageWithSignedUrl(file, {
              folder: `${activeStoreId}/product-description-image`,
            });
            img.setAttribute("src", uploaded.objectUrl);
          })
        );
        toast.success("Description images uploaded", { id: uploadToastId });
        return doc.body.innerHTML;
      } catch (error) {
        toast.error("Failed to upload one or more description images", {
          id: uploadToastId,
        });
        throw error;
      }
    },
    [activeStoreId, dataUrlToFile, uploadImageWithSignedUrl]
  );

  const handleSubmit = useCallback(async () => {
    if (!activeStoreId) {
      alert('Please select a store first');
      return;
    }

    if (formData.physicalProduct && formData.hsCode.trim() !== "" && !/^\d{6}$/.test(formData.hsCode.trim())) {
      toast.error("HS code must be exactly 6 digits");
      return;
    }

    setIsSubmitting(true);
    try {
      const descriptionWithUploadedImages = await uploadDescriptionImages(
        formData.description
      );

      let uploadedImageUrls: string[] = [];
      if (selectedImages.length > 0) {
        const uploadToastId = toast.loading(`Uploading ${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''}...`);
        const uploadedImages = await Promise.all(
          selectedImages.map((image) =>
            uploadImageWithSignedUrl(image.file, { folder: `${activeStoreId}/product-image` })
          )
        );
        console.log("uploadedImages", uploadedImages);
        uploadedImageUrls = uploadedImages.map((image) => image.objectUrl);
        toast.success('Images uploaded', { id: uploadToastId });
      };

      // Calculate profit and margin
      const price = parseFloat(formData.price) || 0;
      const cost = parseFloat(formData.cost) || 0;
      const profit = price - cost;
      const marginPercent = price > 0 ? (profit / price) * 100 : 0;

      const descriptionPlainText = stripHtml(descriptionWithUploadedImages);
      const safePageTitle =
        (formData.pageTitle || "").trim() || (formData.title || "").trim();
      const safeMetaDescription =
        (formData.metaDescription || "").trim() ||
        descriptionPlainText.slice(0, 240);
      const safeUrlHandle =
        (formData.urlHandle || "").trim() ||
        slugify((formData.title || "").trim()) ||
        `product-${Date.now()}`;

      // Format the request body according to API expectations
      const requestBody = {
        title: formData.title,
        description: descriptionWithUploadedImages,
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
        pageTitle: safePageTitle,
        metaDescription: safeMetaDescription,
        urlHandle: safeUrlHandle,
        status: formData.status,
        onlineStorePublishing: true,
        pointOfSalePublishing: false,
        images: uploadedImageUrls,
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
      selectedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      setSelectedImages([]);
    } catch (error: any) {
      console.error('Error creating product:', error);
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    activeStoreId,
    formData,
    createProduct,
    navigate,
    selectedImages,
    uploadImageWithSignedUrl,
    getErrorMessage,
    uploadDescriptionImages,
    stripHtml,
    slugify,
  ]);

  // Image management functions
  const addImageFiles = useCallback((files: File[]) => {
    const validFiles = files.filter((file) => file.type.startsWith('image/'));
    const rejectedFilesCount = files.length - validFiles.length;

    if (rejectedFilesCount > 0) {
      toast.error(`Skipped ${rejectedFilesCount} non-image file${rejectedFilesCount > 1 ? 's' : ''}`);
    }

    if (!validFiles.length) return;

    setSelectedImages((prev) => [
      ...prev,
      ...validFiles.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setSelectedImages((prev) => {
      const imageToRemove = prev[index];
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
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
    <div className="min-h-screen bg-page-background-color">
      <div className="mx-auto max-w-[1500px] px-3 py-4 sm:px-4">
        <div className="mb-5">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Products
          </button>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100">
                <CubeIcon className="h-4 w-4 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Add product</h1>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={productLoading || isSubmitting || !activeStoreId}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting || productLoading ? 'Creating product...' : 'Add product'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <ProductBasicInformationSection
              title={formData.title}
              description={formData.description}
              category={formData.category}
              activeStoreId={activeStoreId}
              images={selectedImages.map((image) => image.previewUrl)}
              onTitleChange={(value) => handleInputChange('title', value)}
              onDescriptionChange={(value) => handleInputChange('description', value)}
              onCategoryChange={(categoryId) => handleInputChange('category', categoryId)}
              onAddImageFiles={addImageFiles}
              onRemoveImage={removeImage}
              mediaDisabled={isSubmitting || productLoading}
            />

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

            <ProductInventorySection
              inventoryTrackingEnabled={formData.inventoryTrackingEnabled}
              sku={formData.sku}
              barcode={formData.barcode}
              onInventoryTrackingEnabledChange={(checked) => handleInputChange('inventoryTrackingEnabled', checked)}
              onSkuChange={(value) => handleInputChange('sku', value)}
              onBarcodeChange={(value) => handleInputChange('barcode', value)}
            />

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

            <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-900">Variants</h2>

              <div className="space-y-4">
                {formData.variants.map((variant, variantIndex) => (
                  <div
                    key={variantIndex}
                    className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        Option {variantIndex + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeVariant(variantIndex)}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Option name
                        </label>
                        <input
                          type="text"
                          value={variant.optionName}
                          onChange={(e) =>
                            updateVariantOptionName(variantIndex, e.target.value)
                          }
                          placeholder="e.g., Size, Color, Material"
                          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Option values
                        </label>
                        {variant.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="mb-2 flex gap-2">
                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                updateVariantValue(
                                  variantIndex,
                                  valueIndex,
                                  e.target.value
                                )
                              }
                              placeholder="Enter value"
                              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeVariantValue(variantIndex, valueIndex)
                              }
                              disabled={variant.values.length === 1}
                              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addVariantValue(variantIndex)}
                          className="mt-2 flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-gray-900"
                        >
                          <PlusIcon className="h-4 w-4" />
                          Add another value
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addVariant}
                className={`flex items-center gap-2 rounded-lg py-2 text-left text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 ${
                  formData.variants.length > 0 ? "mt-4" : ""
                }`}
              >
                <PlusCircleIcon className="h-5 w-5 shrink-0 text-gray-700" aria-hidden />
                Add options like size or color
              </button>
            </div>

            <ProductSearchEngineListingSection
              productTitle={formData.title}
              productDescription={formData.description}
              pageTitle={formData.pageTitle}
              metaDescription={formData.metaDescription}
              urlHandle={formData.urlHandle}
              onPageTitleChange={(value) => handleInputChange('pageTitle', value)}
              onMetaDescriptionChange={(value) => handleInputChange('metaDescription', value)}
              onUrlHandleChange={(value) => handleInputChange('urlHandle', value)}
            />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            <ProductStatusSection
              status={formData.status}
              onChange={(status) => handleInputChange('status', status)}
            />

            <ProductOrganizationSection
              productType={formData.productType}
              vendor={formData.vendor}
              tags={formData.tags}
              onProductTypeChange={(productTypeId) => handleInputChange('productType', productTypeId)}
              onVendorChange={(vendorId) => handleInputChange('vendor', vendorId)}
              onTagsChange={(tags) => handleInputChange('tags', tags)}
              activeStoreId={activeStoreId}
            />

            <div className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-gray-900">Publishing</h2>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                  Online Store
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewProductPage;
