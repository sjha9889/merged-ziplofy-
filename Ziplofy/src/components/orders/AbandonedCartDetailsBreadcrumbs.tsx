import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AbandonedCartDetailsBreadcrumbsProps {
  customerFirstName: string;
  customerLastName: string;
}

const AbandonedCartDetailsBreadcrumbs: React.FC<AbandonedCartDetailsBreadcrumbsProps> = ({
  customerFirstName,
  customerLastName,
}) => {
  const navigate = useNavigate();

  const handleBreadcrumbClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      navigate('/orders/abandoned-carts');
    },
    [navigate]
  );

  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-xs text-gray-500">
        <li>
          <a
            href="/orders/abandoned-carts"
            onClick={handleBreadcrumbClick}
            className="hover:text-gray-700 cursor-pointer"
          >
            Abandoned Carts
          </a>
        </li>
        <li>/</li>
        <li className="text-gray-700">
          {customerFirstName} {customerLastName}
        </li>
      </ol>
    </nav>
  );
};

export default AbandonedCartDetailsBreadcrumbs;

