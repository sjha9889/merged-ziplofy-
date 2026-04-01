import { ArrowPathIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../contexts/payment.context';
import { useStore } from '../contexts/store.context';

function formatInrPaise(paise: number | null): string {
  if (paise === null || paise === undefined) return '—';
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(rupees);
}

function formatSubmitted(iso?: string): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function shortId(id: string, len = 8): string {
  if (!id) return '—';
  return id.length <= len ? id : `${id.slice(0, len)}…`;
}

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeStoreId } = useStore();
  const { payments, loading, error, fetchByStoreId, clearError } = usePayment();

  const load = useCallback(async () => {
    if (!activeStoreId) return;
    clearError();
    await fetchByStoreId(activeStoreId);
  }, [activeStoreId, fetchByStoreId, clearError]);

  useEffect(() => {
    if (activeStoreId) {
      load().catch(() => {});
    }
  }, [activeStoreId, load]);

  const handleBack = () => navigate('/settings/payments');

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto py-6 px-4">
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Payments
          </button>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Transactions</h1>
              <p className="mt-1 text-sm text-gray-500 max-w-xl">
                Manual payment confirmations (UPI and reference IDs) recorded for your active store,
                newest first.
              </p>
            </div>
            <button
              type="button"
              onClick={() => load()}
              disabled={loading || !activeStoreId}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors shrink-0"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {!activeStoreId && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
            Select a store in the header to load transactions.
          </div>
        )}

        {activeStoreId && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 mb-6">
            {error}
          </div>
        )}

        {activeStoreId && (
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-gray-900">Payment records</h2>
              <span className="text-sm text-gray-500">
                {loading ? 'Loading…' : `${payments.length} ${payments.length === 1 ? 'record' : 'records'}`}
              </span>
            </div>

            {loading && payments.length === 0 ? (
              <div className="p-12 text-center text-sm text-gray-500">Loading transactions…</div>
            ) : payments.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm font-medium text-gray-900">No transactions yet</p>
                <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                  When customers submit manual payment details from your storefront checkout, they will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Submitted</th>
                      <th className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Reference</th>
                      <th className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap">UTR</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Payer</th>
                      <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                      <th className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap text-right">
                        Amount
                      </th>
                      <th className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Order ref</th>
                      <th className="px-4 py-3 font-medium text-gray-600 whitespace-nowrap">Customer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((row) => (
                      <tr
                        key={row._id}
                        className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                        onClick={() => navigate(`/settings/payments/transactions/${row._id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(`/settings/payments/transactions/${row._id}`);
                          }
                        }}
                      >
                        <td className="px-4 py-3 text-gray-900 whitespace-nowrap tabular-nums">
                          {formatSubmitted(row.createdAt)}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-800">{row.referenceId}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-800">{row.utr}</td>
                        <td className="px-4 py-3 text-gray-900">{row.name}</td>
                        <td className="px-4 py-3 text-gray-600 break-all max-w-[200px]">{row.email}</td>
                        <td className="px-4 py-3 text-gray-900 text-right tabular-nums whitespace-nowrap">
                          {formatInrPaise(row.amountPaise)}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {row.orderId || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-gray-600" title={row.customerId}>
                            {shortId(row.customerId)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
