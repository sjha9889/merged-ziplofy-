import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStorefrontProducts } from '../contexts/product.context';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontProductVariants } from '../contexts/product-variant.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import AuthPopup from '../components/AuthPopup';
import { QuickBuyNowCheckoutModal, type BuyNowCheckoutLine } from '../components/QuickBuyNowCheckoutModal';
import { ProductCard } from '../components/ProductCard';
import { formatINR } from '../utils/currency';

const StorefrontProductDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    products,
    productDetail,
    productDetailLoading,
    productDetailError,
    fetchProductById,
    fetchProductsByStoreId,
    clearProductDetail,
  } = useStorefrontProducts();
  const { storeFrontMeta } = useStorefront();
  const { variants, loading: variantsLoading, fetchVariantsByProductId } = useStorefrontProductVariants();
  const { createCartEntry, getCartByCustomerId } = useStorefrontCart();
  const [buyNowModalOpen, setBuyNowModalOpen] = useState(false);
  const [buyNowLine, setBuyNowLine] = useState<BuyNowCheckoutLine | null>(null);
  const { user, checkAuth } = useStorefrontAuth();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [authPopupOpen, setAuthPopupOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<'description' | 'specification' | 'information' | null>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user?._id) {
      getCartByCustomerId(user._id).catch(() => {});
    }
  }, [user?._id, getCartByCustomerId]);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
    return () => clearProductDetail();
  }, [id, fetchProductById, clearProductDetail]);

  useEffect(() => {
    if (storeFrontMeta?.storeId && products.length === 0) {
      fetchProductsByStoreId({ storeId: storeFrontMeta.storeId, page: 1, limit: 24 }).catch(() => {});
    }
  }, [storeFrontMeta?.storeId, products.length, fetchProductsByStoreId]);

  const product = useMemo(
    () => productDetail ?? products.find(p => p._id === id),
    [productDetail, products, id]
  );

  useEffect(() => {
    if (id) {
      fetchVariantsByProductId(id);
    }
  }, [id, fetchVariantsByProductId]);

  useEffect(() => {
    if (variants && variants.length > 0) {
      const firstReal = variants.find(v => !v.isSynthetic) || variants[0];
      setSelectedVariantId(firstReal._id);
      const initOpts: Record<string, string> = {};
      const ov = (firstReal.optionValues || {}) as Record<string, string>;
      Object.keys(ov).forEach(k => { initOpts[k] = ov[k]; });
      setSelectedOptions(initOpts);
    } else {
      setSelectedVariantId(null);
      setSelectedOptions({});
    }
  }, [variants]);

  const optionAxes = useMemo(() => {
    const axes = new Map<string, Set<string>>();
    for (const v of variants) {
      const ov = (v.optionValues || {}) as Record<string, string>;
      for (const [k, val] of Object.entries(ov)) {
        if (!axes.has(k)) axes.set(k, new Set());
        axes.get(k)!.add(String(val));
      }
    }
    return Array.from(axes.entries()).map(([name, set]) => ({ name, values: Array.from(set) }));
  }, [variants]);

  const handleSelectOption = (optionName: string, value: string) => {
    const next = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(next);
    const match = variants.find(v => {
      const ov = (v.optionValues || {}) as Record<string, string>;
      return Object.entries(next).every(([k, val]) => !ov[k] || String(ov[k]) === String(val));
    }) || variants.find(v => {
      const ov = (v.optionValues || {}) as Record<string, string>;
      return Object.entries(next).every(([k, val]) => String(ov[k]) === String(val));
    });
    if (match) setSelectedVariantId(match._id);
  };

  const handleAddToCart = async () => {
    if (!storeFrontMeta?.storeId || !selectedVariantId) return;
    try {
      const selectedVariant = variants.find(v => v._id === selectedVariantId);
      await createCartEntry(
        { storeId: storeFrontMeta.storeId, productVariantId: selectedVariantId, quantity: 1 },
        selectedVariant // Pass variant for guest cart
      );
      // After a successful add, open the global cart drawer via a custom event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('open-cart-drawer'));
      }
    } catch {}
  };

  const handleBuyNow = () => {
    if (!selectedVariantId || !product) return;
    const selectedVariant = variants.find((v) => v._id === selectedVariantId);
    if (!selectedVariant) return;
    if (!user) {
      setAuthPopupOpen(true);
      return;
    }
    setBuyNowLine({
      variant: selectedVariant,
      quantity: 1,
      productTitle: product.title,
      productImage: product.imageUrls?.[0] ?? selectedVariant.images?.[0],
    });
    setBuyNowModalOpen(true);
  };

  if (productDetailLoading && !product) {
    return (
      <div className="min-h-screen bg-[#fefcf8] text-[#0c100c]">
        <div className="flex justify-center items-center py-32">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (productDetailError && !product) {
    return (
      <div className="min-h-screen bg-[#fefcf8] text-[#0c100c]">
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-24">
          <h2 className="text-lg text-red-600 text-center">{productDetailError}</h2>
          <div className="flex justify-center mt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border border-[#e8e0d5] hover:bg-[#f5f1e8] text-[#0c100c] transition-colors">
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fefcf8] text-[#0c100c]">
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-24">
          <h2 className="text-lg text-[#2b1e1e] text-center">Product not found</h2>
          <div className="flex justify-center mt-4">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border border-[#e8e0d5] hover:bg-[#f5f1e8] text-[#0c100c] transition-colors">
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = Array.isArray(product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls : ['https://via.placeholder.com/800x600?text=Product'];
  const relatedProducts = products.filter((p) => p._id !== product._id).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1394px] px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <nav className="text-[13px] text-[#4d4d4d]" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span className="mx-2 text-[#9a9a9a]">›</span>
          <span className="text-[#2f2f2f]">{product.category?.name || 'Products'}</span>
        </nav>

        <div className="mt-7 grid gap-9 lg:grid-cols-[1.05fr_1fr]">
          <section>
            <div className="overflow-hidden rounded-[12px] border border-[#d9d9d9] bg-white">
              <img
                src={images[currentImageIndex]}
                alt={product.title}
                className="h-[390px] w-full object-cover sm:h-[440px]"
              />
            </div>
            {images.length > 1 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-[92px] w-[92px] overflow-hidden rounded-[8px] border ${
                      currentImageIndex === index ? 'border-black' : 'border-[#d0d0d0]'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section>
            <h1 className="text-[26px] font-semibold leading-[1.12] text-[#101010]">{product.title}</h1>
            <p className="mt-2 text-[42px] font-medium leading-none text-[#101010]">{formatINR(product.price)}</p>
            <p className="mt-2 text-[15px] text-[#292929]">inclusive all taxes</p>

            {!variantsLoading && !(variants.length === 1 && variants[0]?.isSynthetic) && optionAxes.length > 0 ? (
              <div className="mt-6 space-y-4">
                {optionAxes.map((axis) => (
                  <div key={axis.name}>
                    <p className="mb-2 text-[13px] font-medium uppercase tracking-[0.08em] text-[#474747]">
                      {axis.name}: {selectedOptions[axis.name] || 'Select'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {axis.values.map((val) => (
                        <button
                          key={val}
                          type="button"
                          className={`rounded border px-4 py-1.5 text-[13px] ${
                            selectedOptions[axis.name] === val
                              ? 'border-black bg-black text-white'
                              : 'border-[#c8c8c8] bg-white text-black'
                          }`}
                          onClick={() => handleSelectOption(axis.name, val)}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="h-[58px] border border-[#9d9d9d] bg-white text-[16px] font-medium text-[#111] transition hover:bg-[#f8f8f8]"
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
              <button
                type="button"
                className="h-[58px] bg-black text-[16px] font-medium text-white transition hover:bg-[#1a1a1a]"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>

            <div className="mt-3 border border-[#cfcfcf] bg-[#efefef] px-6 py-4">
              <p className="text-lg leading-none text-[#1a1a1a]">Check Delivery Availability</p>
              <p className="mt-2 text-[16px] text-[#e0a03b]">Dispatched By 16 apr, Thursday</p>
              <p className="mt-1 text-[14px] text-[#333]">If ordered within 17 hrs 55 mins</p>
            </div>

            <div className="mt-5 grid grid-cols-5 gap-3 border-b border-[#d3d3d3] pb-4 text-[11px] leading-[1.3] text-[#2f2f2f]">
              <p>24 Months Warranty</p>
              <p>Free Shipping Countrywide</p>
              <p>Easy Return</p>
              <p>Pay on Delivery Available</p>
              <p>Service Across India</p>
            </div>

            {[
              { key: 'description' as const, label: 'Product Description' },
              { key: 'specification' as const, label: 'Product Specification' },
              { key: 'information' as const, label: 'More Information' },
            ].map((section) => {
              const isOpen = openAccordion === section.key;
              return (
                <div key={section.key} className="border-b border-[#d3d3d3]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-3.5 text-left text-[15px] font-medium text-[#171717]"
                    onClick={() => setOpenAccordion((prev) => (prev === section.key ? null : section.key))}
                    aria-expanded={isOpen}
                  >
                    <span>{section.label}</span>
                    <span className={`text-[20px] leading-none text-[#444] transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
                  </button>
                  {isOpen ? (
                    <div className="pb-4 text-[13px] leading-[1.6] text-[#4a4a4a]">
                      {section.key === 'description' ? (
                        <p>{product.description || 'No description available for this product yet.'}</p>
                      ) : section.key === 'specification' ? (
                        <ul className="space-y-1">
                          <li><strong>Brand:</strong> {product.vendor?.name || 'Swisswrist'}</li>
                          <li><strong>SKU:</strong> {product._id}</li>
                          <li><strong>Category:</strong> {product.category?.name || 'Watches'}</li>
                        </ul>
                      ) : (
                        <ul className="space-y-1">
                          <li><strong>Shipping:</strong> Free shipping countrywide.</li>
                          <li><strong>Returns:</strong> Easy return policy as per store terms.</li>
                          <li><strong>Support:</strong> Service assistance available across India.</li>
                        </ul>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </section>
        </div>

        {relatedProducts.length > 0 ? (
          <section className="mt-16">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel._id}
                  id={rel._id}
                  image={rel.imageUrls?.[0] || '/assets/img/watch-1.jpg'}
                  name={rel.title}
                  brand={rel.vendor?.name || 'Swisswrist'}
                  priceInPaisa={rel.price}
                />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <AuthPopup open={authPopupOpen} onClose={() => setAuthPopupOpen(false)} />
      <QuickBuyNowCheckoutModal
        open={buyNowModalOpen}
        onClose={() => {
          setBuyNowModalOpen(false);
          setBuyNowLine(null);
        }}
        line={buyNowLine}
      />

    </div>
  );
};

export default StorefrontProductDetailPage;
