import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddOptionValuesModal from '../components/AddOptionValuesModal';
import AddProductVariantsModal from '../components/AddProductVariantsModal';
import ConfirmDeleteVariantModal from '../components/ConfirmDeleteVariantModal';
import DeleteVariantDimensionModal from '../components/DeleteVariantDimensionModal';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
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

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addVariantsToProduct, deleteVariantFromProduct, addOptionToProduct } = useProducts();
  const { fetchVariantsByProductId, variants, loading } = useProductVariants();

  const product = useMemo(() => products.find(p => p._id === id), [products, id]);

  // UI-only: Add Variants dialog state and handlers (replicated from NewProductPage)
  const [addVariantsOpen, setAddVariantsOpen] = useState(false);
  const [variantsForm, setVariantsForm] = useState<Array<{ optionName: string; values: string[] }>>([
    { optionName: '', values: [''] }
  ]);

  // Delete Variants dialog state and handlers
  const [deleteVariantOpen, setDeleteVariantOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState('');
  const [deletingVariant, setDeletingVariant] = useState(false);

  // Add Option in Variant dialog state and handlers
  const [addOptionOpen, setAddOptionOpen] = useState(false);
  const [selectedOptionName, setSelectedOptionName] = useState('');
  const [newOptionValues, setNewOptionValues] = useState<string[]>(['']);
  const [submittingOption, setSubmittingOption] = useState(false);
  
  const handleOpenAddVariants = useCallback(() => {
    setAddVariantsOpen(true);
  }, []);

  const handleCloseAddVariants = useCallback(() => {
    setAddVariantsOpen(false);
    setVariantsForm([{ optionName: '', values: [''] }]);
  }, []);

  // Delete Variants handlers
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

  // Add Option in Variant handlers
  const handleOpenAddOption = useCallback(() => {
    setAddOptionOpen(true);
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
      // Refresh variants after deletion
      await fetchVariantsByProductId(product._id);
      handleCloseConfirmDelete();
    } catch (error) {
      console.error('Failed to delete variant dimension:', error);
    } finally {
      setDeletingVariant(false);
    }
  }, [product, selectedDimension, deleteVariantFromProduct, fetchVariantsByProductId, handleCloseConfirmDelete]);

  const addVariantRow = useCallback(() => {
    setVariantsForm(prev => [...prev, { optionName: '', values: [''] }]);
  }, []);

  const removeVariantRow = useCallback((index: number) => {
    setVariantsForm(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateVariantOptionName = useCallback((index: number, optionName: string) => {
    setVariantsForm(prev => prev.map((v, i) => (i === index ? { ...v, optionName } : v)));
  }, []);

  const addVariantValue = useCallback((variantIndex: number) => {
    setVariantsForm(prev => prev.map((v, i) => (
      i === variantIndex ? { ...v, values: [...v.values, ''] } : v
    )));
  }, []);

  const removeVariantValue = useCallback((variantIndex: number, valueIndex: number) => {
    setVariantsForm(prev => prev.map((v, i) => (
      i === variantIndex ? { ...v, values: v.values.filter((_, j) => j !== valueIndex) } : v
    )));
  }, []);

  const updateVariantValue = useCallback((variantIndex: number, valueIndex: number, value: string) => {
    setVariantsForm(prev => prev.map((v, i) => (
      i === variantIndex
        ? { ...v, values: v.values.map((val, j) => (j === valueIndex ? value : val)) }
        : v
    )));
  }, []);

  const [submittingVariants, setSubmittingVariants] = useState(false);
  
  const handleSubmitAddVariants = useCallback(async () => {
    if (!id) return;
    const payload = variantsForm
      .map(v => ({ optionName: v.optionName.trim(), values: v.values.map(val => val.trim()).filter(Boolean) }))
      .filter(v => v.optionName && v.values.length > 0);
    if (payload.length === 0) return;
    try {
      setSubmittingVariants(true);
      await addVariantsToProduct(id, payload);
      handleCloseAddVariants();
      // refresh variants list
      fetchVariantsByProductId(id);
    } catch (e) {
      // noop; errors handled by context
    } finally {
      setSubmittingVariants(false);
    }
  }, [id, variantsForm, addVariantsToProduct, fetchVariantsByProductId, handleCloseAddVariants]);

  const handleSubmitAddOption = useCallback(async () => {
    if (!id || !selectedOptionName) return;
    const validValues = newOptionValues.filter(val => val.trim().length > 0);
    if (validValues.length === 0) return;
    
    try {
      setSubmittingOption(true);
      
      console.log('Calling addOptionToProduct with:', {
        productId: id,
        optionName: selectedOptionName,
        values: validValues
      });
      
      await addOptionToProduct(id, selectedOptionName, validValues);
      
      console.log('Successfully added option values');
      handleCloseAddOption();
      // refresh variants list
      fetchVariantsByProductId(id);
    } catch (e) {
      console.error('Error adding option values:', e);
      // noop; errors handled by context
    } finally {
      setSubmittingOption(false);
    }
  }, [id, selectedOptionName, newOptionValues, addOptionToProduct, fetchVariantsByProductId, handleCloseAddOption]);

  const updateNewOptionValue = useCallback((index: number, value: string) => {
    setNewOptionValues(prev => {
      const newValues = [...prev];
      newValues[index] = value;
      return newValues;
    });
  }, []);

  const addNewOptionValue = useCallback(() => {
    setNewOptionValues(prev => [...prev, '']);
  }, []);

  const removeNewOptionValue = useCallback((index: number) => {
    setNewOptionValues(prev => {
      const newValues = prev.filter((_, i) => i !== index);
      return newValues.length > 0 ? newValues : [''];
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
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto pt-6 px-4 pb-6">
          {/* Simple Header */}
          <ProductDetailsHeader
            product={product}
            variantsCount={variants.length}
            onAddVariants={handleOpenAddVariants}
            onDeleteVariant={handleOpenDeleteVariant}
            onAddOption={handleOpenAddOption}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Images Gallery */}
              <ProductImagesGallery imageUrls={product.imageUrls || []} />
              
              {/* Basic Information */}
              <ProductBasicInformation product={product} />

              {/* Pricing */}
              <ProductPricing product={product} />

              {/* Organization */}
              <ProductOrganization product={product} />

              {/* Shipping Information */}
              <ProductShippingInformation product={product} />

              {/* Product Options */}
              <ProductOptions product={product} />

              {/* Variants */}
              <ProductVariantsList
                variants={variants}
                productId={id || ''}
                loading={loading}
              />
            </div>
            
            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <ProductStatusDetails product={product} />
            </div>
          </div>
        </div>
      {/* Add Variants Dialog - UI only (replica of NewProductPage variant UI) */}
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

      {/* Delete Variant Modal */}
      <DeleteVariantDimensionModal
        isOpen={deleteVariantOpen}
        product={product}
        selectedDimension={selectedDimension}
        onClose={handleCloseDeleteVariant}
        onContinue={handleOpenConfirmDelete}
        onDimensionChange={setSelectedDimension}
      />

      {/* Confirmation Modal */}
      <ConfirmDeleteVariantModal
        isOpen={confirmDeleteOpen}
        selectedDimension={selectedDimension}
        deletingVariant={deletingVariant}
        onClose={handleCloseConfirmDelete}
        onConfirm={handleConfirmDelete}
      />

      {/* Add Option in Variant Dialog */}
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
      </div>
    </GridBackgroundWrapper>
  );
};

export default ProductDetailsPage;


