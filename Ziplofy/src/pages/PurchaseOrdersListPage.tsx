import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PurchaseOrdersTable from '../components/purchase-orders/PurchaseOrdersTable';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import { usePurchaseOrders } from '../contexts/purchase-order.context';
import { useStore } from '../contexts/store.context';

export default function PurchaseOrdersListPage() {
  const { activeStoreId } = useStore();
  const { purchaseOrders, fetchPurchaseOrdersByStore, loading, error } = usePurchaseOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeStoreId) {
      fetchPurchaseOrdersByStore(activeStoreId).catch(() => {});
    }
  }, [activeStoreId, fetchPurchaseOrdersByStore]);

  const handleCreatePurchaseOrder = useCallback(() => {
    navigate('/products/purchase-orders/new');
  }, [navigate]);

  const handleRowClick = useCallback((purchaseOrderId: string) => {
    navigate(`/products/purchase-orders/${purchaseOrderId}`);
  }, [navigate]);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-medium text-gray-900">Purchase Orders</h1>
            <button
              onClick={handleCreatePurchaseOrder}
              className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Create purchase order
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full w-4 h-4 border-2 border-gray-300 border-t-gray-900"></div>
            </div>
          )}

          {error && (
            <div className="mb-4 px-3 py-2 border border-red-200 bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!loading && (
            <div className="border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <PurchaseOrdersTable purchaseOrders={purchaseOrders} onRowClick={handleRowClick} />
              </div>
            </div>
          )}
        </div>
      </div>
    </GridBackgroundWrapper>
  );
}


