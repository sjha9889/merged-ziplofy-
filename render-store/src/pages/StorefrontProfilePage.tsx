import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { FiCalendar, FiEdit, FiMail, FiMapPin, FiPhone, FiPlus, FiStar, FiTrash2 } from 'react-icons/fi';
import { HiShieldCheck } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import StorefrontNavbar from '../components/StorefrontNavbar';
import { COUNTRIES } from '../constants/countries';
import type { CustomerAddress } from '../contexts/customer-address-storefront.context';
import { useCustomerAddresses } from '../contexts/customer-address-storefront.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';

const NAVBAR_HEIGHT = 64;

const StorefrontProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, loading: updateLoading } = useStorefrontAuth();
  const { 
    addresses, 
    loading: addressesLoading, 
    error: addressesError,
    fetchCustomerAddressesByCustomerId,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress
  } = useCustomerAddresses();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameForm, setNameForm] = useState({
    firstName: '',
    lastName: ''
  });

  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [preferencesForm, setPreferencesForm] = useState({
    agreedToMarketingEmails: false,
    agreedToSmsMarketing: false
  });

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [addressForm, setAddressForm] = useState<Partial<CustomerAddress>>({
    country: '',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pinCode: '',
    phoneNumber: '',
    addressType: 'home'
  });
  const [customAddressType, setCustomAddressType] = useState('');

  useEffect(() => {
    if (user?._id) {
      fetchCustomerAddressesByCustomerId(user._id);
    } else {
      navigate('/auth/login');
    }
  }, [user?._id, fetchCustomerAddressesByCustomerId, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setAddressForm(prev => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName
      }));
      setNameForm({
        firstName: user.firstName,
        lastName: user.lastName
      });
      setPreferencesForm({
        agreedToMarketingEmails: user.agreedToMarketingEmails,
        agreedToSmsMarketing: user.agreedToSmsMarketing
      });
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setNameForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    });
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setNameForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    });
  };

  const handleNameFormChange = (field: 'firstName' | 'lastName', value: string) => {
    setNameForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveName = async () => {
    if (!user?._id) return;
    try {
      await updateUser(user._id, {
        firstName: nameForm.firstName,
        lastName: nameForm.lastName
      });
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update name:', error);
    }
  };

  const handleEditPreferences = () => {
    setIsEditingPreferences(true);
    setPreferencesForm({
      agreedToMarketingEmails: user?.agreedToMarketingEmails || false,
      agreedToSmsMarketing: user?.agreedToSmsMarketing || false
    });
  };

  const handleCancelEditPreferences = () => {
    setIsEditingPreferences(false);
    setPreferencesForm({
      agreedToMarketingEmails: user?.agreedToMarketingEmails || false,
      agreedToSmsMarketing: user?.agreedToSmsMarketing || false
    });
  };

  const handlePreferencesFormChange = (field: 'agreedToMarketingEmails' | 'agreedToSmsMarketing', value: boolean) => {
    setPreferencesForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePreferences = async () => {
    if (!user?._id) return;
    try {
      await updateUser(user._id, {
        agreedToMarketingEmails: preferencesForm.agreedToMarketingEmails,
        agreedToSmsMarketing: preferencesForm.agreedToSmsMarketing
      });
      setIsEditingPreferences(false);
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user?._id) return;
    try {
      await updateUser(user._id, {
        defaultAddress: addressId
      });
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      country: '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      pinCode: '',
      phoneNumber: '',
      addressType: 'home'
    });
    setCustomAddressType('');
    setAddressDialogOpen(true);
  };

  const handleEditAddress = (address: CustomerAddress) => {
    setEditingAddress(address);
    setAddressForm(address);
    if (address.addressType && !['home', 'work', 'other'].includes(address.addressType)) {
      setCustomAddressType(address.addressType);
      setAddressForm(prev => ({ ...prev, addressType: 'other' }));
    } else {
      setCustomAddressType('');
    }
    setAddressDialogOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteCustomerAddress(addressId);
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleAddressFormChange = (field: keyof CustomerAddress, value: string) => {
    setAddressForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAddress = async () => {
    if (!user?._id) return;
    try {
      const addressData = {
        ...addressForm,
        addressType: addressForm.addressType === 'other' && customAddressType.trim() 
          ? customAddressType.trim() 
          : addressForm.addressType
      };
      if (editingAddress) {
        await updateCustomerAddress(editingAddress._id, addressData);
      } else {
        await addCustomerAddress({
          customerId: user._id,
          ...addressData
        } as any);
      }
      setAddressDialogOpen(false);
      setEditingAddress(null);
      setCustomAddressType('');
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  const handleCloseAddressDialog = () => {
    setAddressDialogOpen(false);
    setEditingAddress(null);
    setCustomAddressType('');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <StorefrontNavbar showBack />

      <div className="max-w-3xl mx-auto px-4" style={{ paddingTop: `${NAVBAR_HEIGHT + 32}px`, paddingBottom: '24px' }}>
        {/* Welcome Message */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Hello, {user.firstName} 👋
          </h1>
          <p className="text-xl text-gray-600">Welcome to your profile</p>
        </div>

        {/* Profile Information Card */}
        <div className="rounded-2xl overflow-hidden bg-white shadow-md border border-gray-200 mb-6">
          <div className="p-8 space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-4">
              <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={nameForm.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNameFormChange('firstName', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={nameForm.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNameFormChange('lastName', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSaveName}
                        disabled={updateLoading || !nameForm.firstName.trim() || !nameForm.lastName.trim()}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updateLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditName}
                        disabled={updateLoading}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold">{user.firstName} {user.lastName}</h2>
                      <button
                        type="button"
                        onClick={handleEditName}
                        className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <FiEdit className="w-4 h-4 text-indigo-600" />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {user.isVerified && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                          <HiShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      <span className="px-2 py-1 rounded-full border border-gray-300 text-gray-700 text-xs font-medium">
                        {user.language}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <FiMail className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-4">
                    <FiPhone className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Account Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <FiCalendar className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FiCalendar className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Preferences */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Preferences</h3>
                {!isEditingPreferences && (
                  <button
                    type="button"
                    onClick={handleEditPreferences}
                    className="p-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <FiEdit className="w-4 h-4 text-indigo-600" />
                  </button>
                )}
              </div>
              
              {isEditingPreferences ? (
                <div className="flex flex-col gap-6">
                  <label className="flex items-start justify-between cursor-pointer">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-gray-600">Receive promotional emails and updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferencesForm.agreedToMarketingEmails}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferencesFormChange('agreedToMarketingEmails', e.target.checked)}
                      className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </label>
                  <label className="flex items-start justify-between cursor-pointer">
                    <div>
                      <p className="font-medium">SMS Marketing</p>
                      <p className="text-sm text-gray-600">Receive promotional text messages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferencesForm.agreedToSmsMarketing}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferencesFormChange('agreedToSmsMarketing', e.target.checked)}
                      className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </label>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      disabled={updateLoading}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {updateLoading ? 'Saving...' : 'Save Preferences'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEditPreferences}
                      disabled={updateLoading}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Marketing Emails</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.agreedToMarketingEmails ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.agreedToMarketingEmails ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SMS Marketing</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.agreedToSmsMarketing ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.agreedToSmsMarketing ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tax Collection</span>
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                      {user.collectTax.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address Management Section */}
        <div className="rounded-2xl overflow-hidden bg-white shadow-md border border-gray-200">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <FiMapPin className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-semibold">Address Management</h3>
              </div>
              <button
                type="button"
                onClick={handleAddAddress}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Address
              </button>
            </div>

            {addressesError && (
              <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">Error loading addresses: {addressesError}</p>
              </div>
            )}

            {addressesLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading addresses...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <FiMapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg text-gray-600 mb-2">No addresses saved</h4>
                <p className="text-sm text-gray-600 mb-4">Add your first address to get started</p>
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className="p-4 border border-gray-200 rounded-xl bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold">{address.firstName} {address.lastName}</h4>
                          <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                            {(address.addressType || 'HOME').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            {address.company && `${address.company}, `}
                            {address.address}
                            {address.apartment && `, ${address.apartment}`}
                          </p>
                          <p>{address.city}, {address.state} {address.pinCode}</p>
                          <p>{address.country}</p>
                          <p className="mt-2">📞 {address.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.defaultAddress === address._id ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium mr-2">
                            <FaStar className="w-3 h-3 fill-indigo-700" />
                            Default
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(address._id!)}
                            disabled={updateLoading}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 mr-2"
                          >
                            <FiStar className="w-3 h-3" />
                            Make Default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEditAddress(address)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(address._id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Address Form Dialog */}
        {addressDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleCloseAddressDialog}>
            <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address Type */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                    <select
                      value={addressForm.addressType}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleAddressFormChange('addressType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {addressForm.addressType === 'other' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Address Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter address type (e.g., Vacation Home, Office, etc.)"
                        value={customAddressType}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomAddressType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Please specify the type of address</p>
                    </div>
                  )}

                  {/* Name Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Company */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                    <input
                      type="text"
                      value={addressForm.company}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={addressForm.address}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAddressFormChange('address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Apartment */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apartment, suite, etc. (Optional)</label>
                    <input
                      type="text"
                      value={addressForm.apartment}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('apartment', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* City and State */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Country and Pin Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={addressForm.country}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleAddressFormChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.pinCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('pinCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={addressForm.phoneNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCloseAddressDialog}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={
                    addressesLoading || 
                    !addressForm.firstName || 
                    !addressForm.lastName || 
                    !addressForm.address || 
                    !addressForm.city || 
                    !addressForm.state || 
                    !addressForm.country || 
                    !addressForm.pinCode || 
                    !addressForm.phoneNumber ||
                    (addressForm.addressType === 'other' && !customAddressType.trim())
                  }
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addressesLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorefrontProfilePage;
