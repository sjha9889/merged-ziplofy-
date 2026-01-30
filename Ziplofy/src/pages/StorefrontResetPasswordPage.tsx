import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Stack, Link, CircularProgress, Alert } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStorefrontAuth } from '../contexts/storefront/storefront-auth.context';
import { useStorefront } from '../contexts/storefront/store.context';

const StorefrontResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, loading } = useStorefrontAuth();
  const { storeFrontMeta } = useStorefront();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const resetToken = searchParams.get('reset-token');
    if (!resetToken) {
      // Redirect to login if no token
      navigate('/auth/login');
      return;
    }
    setToken(resetToken);
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newPassword.trim()) {
      setPasswordError('Password is required');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (!token) {
      setPasswordError('Invalid reset token');
      return;
    }

    if (!storeFrontMeta?.storeId) {
      setPasswordError('Store information not available');
      return;
    }
    
    setPasswordError('');
    
    try {
      await resetPassword({ 
        token, 
        newPassword: newPassword.trim(),
        storeId: storeFrontMeta.storeId
      });

    } catch (error) {
      // Error is handled in the context
    }
  };

  // Show loading if no token yet
  if (!token) {
    return (
      <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 6 }}>
        <Container maxWidth="sm">
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Validating reset token...
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 6 }}>
      <Container maxWidth="sm">
        <Paper elevation={1} sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={800}>Reset Password</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Enter your new password below.
          </Typography>
          
          {passwordError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {passwordError}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 3 }}>
              <TextField 
                label="New Password" 
                type="password" 
                fullWidth 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                helperText="Password must be at least 6 characters long"
              />
              <TextField 
                label="Confirm New Password" 
                type="password" 
                fullWidth 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <Button 
                variant="contained" 
                fullWidth 
                type="submit"
                disabled={loading || !newPassword.trim() || !confirmPassword.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Stack>
          </form>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Remember your password? <Link component="button" onClick={() => navigate('/auth/login')}>Back to login</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default StorefrontResetPasswordPage;
