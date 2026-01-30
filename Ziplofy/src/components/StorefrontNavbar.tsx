import React from 'react';
import {
	AppBar,
	Toolbar,
	Box,
	Typography,
	IconButton,
	Badge,
	TextField,
	InputAdornment,
	Menu,
	MenuItem,
	Avatar,
	Chip,
	Button,
	useTheme,
	useMediaQuery,
	Fade,
	Slide,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useNavigate } from 'react-router-dom';
import { useStorefront } from '../contexts/storefront/store.context';
import { useStorefrontCart } from '../contexts/storefront/storefront-cart.context';
import { useStorefrontAuth } from '../contexts/storefront/storefront-auth.context';
import CartDrawer from './CartDrawer';

interface StorefrontNavbarProps {
	showBack?: boolean;
	onBack?: () => void;
	showSearch?: boolean;
	searchValue?: string;
	onSearchChange?: (next: string) => void;
}

const StorefrontNavbar: React.FC<StorefrontNavbarProps> = ({ showBack, onBack, showSearch, searchValue, onSearchChange }) => {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const { storeFrontMeta } = useStorefront();
	const { items } = useStorefrontCart();
	const { user, logout } = useStorefrontAuth();
	const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(null);
	const [navbarLoaded, setNavbarLoaded] = React.useState(false);
	const [cartOpen, setCartOpen] = React.useState(false);
	const profileOpen = Boolean(profileAnchor);

	React.useEffect(() => {
		const timer = setTimeout(() => setNavbarLoaded(true), 100);
		return () => clearTimeout(timer);
	}, []);

	const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
		setProfileAnchor(event.currentTarget);
	};
	const handleProfileClose = () => setProfileAnchor(null);

	return (
		<>
		<AppBar 
			position="fixed" 
			elevation={0} 
			sx={{ 
				background: 'rgba(255, 255, 255, 0.95)',
				backdropFilter: 'blur(10px)',
				borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
				color: 'text.primary',
				transition: 'all 0.3s ease'
			}}
		>
			<Toolbar sx={{ 
				gap: 2, 
				py: 1,
				minHeight: '64px !important'
			}}>
				{showBack && (
					<Slide direction="right" in={navbarLoaded} timeout={300}>
						<IconButton 
							aria-label="back" 
							onClick={() => (onBack ? onBack() : navigate(-1))}
							sx={{
								bgcolor: 'rgba(102, 126, 234, 0.1)',
								color: '#667eea',
								'&:hover': {
									bgcolor: 'rgba(102, 126, 234, 0.2)',
									transform: 'scale(1.05)'
								},
								transition: 'all 0.2s ease'
							}}
						>
							<ArrowBackIosNewIcon fontSize="small" />
						</IconButton>
					</Slide>
				)}
				
				<Fade in={navbarLoaded} timeout={500}>
					<Box sx={{ 
						display: 'flex', 
						alignItems: 'center', 
						gap: 1.5,
						cursor: 'pointer',
						'&:hover': { opacity: 0.8 },
						transition: 'opacity 0.2s ease'
					}} onClick={() => navigate('/')}>
						<Box sx={{
							width: 40,
							height: 40,
							borderRadius: 2,
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
						}}>
							<StorefrontIcon sx={{ color: 'white', fontSize: 20 }} />
						</Box>
						<Typography 
							variant="h6" 
							fontWeight={700}
							sx={{ 
								color: 'text.primary',
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								backgroundClip: 'text',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent'
							}}
						>
							{storeFrontMeta?.name || 'Store'}
						</Typography>
					</Box>
				</Fade>

				{showSearch && (
					<Fade in={navbarLoaded} timeout={700}>
						<TextField
							size="small"
							placeholder="Search products..."
							fullWidth
							sx={{ 
								maxWidth: isMobile ? 200 : 400, 
								ml: 2,
								'& .MuiOutlinedInput-root': {
									borderRadius: 3,
									backgroundColor: 'rgba(0, 0, 0, 0.04)',
									'&:hover': {
										backgroundColor: 'rgba(0, 0, 0, 0.08)',
									},
									'&.Mui-focused': {
										backgroundColor: 'white',
										boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)'
									}
								}
							}}
							InputProps={{ 
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon sx={{ color: '#667eea', fontSize: 20 }} />
									</InputAdornment>
								) 
							}}
							value={searchValue || ''}
							onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
						/>
					</Fade>
				)}
				
				<Box sx={{ flexGrow: 1 }} />
				
				<Fade in={navbarLoaded} timeout={900}>
				<IconButton 
						aria-label="cart" 
					onClick={() => setCartOpen(true)}
						sx={{
							bgcolor: 'rgba(102, 126, 234, 0.1)',
							color: '#667eea',
							'&:hover': {
								bgcolor: 'rgba(102, 126, 234, 0.2)',
								transform: 'scale(1.05)'
							},
							transition: 'all 0.2s ease'
						}}
					>
						<Badge 
							badgeContent={items.length} 
							color="error"
							sx={{
								'& .MuiBadge-badge': {
									fontSize: '0.75rem',
									fontWeight: 600,
									background: 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)',
									boxShadow: '0 2px 8px rgba(255, 71, 87, 0.3)'
								}
							}}
						>
							<ShoppingCartIcon />
						</Badge>
					</IconButton>
				</Fade>

				{user && (
					<Fade in={navbarLoaded} timeout={1100}>
						<Chip
							avatar={
								<Avatar sx={{ 
									width: 24, 
									height: 24, 
									bgcolor: '#667eea',
									fontSize: '0.75rem',
									fontWeight: 600
								}}>
									{user.firstName?.charAt(0)?.toUpperCase()}
								</Avatar>
							}
							label={`Hello, ${user.firstName}`}
							variant="outlined"
							sx={{
								borderColor: 'rgba(102, 126, 234, 0.3)',
								color: '#667eea',
								fontWeight: 500,
								'&:hover': {
									bgcolor: 'rgba(102, 126, 234, 0.05)'
								}
							}}
						/>
					</Fade>
				)}

				<Fade in={navbarLoaded} timeout={1300}>
					<IconButton 
						aria-label="account" 
						onClick={handleProfileClick}
						sx={{
							bgcolor: user ? 'rgba(102, 126, 234, 0.1)' : 'rgba(0, 0, 0, 0.04)',
							color: user ? '#667eea' : 'text.secondary',
							'&:hover': {
								bgcolor: user ? 'rgba(102, 126, 234, 0.2)' : 'rgba(0, 0, 0, 0.08)',
								transform: 'scale(1.05)'
							},
							transition: 'all 0.2s ease'
						}}
					>
						<AccountCircleIcon />
					</IconButton>
				</Fade>

				<Menu
					anchorEl={profileAnchor}
					open={profileOpen}
					onClose={handleProfileClose}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					transformOrigin={{ vertical: 'top', horizontal: 'right' }}
					PaperProps={{
						sx: {
							borderRadius: 3,
							boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
							border: '1px solid rgba(0, 0, 0, 0.08)',
							mt: 1
						}
					}}
				>
					{user ? (
						[
							<MenuItem 
								key="profile" 
								sx={{ 
									color: 'text.primary',
									fontWeight: 500,
									py: 1.5,
									px: 2,
									'&:hover': {
										bgcolor: 'rgba(102, 126, 234, 0.08)'
									}
								}} 
								onClick={() => { handleProfileClose(); navigate('/profile'); }}
							>
								<PersonIcon sx={{ mr: 1.5, fontSize: 20, color: '#667eea' }} />
								Profile
							</MenuItem>,
							<MenuItem 
								key="my-orders" 
								sx={{ 
									color: 'text.primary',
									fontWeight: 500,
									py: 1.5,
									px: 2,
									'&:hover': {
										bgcolor: 'rgba(102, 126, 234, 0.08)'
									}
								}} 
								onClick={() => { handleProfileClose(); navigate('/my-orders'); }}
							>
								<ShoppingBagIcon sx={{ mr: 1.5, fontSize: 20, color: '#667eea' }} />
								My Orders
							</MenuItem>,
							<MenuItem 
								key="logout" 
								sx={{ 
									color: 'error.main',
									fontWeight: 500,
									py: 1.5,
									px: 2,
									'&:hover': {
										bgcolor: 'rgba(244, 67, 54, 0.08)'
									}
								}} 
								onClick={() => { handleProfileClose(); logout(); }}
							>
								<LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
								Logout
							</MenuItem>
						]
					) : (
						[
							<MenuItem 
								key="login" 
								sx={{ 
									color: 'text.primary',
									fontWeight: 500,
									py: 1.5,
									px: 2,
									'&:hover': {
										bgcolor: 'rgba(102, 126, 234, 0.08)'
									}
								}} 
								onClick={() => { handleProfileClose(); navigate('/auth/login'); }}
							>
								<LoginIcon sx={{ mr: 1.5, fontSize: 20, color: '#667eea' }} />
								Login
							</MenuItem>,
							<MenuItem 
								key="signup" 
								sx={{ 
									color: 'text.primary',
									fontWeight: 500,
									py: 1.5,
									px: 2,
									'&:hover': {
										bgcolor: 'rgba(102, 126, 234, 0.08)'
									}
								}} 
								onClick={() => { handleProfileClose(); navigate('/auth/signup'); }}
							>
								<PersonAddIcon sx={{ mr: 1.5, fontSize: 20, color: '#667eea' }} />
								Signup
							</MenuItem>
						]
					)}
				</Menu>
			</Toolbar>
		</AppBar>
		<CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
		</>
	);
};

export default StorefrontNavbar;
