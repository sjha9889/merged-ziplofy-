import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AbandonedCartsEmptyState from '../../components/orders/AbandonedCartsEmptyState';
import AbandonedCartsHeader from '../../components/orders/AbandonedCartsHeader';
import AbandonedCartsList from '../../components/orders/AbandonedCartsList';
import SendRecoveryEmailModal from '../../components/orders/SendRecoveryEmailModal';
import { useAbandonedCarts } from '../../contexts/abandoned-cart.context';
import { useStore } from '../../contexts/store.context';

const AbandonedCartsPage: React.FC = () => {
  const navigate = useNavigate();
  const { abandonedCarts, loading, error, fetchAbandonedCartsByStoreId } = useAbandonedCarts();
  const { activeStoreId } = useStore();

  // Modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('custom');

  useEffect(() => {
    if (activeStoreId) {
      fetchAbandonedCartsByStoreId(activeStoreId);
    }
  }, [activeStoreId, fetchAbandonedCartsByStoreId]);

  const handleRefresh = useCallback(() => {
    if (activeStoreId) {
      fetchAbandonedCartsByStoreId(activeStoreId);
    }
  }, [activeStoreId, fetchAbandonedCartsByStoreId]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const getInitials = useCallback((firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }, []);

  const handleSendEmail = useCallback((customer: any) => {
    setSelectedCustomer(customer);
    setEmailSubject(`Complete your purchase - ${customer.firstName}`);
    setEmailBody(
      `Hi ${customer.firstName},\n\nWe noticed you left some items in your cart. Don't miss out on these great products!\n\nClick here to complete your purchase: [Cart Link]\n\nBest regards,\nYour Store Team`
    );
    setIsEmailModalOpen(true);
  }, []);

  const handleCloseEmailModal = useCallback(() => {
    setIsEmailModalOpen(false);
    setSelectedCustomer(null);
    setEmailSubject('');
    setEmailBody('');
    setEmailTemplate('custom');
  }, []);

  const handleSendEmailSubmit = useCallback(() => {
    // TODO: Implement email sending functionality
    console.log('Sending email to:', selectedCustomer?.email);
    console.log('Subject:', emailSubject);
    console.log('Body:', emailBody);
    console.log('Template:', emailTemplate);

    // Close modal after sending
    handleCloseEmailModal();
  }, [selectedCustomer?.email, emailSubject, emailBody, emailTemplate, handleCloseEmailModal]);

  const handleTemplateChange = useCallback(
    (template: string) => {
      setEmailTemplate(template);

      if (template === 'reminder') {
        setEmailSubject(`Don't forget your items - ${selectedCustomer?.firstName}`);
        setEmailBody(
          `Hi ${selectedCustomer?.firstName},\n\nYou have items waiting in your cart! Complete your purchase now to secure your items.\n\n[View Cart]\n\nThanks for shopping with us!`
        );
      } else if (template === 'discount') {
        setEmailSubject(`Special offer for you - ${selectedCustomer?.firstName}`);
        setEmailBody(
          `Hi ${selectedCustomer?.firstName},\n\nWe're offering you a special 10% discount on your cart items! Use code SAVE10 at checkout.\n\n[Complete Purchase with Discount]\n\nThis offer expires in 24 hours!`
        );
      } else if (template === 'custom') {
        setEmailSubject(`Complete your purchase - ${selectedCustomer?.firstName}`);
        setEmailBody(
          `Hi ${selectedCustomer?.firstName},\n\nWe noticed you left some items in your cart. Don't miss out on these great products!\n\nClick here to complete your purchase: [Cart Link]\n\nBest regards,\nYour Store Team`
        );
      }
    },
    [selectedCustomer?.firstName]
  );

  const handleViewDetails = useCallback(
    (customerId: string) => {
      navigate(`/orders/abandoned-carts/customer/${customerId}`);
    },
    [navigate]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-page-background-color">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4 flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page-background-color">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
          <div className="bg-white border border-red-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-background-color">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Orders</span>
          </button>
          <AbandonedCartsHeader
            cartCount={abandonedCarts.length}
            loading={loading}
            onRefresh={handleRefresh}
          />
        </div>

        {abandonedCarts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
            <AbandonedCartsEmptyState />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
            <AbandonedCartsList
              carts={abandonedCarts}
              getInitials={getInitials}
              formatDate={formatDate}
              onSendEmail={handleSendEmail}
              onViewDetails={handleViewDetails}
            />
          </div>
        )}
      </div>

      {/* Email Modal */}
      <SendRecoveryEmailModal
        isOpen={isEmailModalOpen}
        customer={selectedCustomer}
        emailSubject={emailSubject}
        emailBody={emailBody}
        emailTemplate={emailTemplate}
        onClose={handleCloseEmailModal}
        onTemplateChange={handleTemplateChange}
        onSubjectChange={setEmailSubject}
        onBodyChange={setEmailBody}
        onSubmit={handleSendEmailSubmit}
      />
    </div>
  );
};

export default AbandonedCartsPage;
