import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Avatar, Box, Button, Card, CardContent, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, Grid, IconButton, InputLabel, List, ListItem, ListItemSecondaryAction, ListItemText, MenuItem, Paper, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StorefrontNavbar from '../components/StorefrontNavbar';
import { CustomerAddress, useCustomerAddresses } from '../contexts/storefront/customer-address-storefront.context';
import { useStorefront } from '../contexts/storefront/store.context';
import { useStorefrontAuth } from '../contexts/storefront/storefront-auth.context';
import { COUNTRIES } from '../constants/countries';

const NAVBAR_HEIGHT = 64;

const StorefrontProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { storeFrontMeta } = useStorefront();
  const { user, checkAuth, updateUser, loading: updateLoading } = useStorefrontAuth();
  const { 
    addresses, 
    loading: addressesLoading, 
    error: addressesError,
    fetchCustomerAddressesByCustomerId,
    addCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress
  } = useCustomerAddresses();

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameForm, setNameForm] = useState({
    firstName: '',
    lastName: ''
  });

  // Preferences editing state
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [preferencesForm, setPreferencesForm] = useState({
    agreedToMarketingEmails: false,
    agreedToSmsMarketing: false
  });

  // Address management state
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  // Load user's first and last name into form when user changes
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

  // Name editing functions
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

  // Preferences editing functions
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

  // Set default address function
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

  // Address management functions
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
    // Check if the address type is not one of the predefined types
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
      // Prepare the address data with custom type if needed
      const addressData = {
        ...addressForm,
        addressType: addressForm.addressType === 'other' && customAddressType.trim() 
          ? customAddressType.trim() 
          : addressForm.addressType
      };

      if (editingAddress) {
        // Update existing address
        await updateCustomerAddress(editingAddress._id, addressData);
      } else {
        // Add new address
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
    return null; // Will redirect to login
  }

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', color: 'text.primary' }}>
      <StorefrontNavbar showBack />

      <Container maxWidth="md" sx={{ pt: `${NAVBAR_HEIGHT + 32}px`, pb: 6 }}>
        {/* Welcome Message */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            fontWeight={800} 
            sx={{ 
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Hello, {user.firstName} 👋
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome to your profile
          </Typography>
        </Box>

        {/* Profile Information Card */}
        <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              {/* Profile Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  {isEditingName ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          label="First Name"
                          value={nameForm.firstName}
                          onChange={(e) => handleNameFormChange('firstName', e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Last Name"
                          value={nameForm.lastName}
                          onChange={(e) => handleNameFormChange('lastName', e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSaveName}
                          disabled={updateLoading || !nameForm.firstName.trim() || !nameForm.lastName.trim()}
                        >
                          {updateLoading ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleCancelEditName}
                          disabled={updateLoading}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h4" fontWeight={700}>
                          {user.firstName} {user.lastName}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={handleEditName}
                          sx={{ 
                            bgcolor: 'primary.50',
                            '&:hover': { bgcolor: 'primary.100' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {user.isVerified && (
                          <Chip 
                            icon={<VerifiedUserIcon />} 
                            label="Verified" 
                            color="success" 
                            size="small" 
                          />
                        )}
                        <Chip 
                          label={user.language} 
                          variant="outlined" 
                          size="small" 
                        />
                      </Stack>
                    </Box>
                  )}
                </Box>
              </Box>

              <Divider />

              {/* Contact Information */}
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Contact Information
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmailIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {user.phoneNumber && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PhoneIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {user.phoneNumber}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Divider />

              {/* Account Information */}
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  Account Information
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarTodayIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(user.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarTodayIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(user.updatedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              {/* Preferences */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Preferences
                  </Typography>
                  {!isEditingPreferences && (
                    <IconButton
                      size="small"
                      onClick={handleEditPreferences}
                      sx={{ 
                        bgcolor: 'primary.50',
                        '&:hover': { bgcolor: 'primary.100' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                
                {isEditingPreferences ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferencesForm.agreedToMarketingEmails}
                          onChange={(e) => handlePreferencesFormChange('agreedToMarketingEmails', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            Marketing Emails
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Receive promotional emails and updates
                          </Typography>
                        </Box>
                      }
                      labelPlacement="start"
                      sx={{ 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        margin: 0,
                        width: '100%'
                      }}
                    />
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={preferencesForm.agreedToSmsMarketing}
                          onChange={(e) => handlePreferencesFormChange('agreedToSmsMarketing', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={500}>
                            SMS Marketing
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Receive promotional text messages
                          </Typography>
                        </Box>
                      }
                      labelPlacement="start"
                      sx={{ 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        margin: 0,
                        width: '100%'
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleSavePreferences}
                        disabled={updateLoading}
                      >
                        {updateLoading ? 'Saving...' : 'Save Preferences'}
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCancelEditPreferences}
                        disabled={updateLoading}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Marketing Emails
                      </Typography>
                      <Chip 
                        label={user.agreedToMarketingEmails ? 'Enabled' : 'Disabled'} 
                        color={user.agreedToMarketingEmails ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        SMS Marketing
                      </Typography>
                      <Chip 
                        label={user.agreedToSmsMarketing ? 'Enabled' : 'Disabled'} 
                        color={user.agreedToSmsMarketing ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Tax Collection
                      </Typography>
                      <Chip 
                        label={user.collectTax.replace('_', ' ').toUpperCase()} 
                        color="info"
                        size="small"
                      />
                    </Box>
                  </Stack>
                )}
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Address Management Section */}
        <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', mt: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOnIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Address Management
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddAddress}
                sx={{ borderRadius: 2 }}
              >
                Add Address
              </Button>
            </Box>

            {addressesError && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  bgcolor: 'error.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'error.200',
                  mb: 2
                }}
              >
                <Typography variant="body2" color="error.main">
                  Error loading addresses: {addressesError}
                </Typography>
              </Paper>
            )}

            {addressesLoading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Loading addresses...
                </Typography>
              </Box>
            ) : addresses.length === 0 ? (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: '2px dashed',
                  borderColor: 'grey.300'
                }}
              >
                <LocationOnIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No addresses saved
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add your first address to get started
                </Typography>
                <Button variant="outlined" onClick={handleAddAddress}>
                  Add Your First Address
                </Button>
              </Paper>
            ) : (
              <List>
                {addresses.map((address, index) => (
                  <ListItem
                    key={address._id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 2,
                      mb: 2,
                      bgcolor: 'white'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {address.firstName} {address.lastName}
                          </Typography>
                          <Chip 
                            label={address.addressType?.toUpperCase() || 'Home'} 
                            size="small" 
                            color="primary" 
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {address.company && `${address.company}, `}
                            {address.address}
                            {address.apartment && `, ${address.apartment}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.city}, {address.state} {address.pinCode}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.country}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            📞 {address.phoneNumber}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Stack direction="row" spacing={1}>
                        {user.defaultAddress === address._id ? (
                          <Chip
                            icon={<StarIcon />}
                            label="Default"
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<StarBorderIcon />}
                            onClick={() => handleSetDefaultAddress(address._id!)}
                            disabled={updateLoading}
                            sx={{ mr: 1 }}
                          >
                            Make Default
                          </Button>
                        )}
                        <IconButton
                          edge="end"
                          onClick={() => handleEditAddress(address)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteAddress(address._id!)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Address Form Dialog */}
        <Dialog 
          open={addressDialogOpen} 
          onClose={handleCloseAddressDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle>
            <Typography variant="h6" fontWeight={600}>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Address Type */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Address Type</InputLabel>
                  <Select
                    value={addressForm.addressType}
                    onChange={(e) => handleAddressFormChange('addressType', e.target.value)}
                    label="Address Type"
                  >
                    <MenuItem value="home">Home</MenuItem>
                    <MenuItem value="work">Work</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Custom Address Type - Only show when "Other" is selected */}
              {addressForm.addressType === 'other' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Custom Address Type"
                    placeholder="Enter address type (e.g., Vacation Home, Office, etc.)"
                    value={customAddressType}
                    onChange={(e) => setCustomAddressType(e.target.value)}
                    required
                    helperText="Please specify the type of address"
                  />
                </Grid>
              )}

              {/* Name Fields */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={addressForm.firstName}
                  onChange={(e) => handleAddressFormChange('firstName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={addressForm.lastName}
                  onChange={(e) => handleAddressFormChange('lastName', e.target.value)}
                  required
                />
              </Grid>

              {/* Company */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company (Optional)"
                  value={addressForm.company}
                  onChange={(e) => handleAddressFormChange('company', e.target.value)}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={addressForm.address}
                  onChange={(e) => handleAddressFormChange('address', e.target.value)}
                  required
                  multiline
                  rows={2}
                />
              </Grid>

              {/* Apartment */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Apartment, suite, etc. (Optional)"
                  value={addressForm.apartment}
                  onChange={(e) => handleAddressFormChange('apartment', e.target.value)}
                />
              </Grid>

              {/* City and State */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={addressForm.city}
                  onChange={(e) => handleAddressFormChange('city', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  value={addressForm.state}
                  onChange={(e) => handleAddressFormChange('state', e.target.value)}
                  required
                />
              </Grid>

              {/* Country and Pin Code */}
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={addressForm.country}
                    onChange={(e) => handleAddressFormChange('country', e.target.value)}
                    label="Country"
                    sx={{ minWidth: 200 }}
                  >
                    {COUNTRIES.map((country) => (
                      <MenuItem key={country.code} value={country.code}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={addressForm.pinCode}
                  onChange={(e) => handleAddressFormChange('pinCode', e.target.value)}
                  required
                />
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={addressForm.phoneNumber}
                  onChange={(e) => handleAddressFormChange('phoneNumber', e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseAddressDialog}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
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
            >
              {addressesLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default StorefrontProfilePage;
