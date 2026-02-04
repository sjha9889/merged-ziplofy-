import React from 'react';
import { useNavigate } from 'react-router-dom';
import CartDrawer from '../components/CartDrawer';

const StorefrontCartPage: React.FC = () => {
  const navigate = useNavigate();
  return (<CartDrawer open onClose={() => navigate(-1)} />);
};

export default StorefrontCartPage;


