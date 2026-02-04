import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Stack, Link, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefront } from '../contexts/store.context';

const StorefrontForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useStorefrontAuth();
  const { storeFrontMeta } = useStorefront();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !storeFrontMeta?.storeId) return;
    
    try {
      await forgotPassword({ 
        email: email.trim(),
        storeId: storeFrontMeta.storeId
      });
    } catch (error) {
      // Error is handled in the context
    }
  };

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 6 }}>
      <Container maxWidth="sm">
        <Paper elevation={1} sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={800}>Forgot password</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Enter your email address and we'll send you a reset link.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 3 }}>
              <TextField 
                label="Email" 
                type="email" 
                fullWidth 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <Button 
                variant="contained" 
                fullWidth 
                type="submit"
                disabled={loading || !email.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Sending...' : 'Send reset link'}
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

export default StorefrontForgotPasswordPage;


