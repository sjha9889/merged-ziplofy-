import React from 'react';
import PurchaseOrdersTableBody from './PurchaseOrdersTableBody';

interface PurchaseOrder {
  _id: string;
  supplierId: string | { name?: string; _id?: string };
  destinationLocationId: string | { name?: string; _id?: string };
  status: string;
  totalCost?: number;
  expectedArrivalDate?: string | Date;
}

interface PurchaseOrdersTableProps {
  purchaseOrders: PurchaseOrder[];
  onRowClick: (purchaseOrderId: string) => void;
}

const PurchaseOrdersTable: React.FC<PurchaseOrdersTableProps> = ({
  purchaseOrders,
  onRowClick,
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-white">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
            PO ID
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
            Supplier
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
            Destination
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
            Status
          </th>
          <th className="px-4 py-2 text-right text-sm font-medium text-gray-900">
            Total
          </th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">
            Expected Arrival
          </th>
        </tr>
      </thead>
      <PurchaseOrdersTableBody purchaseOrders={purchaseOrders} onRowClick={onRowClick} />
    </table>
  );
};

export default PurchaseOrdersTable;

