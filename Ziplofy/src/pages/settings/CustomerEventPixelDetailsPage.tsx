import {
  ArrowLeftIcon,
  EllipsisHorizontalIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import DropdownMenu from '../../components/DropdownMenu';
import DropdownMenuItem from '../../components/DropdownMenuItem';
import PixelCodeSection from '../../components/PixelCodeSection';
import PixelDataSaleSection from '../../components/PixelDataSaleSection';
import PixelPermissionSection from '../../components/PixelPermissionSection';
import { DataSaleOption, usePixels } from '../../contexts/pixel.context';
import { useStore } from '../../contexts/store.context';

type PermissionMode = 'required' | 'not_required';

const CustomerEventPixelDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { pixelId } = useParams<{ pixelId: string }>();
  const { activeStoreId } = useStore();
  const { pixels, fetchByStoreId, loading, remove, update } = usePixels();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [name, setName] = useState('');
  const [permission, setPermission] = useState<PermissionMode>('required');
  const [purposes, setPurposes] = useState({ marketing: false, analytics: false, preferences: false });
  const [dataSale, setDataSale] = useState<DataSaleOption>('does_not_qualify_as_data_sale');
  const [code, setCode] = useState('');

  const pixel = useMemo(() => pixels.find((p) => p._id === pixelId), [pixels, pixelId]);

  useEffect(() => {
    if (activeStoreId) {
      if (!pixel) {
        fetchByStoreId(activeStoreId).catch((err) => {
          toast.error(err?.message || 'Failed to fetch pixel details');
        });
      }
    }
  }, [activeStoreId, pixel, fetchByStoreId]);

  useEffect(() => {
    if (pixel) {
      setName(pixel.pixelName ?? '');
      setPermission(pixel.required ? 'required' : 'not_required');
      setPurposes({
        marketing: !!pixel.marketing,
        analytics: !!pixel.analytics,
        preferences: !!pixel.preferences,
      });
      setDataSale(pixel.dataSale);
      setCode(pixel.code ?? '');
    }
  }, [pixel]);

  const handleDelete = useCallback(async () => {
    if (!pixel) return;
    try {
      await remove(pixel._id);
      toast.success('Pixel deleted');
      navigate('/settings/customer-events');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete pixel');
    }
  }, [pixel, remove, navigate]);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const handlePurposeChange = useCallback((key: 'marketing' | 'analytics' | 'preferences') => {
    setPurposes((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const isDirty = useMemo(() => {
    if (!pixel) return false;
    const trimmedName = name.trim();
    const originalName = pixel.pixelName ?? '';
    const originalPermission: PermissionMode = pixel.required ? 'required' : 'not_required';
    const originalPurposes = {
      marketing: !!pixel.marketing,
      analytics: !!pixel.analytics,
      preferences: !!pixel.preferences,
    };
    return (
      trimmedName !== originalName ||
      permission !== originalPermission ||
      originalPurposes.marketing !== purposes.marketing ||
      originalPurposes.analytics !== purposes.analytics ||
      originalPurposes.preferences !== purposes.preferences ||
      dataSale !== pixel.dataSale ||
      code !== (pixel.code ?? '')
    );
  }, [pixel, name, permission, purposes, dataSale, code]);

  const handleSave = useCallback(async () => {
    if (!pixel) return;
    try {
      const payload = {
        pixelName: name.trim(),
        required: permission === 'required',
        notRequired: permission === 'not_required',
        marketing: permission === 'required' ? purposes.marketing : false,
        analytics: permission === 'required' ? purposes.analytics : false,
        preferences: permission === 'required' ? purposes.preferences : false,
        dataSale,
        code,
      };
      await update(pixel._id, payload);
      toast.success('Pixel updated');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update pixel');
    }
  }, [pixel, name, permission, purposes, dataSale, code, update]);

  const handlePermissionChange = useCallback((value: PermissionMode) => {
    setPermission(value);
    if (value === 'not_required') {
      setPurposes({ marketing: false, analytics: false, preferences: false });
    }
  }, []);

  const handleDataSaleChange = useCallback((value: DataSaleOption) => {
    setDataSale(value);
  }, []);

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  const handleBack = useCallback(() => {
    navigate('/settings/customer-events');
  }, [navigate]);

  if (!pixelId) {
    return (
      <div className="w-full">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
          <button
            type="button"
            onClick={() => navigate('/settings/customer-events')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors w-fit"
          >
            Back to customer events
          </button>
          <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm max-w-[960px]">
            No pixel selected.
          </div>
        </div>
      </div>
    );
  }

  if (!activeStoreId) {
    return (
      <div className="w-full">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
          <button
            type="button"
            onClick={() => navigate('/settings/customer-events')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors w-fit"
          >
            Back to customer events
          </button>
          <div className="rounded-lg bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 text-sm max-w-[960px]">
            Select a store to view pixel details.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
        <div className="max-w-[960px] w-full">
          {loading && !pixel ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading pixel…</p>
            </div>
          ) : !pixel ? (
            <>
              <header className="flex items-start gap-3 mb-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="mt-0.5 inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
                  aria-label="Back to customer events"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pixel not found</h1>
                  <p className="mt-1 text-sm text-gray-500">This pixel may have been deleted.</p>
                </div>
              </header>
              <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm">
                Pixel not found or no longer exists.
              </div>
            </>
          ) : (
            <>
              <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="mt-0.5 inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
                    aria-label="Back to customer events"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                  </button>
                  <div className="min-w-0">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                      {name.trim() || 'Pixel'}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage customer event pixel settings and code.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {isDirty && (
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={loading}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Save
                    </button>
                  )}
                  <button
                    type="button"
                    disabled
                    className="rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Test
                  </button>
                  <button
                    type="button"
                    disabled
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Connect
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleMenuOpen}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200 bg-white"
                      aria-label="Pixel options"
                    >
                      <EllipsisHorizontalIcon className="w-5 h-5" />
                    </button>
                    <DropdownMenu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                      <DropdownMenuItem disabled>Edit pixel name</DropdownMenuItem>
                      <DropdownMenuItem disabled>Hire a Shopify Partner</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { handleMenuClose(); handleDelete(); }}>
                        <span className="text-red-600">Delete pixel</span>
                      </DropdownMenuItem>
                    </DropdownMenu>
                  </div>
                </div>
              </header>

              <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5">
                <h2 className="text-base font-semibold text-gray-900">Pixel details</h2>
                <p className="mt-1 text-sm text-gray-500 mb-4">
                  Name and sandbox info for this pixel.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pixel name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    placeholder="e.g. Facebook Pixel"
                    className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  For enhanced security and stability, pixel access is sandboxed.{' '}
                  <LinkLabel text="Learn more" href="#" />
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 flex items-start gap-2">
                <InformationCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">For enhanced security and stability, pixel access is sandboxed.</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Customer privacy</h2>
                <div className="space-y-4">
                  <PixelPermissionSection
                    permission={permission}
                    purposes={purposes}
                    onPermissionChange={handlePermissionChange}
                    onPurposeChange={handlePurposeChange}
                  />
                  <PixelDataSaleSection
                    dataSale={dataSale}
                    onDataSaleChange={handleDataSaleChange}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  See how these settings apply to your store in{' '}
                  <LinkLabel text="Customer privacy" href="#" />
                </p>
              </div>

              <PixelCodeSection
                code={code}
                onCodeChange={handleCodeChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const LinkLabel: React.FC<{ text: string; href: string }> = ({ text, href }) => (
  <a
    href={href}
    className="text-blue-600 hover:text-blue-700 hover:underline"
  >
    {text}
  </a>
);

export default CustomerEventPixelDetailsPage;
