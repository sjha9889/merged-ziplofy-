import {
  ArrowUpTrayIcon,
  UserPlusIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import { useCustomers } from '../contexts/customer.context';
import { useStore } from '../contexts/store.context';

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeStoreId } = useStore();
  const { customers, loading, fetchCustomersByStoreId } = useCustomers();

  // Load customers for active store
  useEffect(() => {
    if (activeStoreId) {
      fetchCustomersByStoreId(activeStoreId);
    }
  }, [activeStoreId, fetchCustomersByStoreId]);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Page Header */}
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-gray-600" />
                <h1 className="text-xl font-medium text-gray-900">Customers</h1>
              </div>
              {customers && customers.length > 0 && (
                <button
                  onClick={() => navigate('/customers/new')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                >
                  <UserPlusIcon className="w-4 h-4" />
                  Add customer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Conditional content */}
        {!loading && (!customers || customers.length === 0) ? (
          <div className="bg-white rounded border border-gray-200 p-6 text-center">
            <h2 className="text-base font-medium text-gray-900 mb-2">
              Everything customers-related in one place
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Manage customer details, see customer order history, and group customers into segments.
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <button
                onClick={() => navigate('/customers/new')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                <UserPlusIcon className="w-4 h-4" />
                Add customer
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors">
                <ArrowUpTrayIcon className="w-4 h-4" />
                Import customers
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded border border-gray-200">
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-base font-medium text-gray-900">
                {customers?.length || 0} Customer{(customers?.length || 0) !== 1 ? 's' : ''}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Phone
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Tags
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-sm text-gray-600">
                        Loading customers...
                      </td>
                    </tr>
                  ) : customers && customers.length > 0 ? (
                    customers.map((c) => (
                      <tr
                        key={c._id}
                        onClick={() => navigate(`/customers/${c._id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {c.firstName} {c.lastName}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                          {c.email}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                          {c.phoneNumber}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          {Array.isArray(c.tagIds) && (c.tagIds as any[]).length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {(c.tagIds as any[]).map((t: any) => (
                                <span
                                  key={t._id || t}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                                >
                                  {t.name || t}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-sm text-gray-600">
                        No customers found
                      </td>
                    </tr>
                  )}
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

export default CustomersPage;
