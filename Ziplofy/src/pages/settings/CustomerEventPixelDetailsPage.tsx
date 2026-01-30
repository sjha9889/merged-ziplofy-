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
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
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
      <GridBackgroundWrapper>
        <div className="max-w-[960px] mx-auto py-8 px-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
            No pixel selected.
          </div>
        </div>
      </GridBackgroundWrapper>
    );
  }

  if (!activeStoreId) {
    return (
      <GridBackgroundWrapper>
        <div className="max-w-[960px] mx-auto py-8 px-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md">
            Select a store to view pixel details.
          </div>
        </div>
      </GridBackgroundWrapper>
    );
  }

  return (
    <GridBackgroundWrapper>
      <div className="max-w-[960px] mx-auto py-8 px-4">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to pixels</span>
      </button>

      {loading && !pixel ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !pixel ? (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
          Pixel not found or no longer exists.
        </div>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex-1 w-full space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                placeholder="Pixel name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-600">
                For enhanced security and stability, pixel access is sandboxed.{' '}
                <LinkLabel text="Learn more" href="#" />
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isDirty && (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  Save
                </button>
              )}
              <button
                disabled
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Test
              </button>
              <button
                disabled
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Connect
              </button>
              <div className="relative">
                <button
                  onClick={handleMenuOpen}
                  className="p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
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
          </div>

          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mt-6 flex items-start gap-2">
            <InformationCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">For enhanced security and stability, pixel access is sandboxed.</p>
          </div>

          <div className="border border-gray-300 rounded-xl mt-6 p-6">
            <h2 className="text-lg font-semibold mb-4">Customer privacy</h2>
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
            <p className="text-sm text-gray-600 mt-4">
              See how these settings apply to your store in{' '}
              <LinkLabel text="Customer privacy" href="#" />
            </p>
          </div>

          <PixelCodeSection
            code={code}
            onCodeChange={handleCodeChange}
          />
        </div>
      )}
      </div>
    </GridBackgroundWrapper>
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
