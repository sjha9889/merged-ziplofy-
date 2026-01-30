import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../contexts/product.context";
import ProductTableRow from "./ProductTableRow";

interface ProductsTableProps {
  products: Product[];
}

type SortField = 'price' | 'quantity' | 'updatedAt' | null;
type SortDirection = 'asc' | 'desc';

const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleRowClick = useCallback((productId: string) => {
    navigate(`/products/${productId}`);
  }, [navigate]);

  const handleSort = useCallback((field: 'price' | 'quantity' | 'updatedAt') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const sortedProducts = useMemo(() => {
    if (!sortField) return products;

    return [...products].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      if (sortField === 'price') {
        aValue = a.price;
        bValue = b.price;
      } else if (sortField === 'quantity') {
        aValue = typeof a.quantity === 'number' ? a.quantity : 0;
        bValue = typeof b.quantity === 'number' ? b.quantity : 0;
      } else {
        // updatedAt
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [products, sortField, sortDirection]);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Title</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Category</th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Price</span>
                  {sortField === 'price' && (
                    sortDirection === 'asc' ? (
                      <ArrowUpIcon className="w-3.5 h-3.5 text-gray-900" />
                    ) : (
                      <ArrowDownIcon className="w-3.5 h-3.5 text-gray-900" />
                    )
                  )}
                </div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">SKU</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Status</th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Qty</span>
                  {sortField === 'quantity' && (
                    sortDirection === 'asc' ? (
                      <ArrowUpIcon className="w-3.5 h-3.5 text-gray-900" />
                    ) : (
                      <ArrowDownIcon className="w-3.5 h-3.5 text-gray-900" />
                    )
                  )}
                </div>
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Updated</span>
                  {sortField === 'updatedAt' && (
                    sortDirection === 'asc' ? (
                      <ArrowUpIcon className="w-3.5 h-3.5 text-gray-900" />
                    ) : (
                      <ArrowDownIcon className="w-3.5 h-3.5 text-gray-900" />
                    )
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProducts.map((product) => (
              <ProductTableRow key={product._id} product={product} onRowClick={handleRowClick} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;

