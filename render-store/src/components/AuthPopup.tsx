import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface AuthPopupProps {
  open: boolean;
  onClose: () => void;
}

const AuthPopup: React.FC<AuthPopupProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/auth/login');
  };

  const handleSignup = () => {
    onClose();
    navigate('/auth/signup');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, p: 1 },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600} align="center">
          Want to add items to cart?
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
          Please login or register with us to add items to your cart and continue shopping.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 3 }}>
        <Button variant="outlined" onClick={handleLogin} sx={{ minWidth: 120 }}>Login</Button>
        <Button variant="contained" onClick={handleSignup} sx={{ minWidth: 120 }}>Sign Up</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthPopup;
