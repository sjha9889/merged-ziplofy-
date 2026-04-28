import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddOptionValuesModal from '../components/AddOptionValuesModal';
import AddProductVariantsModal from '../components/AddProductVariantsModal';
import ConfirmDeleteVariantModal from '../components/ConfirmDeleteVariantModal';
import ConfirmDeleteProductModal from '../components/ConfirmDeleteProductModal';
import DeleteVariantDimensionModal from '../components/DeleteVariantDimensionModal';
import ProductBasicInformation from '../components/ProductBasicInformation';
import ProductDetailsHeader from '../components/ProductDetailsHeader';
import ProductImagesGallery from '../components/ProductImagesGallery';
import ProductNotFound from '../components/ProductNotFound';
import ProductOptions from '../components/ProductOptions';
import ProductOrganization from '../components/ProductOrganization';
import ProductPricing from '../components/ProductPricing';
import ProductShippingInformation from '../components/ProductShippingInformation';
import ProductStatusDetails from '../components/ProductStatusDetails';
import ProductVariantsList from '../components/ProductVariantsList';
import { useProductVariants } from '../contexts/product-variant.context';
import { useProducts } from '../contexts/product.context';
import { useStore } from '../contexts/store.context';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { products, addVariantsToProduct, deleteVariantFromProduct, addOptionToProduct, deleteProduct, fetchProductsByStoreId } =
    useProducts();
  const navigate = useNavigate();
  const { activeStoreId } = useStore();
  const { fetchVariantsByProductId, variants, loading } = useProductVariants();

  const product = useMemo(() => products.find((p) => p._id === id), [products, id]);

  useEffect(() => {
    if (activeStoreId && id && products.length === 0) {
      fetchProductsByStoreId(activeStoreId);
    }
  }, [activeStoreId, id, products.length, fetchProductsByStoreId]);

  const [addVariantsOpen, setAddVariantsOpen] = useState(false);
  const [variantsForm, setVariantsForm] = useState<Array<{ optionName: string; values: string[] }>>([
    { optionName: '', values: [''] },
  ]);

  const [deleteVariantOpen, setDeleteVariantOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState('');
  const [deletingVariant, setDeletingVariant] = useState(false);

  const [addOptionOpen, setAddOptionOpen] = useState(false);
  const [selectedOptionName, setSelectedOptionName] = useState('');
  const [newOptionValues, setNewOptionValues] = useState<string[]>(['']);
  const [submittingOption, setSubmittingOption] = useState(false);
  const [deleteProductOpen, setDeleteProductOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);

  const handleOpenAddVariants = useCallback(() => {
    setAddVariantsOpen(true);
  }, []);

  const handleCloseAddVariants = useCallback(() => {
    setAddVariantsOpen(false);
    setVariantsForm([{ optionName: '', values: [''] }]);
  }, []);

  const handleOpenDeleteVariant = useCallback(() => {
    setDeleteVariantOpen(true);
  }, []);

  const handleCloseDeleteVariant = useCallback(() => {
    setDeleteVariantOpen(false);
    setSelectedDimension('');
  }, []);

  const handleOpenConfirmDelete = useCallback(() => {
    if (selectedDimension) {
      setDeleteVariantOpen(false);
      setConfirmDeleteOpen(true);
    }
  }, [selectedDimension]);

  const handleCloseConfirmDelete = useCallback(() => {
    setConfirmDeleteOpen(false);
    setSelectedDimension('');
  }, []);

  const handleOpenAddOption = useCallback(() => {
    setAddOptionOpen(true);
  }, []);

  const handleOpenDeleteProduct = useCallback(() => {
    setDeleteProductOpen(true);
  }, []);

  const handleCloseDeleteProduct = useCallback(() => {
    setDeleteProductOpen(false);
  }, []);

  const handleCloseAddOption = useCallback(() => {
    setAddOptionOpen(false);
    setSelectedOptionName('');
    setNewOptionValues(['']);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!product || !selectedDimension) return;

    try {
      setDeletingVariant(true);
      await deleteVariantFromProduct(product._id, selectedDimension);
      await fetchVariantsByProductId(product._id);
      handleCloseConfirmDelete();
    } catch (error) {
      console.error('Failed to delete variant dimension:', error);
    } finally {
      setDeletingVariant(false);
    }
  }, [product, selectedDimension, deleteVariantFromProduct, fetchVariantsByProductId, handleCloseConfirmDelete]);

  const addVariantRow = useCallback(() => {
    setVariantsForm((prev) => [...prev, { optionName: '', values: [''] }]);
  }, []);

  const removeVariantRow = useCallback((index: number) => {
    setVariantsForm((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateVariantOptionName = useCallback((index: number, optionName: string) => {
    setVariantsForm((prev) => prev.map((v, i) => (i === index ? { ...v, optionName } : v)));
  }, []);

  const addVariantValue = useCallback((variantIndex: number) => {
    setVariantsForm((prev) =>
      prev.map((v, i) => (i === variantIndex ? { ...v, values: [...v.values, ''] } : v))
    );
  }, []);

  const removeVariantValue = useCallback((variantIndex: number, valueIndex: number) => {
    setVariantsForm((prev) =>
      prev.map((v, i) =>
        i === variantIndex ? { ...v, values: v.values.filter((_, j) => j !== valueIndex) } : v
      )
    );
  }, []);

  const updateVariantValue = useCallback((variantIndex: number, valueIndex: number, value: string) => {
    setVariantsForm((prev) =>
      prev.map((v, i) =>
        i === variantIndex
          ? { ...v, values: v.values.map((val, j) => (j === valueIndex ? value : val)) }
          : v
      )
    );
  }, []);

  const [submittingVariants, setSubmittingVariants] = useState(false);

  const handleSubmitAddVariants = useCallback(async () => {
    if (!id) return;
    const payload = variantsForm
      .map((v) => ({
        optionName: v.optionName.trim(),
        values: v.values.map((val) => val.trim()).filter(Boolean),
      }))
      .filter((v) => v.optionName && v.values.length > 0);
    if (payload.length === 0) return;
    try {
      setSubmittingVariants(true);
      await addVariantsToProduct(id, payload);
      handleCloseAddVariants();
      fetchVariantsByProductId(id);
    } catch {
      // errors from context
    } finally {
      setSubmittingVariants(false);
    }
  }, [id, variantsForm, addVariantsToProduct, fetchVariantsByProductId, handleCloseAddVariants]);

  const handleSubmitAddOption = useCallback(async () => {
    if (!id || !selectedOptionName) return;
    const validValues = newOptionValues.filter((val) => val.trim().length > 0);
    if (validValues.length === 0) return;

    try {
      setSubmittingOption(true);
      await addOptionToProduct(id, selectedOptionName, validValues);
      handleCloseAddOption();
      fetchVariantsByProductId(id);
    } catch (e) {
      console.error('Error adding option values:', e);
    } finally {
      setSubmittingOption(false);
    }
  }, [id, selectedOptionName, newOptionValues, addOptionToProduct, fetchVariantsByProductId, handleCloseAddOption]);

  const handleConfirmDeleteProduct = useCallback(async () => {
    if (!product) return;
    try {
      setDeletingProduct(true);
      await deleteProduct(product._id);
      setDeleteProductOpen(false);
      navigate('/products');
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setDeletingProduct(false);
    }
  }, [product, deleteProduct, navigate]);

  const updateNewOptionValue = useCallback((index: number, value: string) => {
    setNewOptionValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const addNewOptionValue = useCallback(() => {
    setNewOptionValues((prev) => [...prev, '']);
  }, []);

  const removeNewOptionValue = useCallback((index: number) => {
    setNewOptionValues((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [''];
    });
  }, []);

  useEffect(() => {
    if (id) {
      fetchVariantsByProductId(id);
    }
  }, [id, fetchVariantsByProductId]);

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8">
        <ProductDetailsHeader
          product={product}
          variantsCount={variants.length}
          onAddVariants={handleOpenAddVariants}
          onDeleteVariant={handleOpenDeleteVariant}
          onAddOption={handleOpenAddOption}
          onDeleteProduct={handleOpenDeleteProduct}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6 xl:col-span-2">
            <ProductImagesGallery imageUrls={product.imageUrls || []} />
            <ProductBasicInformation product={product} />
            <ProductPricing product={product} />
            <ProductOrganization product={product} />
            <ProductShippingInformation product={product} />
            <ProductOptions product={product} />
            <ProductVariantsList variants={variants} productId={id || ''} loading={loading} />
          </div>

          <div className="xl:col-span-1">
            <div className="xl:sticky xl:top-6">
              <ProductStatusDetails product={product} />
            </div>
          </div>
        </div>
      </div>

      <AddProductVariantsModal
        isOpen={addVariantsOpen}
        variantsForm={variantsForm}
        submittingVariants={submittingVariants}
        onClose={handleCloseAddVariants}
        onSubmit={handleSubmitAddVariants}
        onAddVariantRow={addVariantRow}
        onRemoveVariantRow={removeVariantRow}
        onUpdateVariantOptionName={updateVariantOptionName}
        onAddVariantValue={addVariantValue}
        onRemoveVariantValue={removeVariantValue}
        onUpdateVariantValue={updateVariantValue}
      />

      <DeleteVariantDimensionModal
        isOpen={deleteVariantOpen}
        product={product}
        selectedDimension={selectedDimension}
        onClose={handleCloseDeleteVariant}
        onContinue={handleOpenConfirmDelete}
        onDimensionChange={setSelectedDimension}
      />

      <ConfirmDeleteVariantModal
        isOpen={confirmDeleteOpen}
        selectedDimension={selectedDimension}
        deletingVariant={deletingVariant}
        onClose={handleCloseConfirmDelete}
        onConfirm={handleConfirmDelete}
      />

      <AddOptionValuesModal
        isOpen={addOptionOpen}
        product={product}
        selectedOptionName={selectedOptionName}
        newOptionValues={newOptionValues}
        submittingOption={submittingOption}
        onClose={handleCloseAddOption}
        onSubmit={handleSubmitAddOption}
        onOptionNameChange={setSelectedOptionName}
        onUpdateNewOptionValue={updateNewOptionValue}
        onAddNewOptionValue={addNewOptionValue}
        onRemoveNewOptionValue={removeNewOptionValue}
      />

      <ConfirmDeleteProductModal
        isOpen={deleteProductOpen}
        productTitle={product.title}
        deletingProduct={deletingProduct}
        onClose={handleCloseDeleteProduct}
        onConfirm={handleConfirmDeleteProduct}
      />
    </div>
  );
};

export default ProductDetailsPage;
