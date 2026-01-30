import GoogleIcon from '@mui/icons-material/Google';
import { Button, Container, Divider, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SlantedImageCarouselWrapper from '../components/SlantedImageCarouselWrapper';
import { useStorefront } from '../contexts/storefront/store.context';
import { useStorefrontAuth } from '../contexts/storefront/storefront-auth.context';

const StorefrontLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeFrontMeta } = useStorefront();
  const { login, loading,user } = useStorefrontAuth();


  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <SlantedImageCarouselWrapper>
      <Container maxWidth="sm">
        <Paper elevation={2} sx={{ p: 4, bgcolor: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(10px)' }}>
          <Typography variant="h5" fontWeight={800}>Login</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Welcome back! Please sign in to continue.</Typography>
          <Stack spacing={2} sx={{ mt: 3 }}>
            <TextField label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" fullWidth disabled={loading} onClick={async () => {
              if (!storeFrontMeta?.storeId) return;
              await login({ storeId: storeFrontMeta.storeId, email, password });
            }}>Sign in</Button>
            <Divider>or</Divider>
            <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth>Continue with Google</Button>
            <Typography variant="body2" color="text.secondary" align="center">
              <Link component="button" onClick={() => navigate('/auth/forgot-password')}>Forgot password?</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Don't have an account? <Link component="button" onClick={() => navigate('/auth/signup')}>Sign up</Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </SlantedImageCarouselWrapper>
  );
};

export default StorefrontLoginPage;


