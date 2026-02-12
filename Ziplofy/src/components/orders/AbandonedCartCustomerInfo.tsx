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
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 pl-4 border-l-4 border-l-blue-500/60">
        <h3 className="text-sm font-semibold text-gray-900">Customer</h3>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-medium shrink-0">
            {getInitials(customer.firstName, customer.lastName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{customer.email}</p>
          </div>
        </div>
        {customer.phoneNumber && (
          <p className="text-xs text-gray-600">{customer.phoneNumber}</p>
        )}
      </div>
    </div>
  );
};

export default AbandonedCartCustomerInfo;


