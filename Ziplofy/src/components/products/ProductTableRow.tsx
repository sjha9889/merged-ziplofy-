import React, { useCallback } from "react";
import { Product } from "../../contexts/product.context";

interface ProductTableRowProps {
  product: Product;
  onRowClick: (productId: string) => void;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({ product, onRowClick }) => {
  const handleClick = useCallback(() => {
    onRowClick(product._id);
  }, [product._id, onRowClick]);

  return (
    <tr 
      className="hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{product.title}</td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
        {product.category && typeof product.category === 'object' ? product.category.name : product.category}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{product.price}</td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{product.sku}</td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 capitalize">{product.status}</td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{typeof product.quantity === 'number' ? product.quantity : 0}</td>
      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{new Date(product.updatedAt).toLocaleString()}</td>
    </tr>
  );
};

export default ProductTableRow;

