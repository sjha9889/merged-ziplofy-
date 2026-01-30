import { CubeIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import TransfersPageHeader from '../components/TransfersPageHeader';
import { useStore } from '../contexts/store.context';
import { useTransfers } from '../contexts/transfer.context';

const TransfersPage: React.FC = () => {
  const navigate = useNavigate();
  const { fetchTransfersByStoreId, transfers, loading } = useTransfers();
  const { activeStoreId } = useStore();

  useEffect(() => {
    if (activeStoreId) {
      fetchTransfersByStoreId(activeStoreId).catch(() => {});
    }
  }, [activeStoreId, fetchTransfersByStoreId]);

  const handleRowClick = useCallback((transferId: string) => {
    navigate(`/products/transfers/${transferId}`);
  }, [navigate]);

  const handleCreateTransfer = useCallback(() => {
    navigate('/products/transfers/new');
  }, [navigate]);

  const getStatusStyles = useCallback((status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'ready_to_ship':
        return 'bg-gray-100 text-gray-700';
      case 'in_progress':
        return 'bg-gray-100 text-gray-700';
      case 'transferred':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }, []);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Header Section */}
        <TransfersPageHeader onCreateTransfer={handleCreateTransfer} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {loading && (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full w-4 h-4 border-2 border-gray-300 border-t-gray-900 mx-auto"></div>
            </div>
          )}
          
          {!loading && transfers.length === 0 && (
            <div className="border border-gray-200 p-8 text-center">
              <CubeIcon className="w-8 h-8 text-gray-400 mb-2 mx-auto" />
              <h2 className="text-sm font-medium mb-1 text-gray-900">
                No transfers yet
              </h2>
              <p className="text-xs text-gray-600 mb-3 max-w-md mx-auto">
                Start by creating your first transfer to move products between locations and keep your inventory organized.
              </p>
              <button
                onClick={handleCreateTransfer}
                className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Create Your First Transfer
              </button>
            </div>
          )}
          
          {transfers.length > 0 && (
            <div className="border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                        Transfer ID
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                        Reference
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                        Origin
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                        Destination
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                        Transfer Date
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                        Tags
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                        Created
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
                        Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transfers.map((t) => (
                      <tr
                        key={t._id}
                        onClick={() => handleRowClick(t._id)}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-2 font-medium text-gray-900 font-mono text-sm">
                          #{t._id.slice(-8)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {t.referenceName || '-'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {t.originLocationId?.name || '-'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {t.destinationLocationId?.name || '-'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {t.transferDate ? new Date(t.transferDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-2">
                          {t.tags && t.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {t.tags.slice(0, 2).map(tag => (
                                <span
                                  key={tag._id}
                                  className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700"
                                >
                                  {tag.name}
                                </span>
                              ))}
                              {t.tags.length > 2 && (
                                <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">
                                  +{t.tags.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-600">No tags</span>
                          )}
                        </td>
                        <td className="px-4 py-2 capitalize">
                          <span className={`inline-block px-2 py-0.5 text-xs font-medium ${getStatusStyles(t.status)}`}>
                            {t.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {t.updatedAt
                            ? new Date(t.updatedAt).toLocaleDateString()
                            : 'Not available'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </GridBackgroundWrapper>
  );
};

export default TransfersPage;
