import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddCustomerAddressModal from '../components/customer/AddCustomerAddressModal';
import CustomerAddressesSection from '../components/customer/CustomerAddressesSection';
import CustomerMarketingAndNotesFields from '../components/customer/CustomerMarketingAndNotesFields';
import CustomerPersonalInfoFields from '../components/customer/CustomerPersonalInfoFields';
import CustomerSettingsInfoFields from '../components/customer/CustomerSettingsInfoFields';
import CustomerTagsDisplay from '../components/customer/CustomerTagsDisplay';
import CustomerTimelineSection from '../components/customer/CustomerTimelineSection';
import CustomerTimestampFields from '../components/customer/CustomerTimestampFields';
import GridBackgroundWrapper from '../components/GridBackgroundWrapper';
import type { CreateCustomerAddressRequest } from '../contexts/customer-address.context';
import { useCustomerAddresses } from '../contexts/customer-address.context';
import { useCustomers } from '../contexts/customer.context';

const CustomerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { fetchCustomerAddressesByCustomerId, addCustomerAddress } = useCustomerAddresses();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const customer = useMemo(() => customers.find((c) => c._id === id), [customers, id]);


  const handleSaveAddress = useCallback(
    async (data: CreateCustomerAddressRequest) => {
      if (!id) return;
      await addCustomerAddress(data);
      setIsAddressModalOpen(false);
      fetchCustomerAddressesByCustomerId(id);
    },
    [id, addCustomerAddress, fetchCustomerAddressesByCustomerId]
  );

  const handleCloseAddressModal = useCallback(() => {
    setIsAddressModalOpen(false);
  }, []);

  return (
    <GridBackgroundWrapper>
      <div className="min-h-screen">
        {/* Page Header */}
        <div className="border-b border-gray-200 px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/customers')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                </button>
                <div>
                  <h1 className="text-xl font-medium text-gray-900">
                    {customer ? `${customer.firstName} ${customer.lastName}` : 'Customer'}
                  </h1>
                  <p className="text-sm text-gray-600 mt-0.5">Customer details and information</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
              >
                Add Customer Address
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto py-6 px-4">
          <div>
            {customer ? (
              <div className="flex flex-col gap-4">
                {/* Customer Information */}
                <div className="bg-white rounded border border-gray-200 p-4">
                  <h2 className="text-base font-medium text-gray-900 mb-4">Customer Information</h2>
                  
                  <div className="flex flex-col gap-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CustomerPersonalInfoFields
                        firstName={customer.firstName}
                        lastName={customer.lastName}
                        email={customer.email}
                        phoneNumber={customer.phoneNumber}
                      />
                      <CustomerSettingsInfoFields
                        language={customer.language}
                        collectTax={customer.collectTax}
                        storeId={customer.storeId}
                      />
                    </div>
                    <CustomerTimestampFields
                      createdAt={customer.createdAt}
                      updatedAt={customer.updatedAt}
                    />
                    <CustomerMarketingAndNotesFields
                      agreedToMarketingEmails={customer.agreedToMarketingEmails}
                      agreedToSmsMarketing={customer.agreedToSmsMarketing}
                      notes={customer.notes}
                    />
                    <CustomerTagsDisplay tags={customer.tagIds} />
                  </div>
                </div>

              {id && <CustomerAddressesSection customerId={id} />}
              {id && <CustomerTimelineSection customerId={id} />}
            </div>
          ) : (
            <p className="text-sm text-gray-600">Customer not found in state.</p>
          )}
        </div>
      </div>

      {/* Add Customer Address Modal */}
      {id && (
        <AddCustomerAddressModal
          isOpen={isAddressModalOpen}
          onClose={handleCloseAddressModal}
          onSubmit={handleSaveAddress}
          customerId={id}
        />
      )}
      </div>
    </GridBackgroundWrapper>
  );
};

export default CustomerDetailsPage;
