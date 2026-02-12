import {
  ArrowPathIcon,
  CubeIcon,
  DocumentTextIcon,
  TagIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TagOptionsItem from './TagOptionsItem';

const TagOptionsList: React.FC = () => {
  const navigate = useNavigate();

  const tagOptions = [
    {
      name: 'Customer Tags',
      route: 'customer-tags',
      icon: UserIcon,
      description: 'Manage tags for customers',
    },
    {
      name: 'Product Tags',
      route: 'product-tags',
      icon: TagIcon,
      description: 'Manage tags for products',
    },
    {
      name: 'Product Types',
      route: 'product-types',
      icon: CubeIcon,
      description: 'Manage product type tags',
    },
    {
      name: 'Transfer Tags',
      route: 'transfer-tags',
      icon: ArrowPathIcon,
      description: 'Manage tags for transfers',
    },
    {
      name: 'Purchase Order Tags',
      route: 'purchase-order-tags',
      icon: DocumentTextIcon,
      description: 'Manage tags for purchase orders',
    },
  ];

  const handleOptionClick = useCallback((route: string) => {
    navigate(`/tag-management/${route}`);
  }, [navigate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tagOptions.map((option) => (
        <TagOptionsItem key={option.route} option={option} onClick={handleOptionClick} />
      ))}
    </div>
  );
};

export default TagOptionsList;
