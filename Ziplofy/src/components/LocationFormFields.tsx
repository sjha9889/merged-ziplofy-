import React from 'react';

interface LocationFormFieldsProps {
  form: {
    name: string;
    countryRegion: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

const LocationFormFields: React.FC<LocationFormFieldsProps> = ({ form, onChange }) => {
  return (
    <div className="bg-white/95 p-3 border border-gray-200 mb-3">
      <h2 className="text-sm font-medium mb-3 text-gray-900">Location Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Location Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Country / Region</label>
          <input
            type="text"
            value={form.countryRegion}
            onChange={(e) => onChange('countryRegion', e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Apartment, suite, etc. (optional)
          </label>
          <input
            type="text"
            value={form.apartment}
            onChange={(e) => onChange('apartment', e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => onChange('city', e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">State / Province</label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => onChange('state', e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">PIN / Postal Code</label>
          <input
            type="text"
            value={form.postalCode}
            onChange={(e) => onChange('postalCode', e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm text-gray-900 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationFormFields;

