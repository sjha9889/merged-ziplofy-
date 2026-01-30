import React from "react";
import ChipList from "./ChipList";

interface Product {
  _id: string;
  title: string;
}

interface Collection {
  _id: string;
  title: string;
}

interface CustomerSegment {
  _id: string;
  name: string;
}

interface Customer {
  _id: string;
  name: string;
}

interface BuyXGetYTargetsCardProps {
  buysProducts: Product[];
  buysCollections: Collection[];
  getsProducts: Product[];
  getsCollections: Collection[];
  segments: CustomerSegment[];
  customers: Customer[];
}

const BuyXGetYTargetsCard: React.FC<BuyXGetYTargetsCardProps> = ({
  buysProducts,
  buysCollections,
  getsProducts,
  getsCollections,
  segments,
  customers,
}) => {
  return (
    <div className="bg-white border border-gray-200 p-4">
      <h2 className="text-base font-medium mb-3 text-gray-900">Targets</h2>

      <div className="mb-3">
        <h3 className="text-xs font-medium text-gray-900 mb-1.5">Buys - Products</h3>
        {buysProducts.length > 0 ? (
          <ChipList items={buysProducts.map(p => ({ key: p._id, label: p.title }))} />
        ) : (
          <p className="text-xs text-gray-600">None</p>
        )}
      </div>

      <hr className="my-3 border-gray-200" />

      <div className="mb-3">
        <h3 className="text-xs font-medium text-gray-900 mb-1.5">Buys - Collections</h3>
        {buysCollections.length > 0 ? (
          <ChipList items={buysCollections.map(c => ({ key: c._id, label: c.title }))} />
        ) : (
          <p className="text-xs text-gray-600">None</p>
        )}
      </div>

      <hr className="my-3 border-gray-200" />

      <div className="mb-3">
        <h3 className="text-xs font-medium text-gray-900 mb-1.5">Gets - Products</h3>
        {getsProducts.length > 0 ? (
          <ChipList items={getsProducts.map(p => ({ key: p._id, label: p.title }))} />
        ) : (
          <p className="text-xs text-gray-600">None</p>
        )}
      </div>

      <hr className="my-3 border-gray-200" />

      <div className="mb-3">
        <h3 className="text-xs font-medium text-gray-900 mb-1.5">Gets - Collections</h3>
        {getsCollections.length > 0 ? (
          <ChipList items={getsCollections.map(c => ({ key: c._id, label: c.title }))} />
        ) : (
          <p className="text-xs text-gray-600">None</p>
        )}
      </div>

      <hr className="my-3 border-gray-200" />

      <div className="mb-3">
        <h3 className="text-xs font-medium text-gray-900 mb-1.5">Customer Segments</h3>
        {segments.length > 0 ? (
          <ChipList items={segments.map(s => ({ key: s._id, label: s.name }))} />
        ) : (
          <p className="text-xs text-gray-600">None</p>
        )}
      </div>

      <hr className="my-3 border-gray-200" />

      <div>
        <h3 className="text-xs font-medium text-gray-900 mb-1.5">Customers</h3>
        {customers.length > 0 ? (
          <ChipList items={customers.map(c => ({ key: c._id, label: c.name }))} />
        ) : (
          <p className="text-xs text-gray-600">None</p>
        )}
      </div>
    </div>
  );
};

export default BuyXGetYTargetsCard;

