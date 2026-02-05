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
    <div className="min-h-screen bg-[#fefcf8] text-[#0c100c]">
      <StorefrontNavbar showBack />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: `${NAVBAR_HEIGHT + 40}px`, paddingBottom: '40px' }}>
        {/* Welcome Message */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-[#0c100c]" style={{ fontFamily: 'var(--font-serif)' }}>
            Hello, {user.firstName} 👋
          </h1>
          <p className="text-sm text-[#2b1e1e]">Welcome to your profile</p>
        </div>

        {/* Profile Information Card */}
        <div className="rounded-lg overflow-hidden bg-white border border-[#e8e0d5] shadow-sm mb-6">
          <div className="p-6 sm:p-8 space-y-6">
            {/* Profile Header */}
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#e6c547] flex items-center justify-center text-[#0c100c] text-lg font-semibold flex-shrink-0">
                {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                {isEditingName ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={nameForm.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNameFormChange('firstName', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none bg-white text-[#0c100c]"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={nameForm.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNameFormChange('lastName', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none bg-white text-[#0c100c]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSaveName}
                        disabled={updateLoading || !nameForm.firstName.trim() || !nameForm.lastName.trim()}
                        className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        style={{ boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}
                      >
                        {updateLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditName}
                        disabled={updateLoading}
                        className="px-4 py-2 text-sm rounded-lg border border-[#e8e0d5] text-[#0c100c] hover:bg-[#f5f1e8] disabled:opacity-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-2xl font-semibold text-[#0c100c]" style={{ fontFamily: 'var(--font-serif)' }}>{user.firstName} {user.lastName}</h2>
                      <button
                        type="button"
                        onClick={handleEditName}
                        className="p-1.5 hover:bg-[#f5f1e8] rounded-lg transition-colors"
                      >
                        <FiEdit className="w-4 h-4 text-[#2b1e1e]" />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {user.isVerified && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                          <HiShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-md border border-[#e8e0d5] text-[#2b1e1e] text-xs font-medium">
                        {user.language}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-[#e8e0d5]" />

            {/* Contact Information */}
            <div>
              <h3 className="text-base font-semibold mb-4 text-[#0c100c]">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <FiMail className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-[#2b1e1e] mb-0.5">Email Address</p>
                    <p className="text-sm font-medium text-[#0c100c]">{user.email}</p>
                  </div>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-[#2b1e1e] mb-0.5">Phone Number</p>
                      <p className="text-sm font-medium text-[#0c100c]">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Account Information */}
            <div>
              <h3 className="text-base font-semibold mb-4 text-[#0c100c]">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-[#2b1e1e] mb-0.5">Member Since</p>
                    <p className="text-sm font-medium text-[#0c100c]">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-[#2b1e1e] mb-0.5">Last Updated</p>
                    <p className="text-sm font-medium text-[#0c100c]">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Preferences */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-[#0c100c]">Preferences</h3>
                {!isEditingPreferences && (
                  <button
                    type="button"
                    onClick={handleEditPreferences}
                    className="p-1.5 hover:bg-[#f5f1e8] rounded-lg transition-colors"
                  >
                    <FiEdit className="w-4 h-4 text-[#2b1e1e]" />
                  </button>
                )}
              </div>
              
              {isEditingPreferences ? (
                <div className="flex flex-col gap-5">
                  <label className="flex items-start justify-between cursor-pointer p-3 rounded-lg hover:bg-[#f5f1e8] transition-colors">
                    <div>
                      <p className="text-sm font-medium text-[#0c100c]">Marketing Emails</p>
                      <p className="text-xs text-[#2b1e1e] mt-0.5">Receive promotional emails and updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferencesForm.agreedToMarketingEmails}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferencesFormChange('agreedToMarketingEmails', e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#0c100c] rounded focus:ring-[#d4af37]"
                    />
                  </label>
                  <label className="flex items-start justify-between cursor-pointer p-3 rounded-lg hover:bg-[#f5f1e8] transition-colors">
                    <div>
                      <p className="text-sm font-medium text-[#0c100c]">SMS Marketing</p>
                      <p className="text-xs text-[#2b1e1e] mt-0.5">Receive promotional text messages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferencesForm.agreedToSmsMarketing}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePreferencesFormChange('agreedToSmsMarketing', e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#0c100c] rounded focus:ring-[#d4af37]"
                    />
                  </label>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      disabled={updateLoading}
                      className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] font-medium hover:shadow-lg disabled:opacity-50 transition-colors"
                    >
                      {updateLoading ? 'Saving...' : 'Save Preferences'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEditPreferences}
                      disabled={updateLoading}
                      className="px-4 py-2 text-sm rounded-lg border border-[#e8e0d5] text-[#0c100c] hover:bg-[#f5f1e8] disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-[#2b1e1e]">Marketing Emails</span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                      user.agreedToMarketingEmails ? 'bg-green-50 text-green-700' : 'bg-[#f5f1e8] text-[#2b1e1e]'
                    }`}>
                      {user.agreedToMarketingEmails ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-[#2b1e1e]">SMS Marketing</span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                      user.agreedToSmsMarketing ? 'bg-green-50 text-green-700' : 'bg-[#f5f1e8] text-[#2b1e1e]'
                    }`}>
                      {user.agreedToSmsMarketing ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-[#2b1e1e]">Tax Collection</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#f5f1e8] text-[#0c100c] text-xs font-medium">
                      {user.collectTax.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address Management Section */}
        <div className="rounded-xl overflow-hidden bg-white border border-[#e8e0d5]/80 shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <FiMapPin className="w-5 h-5 text-[#2b1e1e]" />
                <h3 className="text-base font-semibold text-[#0c100c]">Address Management</h3>
              </div>
              <button
                type="button"
                onClick={handleAddAddress}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] font-medium hover:shadow-lg transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Address
              </button>
            </div>

            {addressesError && (
              <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">Error loading addresses: {addressesError}</p>
              </div>
            )}

            {addressesLoading ? (
              <div className="text-center py-12">
                <p className="text-sm text-[#2b1e1e]">Loading addresses...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="p-8 text-center bg-[#f5f1e8] rounded-lg border border-dashed border-[#e8e0d5]">
                <FiMapPin className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-[#0c100c] mb-1">No addresses saved</h4>
                <p className="text-xs text-[#2b1e1e] mb-4">Add your first address to get started</p>
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="px-4 py-2 text-sm rounded-lg border border-[#e8e0d5] text-[#0c100c] hover:bg-[#f5f1e8] transition-colors"
                >
                  Add Your First Address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className="p-4 border border-[#e8e0d5] rounded-lg bg-white hover:border-[#e8e0d5] transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-[#0c100c]">{address.firstName} {address.lastName}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-[#f5f1e8] text-[#0c100c] text-xs font-medium">
                            {(address.addressType || 'HOME').toUpperCase()}
                          </span>
                          {user.defaultAddress === address._id && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] text-xs font-medium">
                              <FaStar className="w-3 h-3 fill-white" />
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#2b1e1e] space-y-1">
                          <p>
                            {address.company && `${address.company}, `}
                            {address.address}
                            {address.apartment && `, ${address.apartment}`}
                          </p>
                          <p>{address.city}, {address.state} {address.pinCode}</p>
                          <p>{address.country}</p>
                          <p className="mt-2 flex items-center gap-1">
                            <FiPhone className="w-3 h-3" />
                            {address.phoneNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-1 flex-shrink-0">
                        {user.defaultAddress !== address._id && (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(address._id!)}
                            disabled={updateLoading}
                            className="p-1.5 text-[#2b1e1e] hover:bg-[#f5f1e8] rounded-lg transition-colors disabled:opacity-50"
                            title="Make Default"
                          >
                            <FiStar className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleEditAddress(address)}
                          className="p-1.5 text-[#2b1e1e] hover:bg-[#f5f1e8] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(address._id!)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleCloseAddressDialog}>
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-[#e8e0d5]">
                <h2 className="text-lg font-semibold text-[#0c100c]">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Address Type */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#0c100c] mb-2">Address Type</label>
                    <select
                      value={addressForm.addressType}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleAddressFormChange('addressType', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {addressForm.addressType === 'other' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#0c100c] mb-2">
                        Custom Address Type <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter address type (e.g., Vacation Home, Office, etc.)"
                        value={customAddressType}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomAddressType(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                      />
                      <p className="text-xs text-[#2b1e1e] mt-1">Please specify the type of address</p>
                    </div>
                  )}

                  {/* Name Fields */}
                  <div>
                    <label className="block text-sm font-medium text-[#0c100c] mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0c100c] mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.lastName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                      required
                    />
                  </div>

                  {/* Company */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#0c100c] mb-2">Company (Optional)</label>
                    <input
                      type="text"
                      value={addressForm.company}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('company', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#0c100c] mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={addressForm.address}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAddressFormChange('address', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                      required
                    />
                  </div>

                  {/* Apartment */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#0c100c] mb-2">Apartment, suite, etc. (Optional)</label>
                    <input
                      type="text"
                      value={addressForm.apartment}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('apartment', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                    />
                  </div>

                  {/* City and State */}
                  <div>
                    <label className="block text-sm font-medium text-[#0c100c] mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('city', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0c100c] mb-2">
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('state', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                      required
                    />
                  </div>

                  {/* Country and Pin Code */}
                  <div>
                    <label className="block text-sm font-medium text-[#0c100c] mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={addressForm.country}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleAddressFormChange('country', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0c100c] mb-2">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.pinCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('pinCode', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#0c100c] mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={addressForm.phoneNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAddressFormChange('phoneNumber', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#d4af37] focus:border-[#d4af37] outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-[#e8e0d5] flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCloseAddressDialog}
                  className="px-4 py-2 text-sm rounded-lg border border-[#e8e0d5] text-[#0c100c] hover:bg-[#f5f1e8] transition-colors"
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
                  className="px-6 py-2 text-sm rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e6c547] text-[#0c100c] font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
