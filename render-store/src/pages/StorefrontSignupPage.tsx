import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Stack, Link, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import SlantedImageCarouselWrapper from '../components/SlantedImageCarouselWrapper';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';

const StorefrontSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { storeFrontMeta } = useStorefront();
  const { signup, loading, user} = useStorefrontAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);
  return (
    <SlantedImageCarouselWrapper>
      <Container maxWidth="sm">
        <Paper elevation={2} sx={{ p: 4, bgcolor: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(10px)' }}>
          <Typography variant="h5" fontWeight={800}>Create account</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Join us and start shopping.</Typography>
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="First name" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <TextField label="Last name" fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Stack>
            <TextField label="Email" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" fullWidth disabled={loading} onClick={async () => {
              if (!storeFrontMeta?.storeId) return;
              await signup({ storeId: storeFrontMeta.storeId, firstName, lastName, email, password });
            }}>Create account</Button>
            <Divider>or</Divider>
            <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth>Sign up with Google</Button>
            <Typography variant="body2" color="text.secondary" align="center">
              Already have an account? <Link component="button" onClick={() => navigate('/auth/login')}>Sign in</Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </SlantedImageCarouselWrapper>
  );
};

export default StorefrontSignupPage;


