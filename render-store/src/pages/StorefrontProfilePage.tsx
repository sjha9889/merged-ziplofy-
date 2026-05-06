import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { FiCalendar, FiEdit2, FiLogOut, FiMail, FiMapPin, FiPackage, FiPhone, FiPlus, FiSettings, FiShoppingBag, FiStar, FiTrash2, FiUser, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStorefrontCountries } from '../contexts/storefront-country.context';
import type { CustomerAddress } from '../contexts/customer-address-storefront.context';
import { useCustomerAddresses } from '../contexts/customer-address-storefront.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';

type TabType = 'profile' | 'addresses' | 'preferences';

const StorefrontProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, loading: updateLoading, logout } = useStorefrontAuth();
  const { 
    addresses, 
    loading: addressesLoading, 
    error: addressesError,
    fetchCustomerAddressesByCustomerId,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress
  } = useCustomerAddresses();
  const { countries, getCountries, loading: countriesLoading } = useStorefrontCountries();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
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
  const [addressForm, setAddressForm] = useState<Partial<CustomerAddress> & { countryId?: string }>({
    countryId: '',
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
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchCustomerAddressesByCustomerId(user._id);
    }
  }, [user?._id, fetchCustomerAddressesByCustomerId]);

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

  useEffect(() => {
    if (addressDialogOpen && countries.length === 0) {
      getCountries({ limit: 300 }).catch(() => {});
    }
  }, [addressDialogOpen, countries.length, getCountries]);

  useEffect(() => {
    if (countries.length > 0 && !addressForm.countryId && !editingAddress) {
      const india = countries.find((c) => c.iso2 === 'IN');
      if (india) {
        setAddressForm((prev) => ({ ...prev, countryId: india._id }));
      } else {
        setAddressForm((prev) => ({ ...prev, countryId: countries[0]._id }));
      }
    }
  }, [countries, addressForm.countryId, editingAddress]);

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
    const defaultCountryId = countries.find((c) => c.iso2 === 'IN')?._id || countries[0]?._id || '';
    setAddressForm({
      countryId: defaultCountryId,
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
    const countryId = typeof address.countryId === 'object' && address.countryId ? (address.countryId as { _id?: string })._id : (address.countryId as string);
    setAddressForm({ ...address, countryId } as Partial<CustomerAddress> & { countryId?: string });
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

  const handleAddressFormChange = (field: keyof CustomerAddress | 'countryId', value: string) => {
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

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  if (!user) {
    return (
      <main className="account-page">
        <div className="account-inner">
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">You are signed out</h2>
            <p className="text-sm text-gray-500 mb-5">
              Sign in to view and manage your profile details.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/auth/login')}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const sidebarItems = [
    { id: 'profile' as TabType, label: 'My Profile', icon: FiUser },
    { id: 'addresses' as TabType, label: 'Addresses', icon: FiMapPin },
    { id: 'preferences' as TabType, label: 'Preferences', icon: FiSettings },
  ];

  const quickLinks = [
    { label: 'My Orders', icon: FiPackage, onClick: () => navigate('/my-orders') },
    { label: 'Continue Shopping', icon: FiShoppingBag, onClick: () => navigate('/') },
  ];

  return (
    <main className="account-page">
      <div className="account-inner">
        <nav className="account-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="account-breadcrumb-sep">•</span>
          <span className="account-breadcrumb-current">User Dashboard</span>
          <span className="account-breadcrumb-sep">•</span>
          <span className="account-breadcrumb-current">
            {activeTab === 'profile' ? 'My Profile' : activeTab === 'addresses' ? 'My Address' : 'Preferences'}
          </span>
        </nav>

        <div className="account-layout">
          <aside className="account-sidebar">
            <nav className="account-nav" aria-label="Account navigation">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`account-nav-item ${activeTab === item.id ? 'active' : ''}`}
                >
                  <item.icon className="w-5 h-5" style={{ width: 20, height: 20 }} />
                  {item.label}
                </button>
              ))}
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={link.onClick}
                  className="account-nav-item"
                >
                  <link.icon className="w-5 h-5" style={{ width: 20, height: 20 }} />
                  {link.label}
                </button>
              ))}
              <button type="button" onClick={handleLogout} className="account-nav-item" id="account-logout-btn">
                <FiLogOut style={{ width: 20, height: 20 }} />
                Log Out
              </button>
            </nav>
          </aside>

          <div className="account-content flex-1 min-w-0">
            <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="account-panel"
              >
                <h1 className="account-content-title">My Profile</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Personal Information</h2>
                    {!isEditingName && (
                      <button onClick={handleEditName} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                        <FiEdit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="p-6">
                    {isEditingName ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                            <input
                              type="text"
                              value={nameForm.firstName}
                              onChange={(e) => handleNameFormChange('firstName', e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                            <input
                              type="text"
                              value={nameForm.lastName}
                              onChange={(e) => handleNameFormChange('lastName', e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleSaveName}
                            disabled={updateLoading || !nameForm.firstName.trim() || !nameForm.lastName.trim()}
                            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                          >
                            {updateLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            onClick={handleCancelEditName}
                            className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">First Name</p>
                          <p className="text-sm font-medium text-gray-900">{user.firstName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Last Name</p>
                          <p className="text-sm font-medium text-gray-900">{user.lastName}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Contact Information</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <FiMail className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      </div>
                    </div>
                    {user.phoneNumber && (
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <FiPhone className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone Number</p>
                          <p className="text-sm font-medium text-gray-900">{user.phoneNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Account Details</h2>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <FiCalendar className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Member Since</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <FiCalendar className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Updated</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(user.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="account-panel account-panel-address"
              >
                <h1 className="account-content-title">My Address</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Saved Addresses</h2>
                  <button
                    onClick={handleAddAddress}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Address
                  </button>
                </div>
                
                <div className="p-6">
                  {addressesError && (
                    <div className="p-4 mb-4 bg-red-50 border border-red-100 rounded-xl">
                      <p className="text-sm text-red-700">Error loading addresses: {addressesError}</p>
                    </div>
                  )}

                  {addressesLoading ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-sm text-gray-500">Loading addresses...</p>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiMapPin className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">No addresses saved</h3>
                      <p className="text-xs text-gray-500 mb-4">Add your first address to get started</p>
                      <button
                        onClick={handleAddAddress}
                        className="px-4 py-2 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`p-4 rounded-xl border-2 transition-colors ${
                            user.defaultAddress === address._id
                              ? 'border-gray-900 bg-gray-50'
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                address.addressType === 'home' ? 'bg-blue-50 text-blue-700' :
                                address.addressType === 'work' ? 'bg-purple-50 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {(address.addressType || 'home').charAt(0).toUpperCase() + (address.addressType || 'home').slice(1)}
                              </span>
                              {user.defaultAddress === address._id && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-900 text-white text-xs font-medium">
                                  <FaStar className="w-2.5 h-2.5" />
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {user.defaultAddress !== address._id && (
                                <button
                                  onClick={() => handleSetDefaultAddress(address._id!)}
                                  disabled={updateLoading}
                                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Set as Default"
                                >
                                  <FiStar className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address._id!)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 text-sm mb-2">{address.firstName} {address.lastName}</h4>
                          <div className="text-xs text-gray-500 space-y-1">
                            <p>{address.address}{address.apartment && `, ${address.apartment}`}</p>
                            <p>{address.city}, {address.state} {address.pinCode}</p>
                            <p>{typeof address.countryId === 'object' && address.countryId ? (address.countryId as { name?: string }).name : ''}</p>
                            <p className="flex items-center gap-1 mt-2 text-gray-600">
                              <FiPhone className="w-3 h-3" />
                              {address.phoneNumber}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="account-panel"
              >
                <h1 className="account-content-title">Preferences</h1>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Communication Preferences</h2>
                  {!isEditingPreferences && (
                    <button onClick={handleEditPreferences} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                      <FiEdit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  {isEditingPreferences ? (
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
                          <p className="text-xs text-gray-500 mt-0.5">Receive promotional emails and updates</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={preferencesForm.agreedToMarketingEmails}
                            onChange={(e) => handlePreferencesFormChange('agreedToMarketingEmails', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full transition-colors ${preferencesForm.agreedToMarketingEmails ? 'bg-gray-900' : 'bg-gray-200'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${preferencesForm.agreedToMarketingEmails ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`}></div>
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">SMS Marketing</p>
                          <p className="text-xs text-gray-500 mt-0.5">Receive promotional text messages</p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={preferencesForm.agreedToSmsMarketing}
                            onChange={(e) => handlePreferencesFormChange('agreedToSmsMarketing', e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full transition-colors ${preferencesForm.agreedToSmsMarketing ? 'bg-gray-900' : 'bg-gray-200'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${preferencesForm.agreedToSmsMarketing ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`}></div>
                          </div>
                        </div>
                      </label>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleSavePreferences}
                          disabled={updateLoading}
                          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                          {updateLoading ? 'Saving...' : 'Save Preferences'}
                        </button>
                        <button
                          onClick={handleCancelEditPreferences}
                          className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                            <FiMail className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
                            <p className="text-xs text-gray-500">Promotional emails and updates</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.agreedToMarketingEmails ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {user.agreedToMarketingEmails ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                            <FiPhone className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">SMS Marketing</p>
                            <p className="text-xs text-gray-500">Promotional text messages</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.agreedToSmsMarketing ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {user.agreedToSmsMarketing ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Address Form Dialog */}
      {addressDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleCloseAddressDialog}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
              <button onClick={handleCloseAddressDialog} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address Type</label>
                  <select
                    value={addressForm.addressType}
                    onChange={(e) => handleAddressFormChange('addressType', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {addressForm.addressType === 'other' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Custom Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Vacation Home, Office"
                      value={customAddressType}
                      onChange={(e) => setCustomAddressType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.firstName}
                    onChange={(e) => handleAddressFormChange('firstName', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.lastName}
                    onChange={(e) => handleAddressFormChange('lastName', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company (Optional)</label>
                  <input
                    type="text"
                    value={addressForm.company}
                    onChange={(e) => handleAddressFormChange('company', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={addressForm.address}
                    onChange={(e) => handleAddressFormChange('address', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Apartment, Suite, etc. (Optional)</label>
                  <input
                    type="text"
                    value={addressForm.apartment}
                    onChange={(e) => handleAddressFormChange('apartment', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => handleAddressFormChange('city', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    State/Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => handleAddressFormChange('state', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addressForm.countryId}
                    onChange={(e) => handleAddressFormChange('countryId', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                    disabled={countriesLoading}
                  >
                    {countriesLoading ? (
                      <option value="">Loading...</option>
                    ) : countries.length === 0 ? (
                      <option value="">No countries</option>
                    ) : (
                      countries.map((country) => (
                        <option key={country._id} value={country._id}>
                          {country.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.pinCode}
                    onChange={(e) => handleAddressFormChange('pinCode', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phoneNumber}
                    onChange={(e) => handleAddressFormChange('phoneNumber', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={handleCloseAddressDialog}
                className="px-4 py-2 text-sm border border-gray-200 text-gray-700 rounded-lg hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                disabled={
                  addressesLoading || 
                  !addressForm.firstName || 
                  !addressForm.lastName || 
                  !addressForm.address || 
                  !addressForm.city || 
                  !addressForm.state || 
                  !addressForm.countryId || 
                  !addressForm.pinCode || 
                  !addressForm.phoneNumber ||
                  (addressForm.addressType === 'other' && !customAddressType.trim())
                }
                className="px-6 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {addressesLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={cancelLogout}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiLogOut className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Logout</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to logout from your account?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelLogout}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default StorefrontProfilePage;
