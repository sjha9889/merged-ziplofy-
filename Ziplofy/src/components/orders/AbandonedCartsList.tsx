import React from 'react';
import AbandonedCartCard from './AbandonedCartCard';

interface CartItem {
  _id: string;
  productVariant: {
    images?: string[];
    sku: string;
    price: number;
    optionValues: Record<string, string>;
  };
  quantity: number;
}

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

interface Cart {
  customer: Customer;
  totalItems: number;
  cartItems: CartItem[];
  lastUpdated: string;
}

interface AbandonedCartsListProps {
  carts: Cart[];
  getInitials: (firstName: string, lastName: string) => string;
  formatDate: (dateString: string) => string;
  onSendEmail: (customer: Customer) => void;
  onViewDetails: (customerId: string) => void;
}

const AbandonedCartsList: React.FC<AbandonedCartsListProps> = ({
  carts,
  getInitials,
  formatDate,
  onSendEmail,
  onViewDetails,
}) => {
  return (
    <div>
      {carts.map((cart, index) => (
        <AbandonedCartCard
          key={cart.customer._id}
          cart={cart}
          getInitials={getInitials}
          formatDate={formatDate}
          onSendEmail={onSendEmail}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default AbandonedCartsList;

