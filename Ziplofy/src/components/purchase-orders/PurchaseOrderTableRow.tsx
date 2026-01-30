import React from 'react';

interface PurchaseOrderTableRowProps {
  purchaseOrder: {
    _id: string;
    supplierId: string | { name?: string; _id?: string };
    destinationLocationId: string | { name?: string; _id?: string };
    status: string;
    totalCost?: number;
    expectedArrivalDate?: string | Date;
  };
  onRowClick: (purchaseOrderId: string) => void;
}

const PurchaseOrderTableRow: React.FC<PurchaseOrderTableRowProps> = ({
  purchaseOrder,
  onRowClick,
}) => {
  const supplierName =
    typeof purchaseOrder.supplierId === 'string'
      ? purchaseOrder.supplierId
      : purchaseOrder.supplierId?.name || purchaseOrder.supplierId?._id;
  const destinationName =
    typeof purchaseOrder.destinationLocationId === 'string'
      ? purchaseOrder.destinationLocationId
      : purchaseOrder.destinationLocationId?.name || purchaseOrder.destinationLocationId?._id;

  return (
    <tr
      onClick={() => onRowClick(purchaseOrder._id)}
      className="hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{purchaseOrder._id}</td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{supplierName}</td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{destinationName}</td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 capitalize">
        {purchaseOrder.status.replaceAll('_', ' ')}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
        {purchaseOrder.totalCost?.toFixed(2)}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
        {purchaseOrder.expectedArrivalDate
          ? new Date(purchaseOrder.expectedArrivalDate).toLocaleDateString()
          : '-'}
      </td>
    </tr>
  );
};

export default PurchaseOrderTableRow;

