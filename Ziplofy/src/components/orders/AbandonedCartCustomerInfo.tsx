import React from 'react';

interface AbandonedCartCustomerInfoProps {
  customer: {
    firstName: string;
    lastName: string;
    _id: string;
    email: string;
    phoneNumber?: string;
  };
  getInitials: (firstName: string, lastName: string) => string;
}

const AbandonedCartCustomerInfo: React.FC<AbandonedCartCustomerInfoProps> = ({
  customer,
  getInitials,
}) => {
  return (
    <div className="bg-white border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Customer</h3>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-xs font-medium">
          {getInitials(customer.firstName, customer.lastName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {customer.firstName} {customer.lastName}
          </p>
          <p className="text-xs text-gray-500 truncate">{customer.email}</p>
        </div>
      </div>
      {customer.phoneNumber && (
        <p className="text-xs text-gray-600">{customer.phoneNumber}</p>
      )}
    </div>
  );
};

export default AbandonedCartCustomerInfo;


