import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import AbandonedCartCustomerInfo from '../../components/orders/AbandonedCartCustomerInfo';
import AbandonedCartDetailsBreadcrumbs from '../../components/orders/AbandonedCartDetailsBreadcrumbs';
import AbandonedCartItemsTable from '../../components/orders/AbandonedCartItemsTable';
import AbandonedCartSummary from '../../components/orders/AbandonedCartSummary';
import SendRecoveryEmailModal from '../../components/orders/SendRecoveryEmailModal';
import GridBackgroundWrapper from '../../components/GridBackgroundWrapper';
import { useAbandonedCarts } from '../../contexts/abandoned-cart.context';
import { useStore } from '../../contexts/store.context';

const AbandonedCartDetailsPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { abandonedCarts, loading, error, fetchAbandonedCartsByStoreId } = useAbandonedCarts();
  const { activeStoreId } = useStore();

  const [selectedCart, setSelectedCart] = useState<any>(null);

  // Modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('custom');

  useEffect(() => {
    if (activeStoreId) {
      fetchAbandonedCartsByStoreId(activeStoreId);
    }
  }, [activeStoreId, fetchAbandonedCartsByStoreId]);

  useEffect(() => {
    if (abandonedCarts.length > 0 && customerId) {
      const cart = abandonedCarts.find((cart) => cart.customer._id === customerId);
      setSelectedCart(cart);
    }
  }, [abandonedCarts, customerId]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const getInitials = useCallback((firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }, []);

  const calculateCartTotal = useCallback(() => {
    if (!selectedCart) return 0;
    return selectedCart.cartItems.reduce((total: number, item: any) => {
      return total + item.productVariant.price * item.quantity;
    }, 0);
  }, [selectedCart]);

  const handleSendEmail = useCallback(() => {
    if (selectedCart?.customer) {
      const customer = selectedCart.customer;
      setEmailSubject(`Complete your purchase - ${customer.firstName}`);
      setEmailBody(
        `Hi ${customer.firstName},\n\nWe noticed you left some items in your cart. Don't miss out on these great products!\n\nClick here to complete your purchase: [Cart Link]\n\nBest regards,\nYour Store Team`
      );
      setIsEmailModalOpen(true);
    }
  }, [selectedCart]);

  const handleCloseEmailModal = useCallback(() => {
    setIsEmailModalOpen(false);
    setEmailSubject('');
    setEmailBody('');
    setEmailTemplate('custom');
  }, []);

  const handleSendEmailSubmit = useCallback(() => {
    // TODO: Implement email sending functionality
    console.log('Sending email to:', selectedCart?.customer?.email);
    console.log('Subject:', emailSubject);
    console.log('Body:', emailBody);
    console.log('Template:', emailTemplate);

    // Close modal after sending
    handleCloseEmailModal();
  }, [selectedCart?.customer?.email, emailSubject, emailBody, emailTemplate, handleCloseEmailModal]);

  const handleTemplateChange = useCallback(
    (template: string) => {
      setEmailTemplate(template);

      if (!selectedCart?.customer) return;

      const customer = selectedCart.customer;

      if (template === 'reminder') {
        setEmailSubject(`Don't forget your items - ${customer.firstName}`);
        setEmailBody(
          `Hi ${customer.firstName},\n\nYou have items waiting in your cart! Complete your purchase now to secure your items.\n\n[View Cart]\n\nThanks for shopping with us!`
        );
      } else if (template === 'discount') {
        setEmailSubject(`Special offer for you - ${customer.firstName}`);
        setEmailBody(
          `Hi ${customer.firstName},\n\nWe're offering you a special 10% discount on your cart items! Use code SAVE10 at checkout.\n\n[Complete Purchase with Discount]\n\nThis offer expires in 24 hours!`
        );
      } else if (template === 'custom') {
        setEmailSubject(`Complete your purchase - ${customer.firstName}`);
        setEmailBody(
          `Hi ${customer.firstName},\n\nWe noticed you left some items in your cart. Don't miss out on these great products!\n\nClick here to complete your purchase: [Cart Link]\n\nBest regards,\nYour Store Team`
        );
      }
    },
    [selectedCart?.customer]
  );

  const handleBack = useCallback(() => {
    navigate('/orders/abandoned-carts');
  }, [navigate]);

  if (loading) {
    return (
      <GridBackgroundWrapper>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
        </div>
      </GridBackgroundWrapper>
    );
  }

  if (error) {
    return (
      <GridBackgroundWrapper>
        <div className="max-w-7xl mx-auto pt-3 px-4">
          <div className="bg-white border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </GridBackgroundWrapper>
    );
  }

  if (!selectedCart) {
    return (
      <GridBackgroundWrapper>
        <div className="max-w-7xl mx-auto pt-3 px-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-900">Abandoned cart not found</p>
          </div>
        </div>
      </GridBackgroundWrapper>
    );
  }

  return (
    <GridBackgroundWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <AbandonedCartDetailsBreadcrumbs
          customerFirstName={selectedCart.customer.firstName}
          customerLastName={selectedCart.customer.lastName}
        />

        {/* Header */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-medium text-gray-900">
                {selectedCart.customer.firstName} {selectedCart.customer.lastName}
              </h1>
            </div>
            <button
              onClick={handleSendEmail}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer Info & Summary */}
          <div className="lg:col-span-1 space-y-4">
            <AbandonedCartCustomerInfo
              customer={selectedCart.customer}
              getInitials={getInitials}
            />
            <AbandonedCartSummary
              totalItems={selectedCart.totalItems}
              uniqueProducts={selectedCart.cartItems.length}
              totalValue={calculateCartTotal()}
              lastUpdated={selectedCart.lastUpdated}
              formatDate={formatDate}
            />
          </div>

          {/* Right Column - Cart Items */}
          <div className="lg:col-span-2">
            <AbandonedCartItemsTable
              cartItems={selectedCart.cartItems}
              cartTotal={calculateCartTotal()}
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>

        {/* Email Modal */}
        <SendRecoveryEmailModal
          isOpen={isEmailModalOpen}
          customer={selectedCart?.customer || null}
          emailSubject={emailSubject}
          emailBody={emailBody}
          emailTemplate={emailTemplate}
          onClose={handleCloseEmailModal}
          onTemplateChange={handleTemplateChange}
          onSubjectChange={setEmailSubject}
          onBodyChange={setEmailBody}
          onSubmit={handleSendEmailSubmit}
        />
    </GridBackgroundWrapper>
  );
};

export default AbandonedCartDetailsPage;
