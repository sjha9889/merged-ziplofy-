import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  EllipsisVerticalIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import { useCountries } from '../../contexts/country.context';
import { useMarketIncludes } from '../../contexts/market-includes.context';
import { useMarkets } from '../../contexts/market.context';
import { useStore } from '../../contexts/store.context';

const MarketDetailsPage: React.FC = () => {
  const { marketId } = useParams<{ marketId: string }>();
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [status, setStatus] = React.useState<'active' | 'draft'>('active');
  const [parentMarketId, setParentMarketId] = React.useState<string | null>(null);
  const { countries, getCountries, loading: countriesLoading } = useCountries();
  const { createItem: createMarketInclude, deleteItem: deleteMarketInclude, getByMarketId: getMarketIncludes, items: marketIncludes, loading: marketIncludesLoading } = useMarketIncludes();
  const { deleteMarket, updateMarket } = useMarkets();
  const { markets, getByStoreId } = useMarkets();
  const { activeStoreId } = useStore();
  const [isIncludesModalOpen, setIncludesModalOpen] = React.useState(false);
  const [selectedCountryId, setSelectedCountryId] = React.useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [isDeleteIncludeModalOpen, setDeleteIncludeModalOpen] = React.useState(false);
  const [includeToDelete, setIncludeToDelete] = React.useState<{ id: string; countryName: string } | null>(null);
  const [editingName, setEditingName] = React.useState(false);
  const [nameInput, setNameInput] = React.useState('');
  const [savingName, setSavingName] = React.useState(false);
  const [editingStatus, setEditingStatus] = React.useState(false);
  const [statusInput, setStatusInput] = React.useState<'active' | 'draft'>('active');
  const [savingStatus, setSavingStatus] = React.useState(false);
  const [isCountrySelectOpen, setIsCountrySelectOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const openDeleteModal = () => { setDeleteModalOpen(true); setIsMenuOpen(false); };
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const openIncludesModal = () => {
    setIncludesModalOpen(true);
    getCountries({ limit: 250 }).catch(() => {});
  };
  const closeIncludesModal = () => {
    setIncludesModalOpen(false);
    setSelectedCountryId('');
  };

  // Fetch includes for this market
  React.useEffect(() => {
    if (marketId) {
      getMarketIncludes(marketId).catch(() => {});
    }
  }, [marketId, getMarketIncludes]);

  // Ensure markets are loaded and hydrate local fields from selected market
  const selectedMarket = React.useMemo(() => markets.find(m => m._id === marketId), [markets, marketId]);

  React.useEffect(() => {
    if (!selectedMarket && activeStoreId) {
      getByStoreId(activeStoreId).catch(() => {});
    }
  }, [selectedMarket, activeStoreId, getByStoreId]);

  React.useEffect(() => {
    if (selectedMarket) {
      setName(selectedMarket.name);
      setNameInput(selectedMarket.name);
      setStatus(selectedMarket.status);
      setStatusInput(selectedMarket.status);
      // @ts-ignore optional field if present later
      setParentMarketId((selectedMarket as any).parentMarketId ?? null);
    }
  }, [selectedMarket]);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/markets')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 inline mr-1" />
                Markets
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Heading row */}
              <div className="flex items-center gap-2 flex-wrap">
                {!editingName ? (
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-xl font-medium text-gray-900">{name}</h1>
                    <button
                      onClick={() => setEditingName(true)}
                      className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label="Edit name"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="px-3 py-1.5 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                    />
                    <button
                      disabled={savingName || !marketId || !nameInput.trim()}
                      onClick={async () => {
                        if (!marketId || !nameInput.trim()) return;
                        try {
                          setSavingName(true);
                          const updated = await updateMarket(marketId, { name: nameInput.trim() } as any);
                          setName(updated.name);
                          setEditingName(false);
                        } finally {
                          setSavingName(false);
                        }
                      }}
                      className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {savingName ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setNameInput(name);
                        setEditingName(false);
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">Region</span>
                <span className={`px-2 py-0.5 text-xs font-medium ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {status === 'active' ? 'Active' : 'Draft'}
                </span>
                <div className="flex-1" />
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="px-3 py-1.5 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    More actions
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 shadow-lg z-10">
                      <button
                        onClick={openDeleteModal}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        Delete market
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Card */}
              <div className="border border-gray-200 p-4">
                <h2 className="text-base font-medium text-gray-900 mb-3">Status</h2>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 flex-1">{name}</span>
                  {!editingStatus ? (
                    <div className="flex items-center gap-2">
                      {status === 'active' ? (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">Draft</span>
                      )}
                      <button
                        onClick={() => setEditingStatus(true)}
                        className="px-2 py-1 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <select
                          value={statusInput}
                          onChange={(e) => setStatusInput(e.target.value as 'active' | 'draft')}
                          className="px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        >
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                      <button
                        disabled={savingStatus || !marketId}
                        onClick={async () => {
                          if (!marketId) return;
                          try {
                            setSavingStatus(true);
                            const updated = await updateMarket(marketId, { status: statusInput } as any);
                            setStatus(updated.status);
                            setEditingStatus(false);
                          } finally {
                            setSavingStatus(false);
                          }
                        }}
                        className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {savingStatus ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => { setStatusInput(status); setEditingStatus(false); }}
                        className="px-2 py-1 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Includes Section */}
                <div className="border border-gray-200 p-3">
                  <h3 className="text-base font-medium text-gray-900 mb-2">Includes</h3>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {marketIncludesLoading && (
                      <span className="text-sm text-gray-600">Loading...</span>
                    )}
                    {!marketIncludesLoading && marketIncludes.map((inc) => {
                      const populated = typeof (inc as any).countryId === 'object' && (inc as any).countryId !== null;
                      const country = populated ? (inc as any).countryId : countries.find(c => c._id === inc.countryId);
                      const label = country ? `${country.name} (${country.iso2})` : (typeof inc.countryId === 'string' ? inc.countryId : '');
                      return (
                        <div
                          key={inc._id}
                          className="inline-flex items-center gap-1.5 bg-gray-100 px-2 py-1"
                        >
                          <span className="text-sm text-gray-700">{label}</span>
                          <button
                            onClick={() => {
                              setIncludeToDelete({ id: inc._id, countryName: country ? country.name : label });
                              setDeleteIncludeModalOpen(true);
                            }}
                            className="p-0.5 text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <XMarkIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={openIncludesModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add condition
                  </button>
                </div>
              </div>

              {/* Customized */}
              <div className="border border-gray-200 p-4">
                <h2 className="text-base font-medium text-gray-900 mb-1">Customized</h2>
                <p className="text-sm text-gray-600">Create unique configurations for customers in this market</p>
              </div>

              {/* Inherited */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Inherited</h3>
                <div className="border border-gray-200">
                  {[
                    ['Currency', '→ Indian Rupee (INR ₹)'],
                    ['Catalogs', '→ All products'],
                    ['Domain / language', '→ example.myshopify.com • English'],
                    ['Taxes and duties', '→ Not collecting'],
                    ['Online Store', '→ Horizon'],
                  ].map((row, i) => (
                    <React.Fragment key={row[0]}>
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900 w-40">{row[0]}</span>
                          <span className="text-sm text-gray-600">{row[1]}</span>
                        </div>
                        <button className="p-1 text-gray-600 hover:text-gray-900 transition-colors">
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                      {i < 4 && <div className="border-t border-gray-200" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="border border-gray-200 p-4 min-h-[200px]">
                <div className="w-full h-40 bg-gray-100" />
              </div>

              <div className="border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Parent market</h3>
                <div className="bg-gray-100 px-3 py-2 text-sm text-gray-700">
                  {parentMarketId ? parentMarketId : 'Store default'}
                </div>
              </div>

              <div className="border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">More Settings for {name}</h3>
                <div className="border border-gray-200 p-3 mb-2">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Shipping</h4>
                  <p className="text-xs text-gray-600">1 rate • Shipping to India</p>
                </div>
                <div className="border border-gray-200 p-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Customer privacy</h4>
                  <p className="text-xs text-gray-600">Cookie banner, Data sharing opt-out</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add condition modal */}
        {isIncludesModalOpen && (
          <>
            <div
              className="fixed inset-0 bg-gray-500/20 z-[1400]"
              onClick={closeIncludesModal}
            />
            <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 pointer-events-none">
              <div
                className="bg-white w-full max-w-md border border-gray-200 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-base font-medium text-gray-900">Select a country to include</h2>
                  <button
                    onClick={closeIncludesModal}
                    className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="px-4 py-4">
                  <div className="relative">
                    <label className="block text-xs text-gray-600 mb-1.5">Country</label>
                    <div className="relative">
                      <select
                        value={selectedCountryId}
                        onChange={(e) => setSelectedCountryId(e.target.value)}
                        disabled={countriesLoading}
                        className="w-full px-3 py-1.5 text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-50"
                      >
                        <option value="">Select a country</option>
                        {countries.map((c) => (
                          <option key={c._id} value={c._id}>{`${c.name} (${c.iso2})`}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
                  <button
                    onClick={closeIncludesModal}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedCountryId || !marketId}
                    onClick={async () => {
                      if (!marketId || !selectedCountryId) return;
                      await createMarketInclude({ marketId, countryId: selectedCountryId });
                      closeIncludesModal();
                    }}
                    className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete include modal */}
        {isDeleteIncludeModalOpen && (
          <>
            <div
              className="fixed inset-0 bg-gray-500/20 z-[1400]"
              onClick={() => setDeleteIncludeModalOpen(false)}
            />
            <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 pointer-events-none">
              <div
                className="bg-white w-full max-w-xs border border-gray-200 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-base font-medium text-gray-900">{`Remove country from ${name}`}</h2>
                </div>
                <div className="px-4 py-4">
                  <p className="text-sm text-gray-600">
                    {`You really want to delete ${includeToDelete?.countryName ?? 'this country'} from ${name}?`}
                  </p>
                </div>
                <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
                  <button
                    onClick={() => setDeleteIncludeModalOpen(false)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    No
                  </button>
                  <button
                    disabled={!includeToDelete}
                    onClick={async () => {
                      if (!includeToDelete) return;
                      await deleteMarketInclude(includeToDelete.id);
                      setDeleteIncludeModalOpen(false);
                      setIncludeToDelete(null);
                    }}
                    className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete market modal */}
        {isDeleteModalOpen && (
          <>
            <div
              className="fixed inset-0 bg-gray-500/20 z-[1400]"
              onClick={closeDeleteModal}
            />
            <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 pointer-events-none">
              <div
                className="bg-white w-full max-w-xs border border-gray-200 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="text-base font-medium text-gray-900">{`Delete ${name}?`}</h2>
                </div>
                <div className="px-4 py-4">
                  <p className="text-sm text-gray-600">{`Your market ${name} will be permanently deleted.`}</p>
                </div>
                <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
                  <button
                    onClick={closeDeleteModal}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!marketId) return;
                      await deleteMarket(marketId);
                      navigate('/markets');
                    }}
                    className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </GridBackgroundWrapper>
  );
};

export default MarketDetailsPage;
