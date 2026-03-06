import React from 'react';
import { FiLogOut, FiMenu, FiSearch, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import CartDrawer from './CartDrawer';

interface StorefrontNavbarProps {
	showBack?: boolean;
	onBack?: () => void;
	showSearch?: boolean;
	searchValue?: string;
	onSearchChange?: (next: string) => void;
}

const StorefrontNavbar: React.FC<StorefrontNavbarProps> = ({ showSearch, searchValue, onSearchChange }) => {
	const navigate = useNavigate();
	const { storeFrontMeta } = useStorefront();
	const { items, guestItems, isGuest } = useStorefrontCart();
	const { user, logout } = useStorefrontAuth();
	const [cartOpen, setCartOpen] = React.useState(false);
	const [menuOpen, setMenuOpen] = React.useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
	const [searchFocused, setSearchFocused] = React.useState(false);
	const [showLogoutModal, setShowLogoutModal] = React.useState(false);

	const handleLogoutClick = () => {
		setMenuOpen(false);
		setShowLogoutModal(true);
	};

	const confirmLogout = () => {
		setShowLogoutModal(false);
		logout();
		navigate('/');
	};

	const cancelLogout = () => {
		setShowLogoutModal(false);
	};

	React.useEffect(() => {
		const onDocClick = () => setMenuOpen(false);
		if (menuOpen) document.addEventListener('click', onDocClick);
		return () => document.removeEventListener('click', onDocClick);
	}, [menuOpen]);

	// Listen for global \"open-cart-drawer\" events so other pages (like product detail)
	// can trigger the cart drawer to open.
	React.useEffect(() => {
		const handler = () => setCartOpen(true);
		window.addEventListener('open-cart-drawer', handler);
		return () => window.removeEventListener('open-cart-drawer', handler);
	}, []);

	// Get all cart items (both authenticated and guest)
	const displayItems = isGuest ? guestItems : items;
	const totalItems = displayItems.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<>
			<header className="fixed inset-x-0 top-0 z-50 bg-[#fefcf8]/95 backdrop-blur-md border-b border-[#e8e0d5]/60 shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between gap-4">
						{/* Logo and Store Name */}
						<button
							type="button"
							onClick={() => navigate('/')}
							className="flex items-center gap-3 group"
						>
							<div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#e6c547] flex items-center justify-center text-[#0c100c] text-sm font-semibold group-hover:shadow-lg transition-all duration-200">
								<span style={{ fontFamily: 'var(--font-serif)' }}>
									{storeFrontMeta?.name?.charAt(0) || 'Z'}
								</span>
							</div>
							<div className="hidden sm:block">
								<div className="text-sm font-semibold text-[#0c100c] group-hover:text-[#d4af37] transition-colors" style={{ fontFamily: 'var(--font-serif)' }}>
									{storeFrontMeta?.name || 'Store'}
								</div>
								<div className="text-xs text-[#2b1e1e]">Premium Shopping</div>
							</div>
						</button>

						{/* Search Bar */}
						{showSearch && (
							<div className={`hidden md:flex flex-1 max-w-2xl mx-8 items-center rounded-lg bg-[#f5f1e8] border transition-all duration-200 ${
								searchFocused ? 'border-[#d4af37] bg-white shadow-sm' : 'border-transparent'
							}`}>
								<FiSearch className={`ml-4 w-4 h-4 transition-colors duration-200 ${
									searchFocused ? 'text-[#d4af37]' : 'text-[#2b1e1e]/60'
								}`} />
								<input
									value={searchValue || ''}
									onChange={(e) => onSearchChange?.(e.target.value)}
									onFocus={() => setSearchFocused(true)}
									onBlur={() => setSearchFocused(false)}
									placeholder="Search products..."
									className="flex-1 ml-3 py-2.5 bg-transparent text-sm text-[#0c100c] outline-none placeholder:text-[#2b1e1e]/50"
								/>
							</div>
						)}

						{/* Right Side Actions */}
						<div className="flex items-center gap-2">
							{/* Cart Button */}
							<button
								type="button"
								onClick={() => setCartOpen(true)}
								className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#0c100c] hover:bg-[#f5f1e8] hover:text-[#d4af37] transition-all duration-200"
								aria-label="Cart"
							>
								<FiShoppingCart className="w-5 h-5" />
								{totalItems > 0 && (
									<span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#d4af37] px-1.5 text-xs font-medium text-[#0c100c]">
										{totalItems}
									</span>
								)}
							</button>

							{/* User Menu */}
							<div className="relative">
								<button
									type="button"
									onClick={(e) => { e.stopPropagation(); setMenuOpen((s) => !s); }}
									className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-[#0c100c] hover:bg-[#f5f1e8] transition-all duration-200"
									aria-label="Account menu"
								>
									<div className="h-8 w-8 rounded-lg bg-[#e8e0d5] flex items-center justify-center text-[#0c100c] text-xs font-medium">
										{user ? user.firstName.charAt(0).toUpperCase() : <FiUser className="w-4 h-4" />}
									</div>
									<span className="hidden sm:block text-sm font-medium">
										{user ? user.firstName : 'Account'}
									</span>
								</button>

								{/* Dropdown Menu */}
								{menuOpen && (
									<div
										onClick={(e) => e.stopPropagation()}
										className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-[#e8e0d5] bg-[#fefcf8] shadow-lg"
									>
										{user ? (
											<>
												<div className="border-b border-[#e8e0d5] px-4 py-3 bg-[#f5f1e8]">
													<p className="text-sm font-semibold text-[#0c100c]">{user.firstName} {user.lastName}</p>
													<p className="text-xs text-[#2b1e1e] mt-0.5 truncate">{user.email}</p>
												</div>
												<div className="py-1.5">
													<button
														type="button"
														className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-[#0c100c] hover:bg-[#f5f1e8] transition-colors duration-200"
														onClick={() => { setMenuOpen(false); navigate('/profile'); }}
													>
														<FiUser className="w-4 h-4 text-[#d4af37]" />
														Profile
													</button>
													<button
														type="button"
														className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-[#0c100c] hover:bg-[#f5f1e8] transition-colors duration-200"
														onClick={() => { setMenuOpen(false); navigate('/my-orders'); }}
													>
														<FiShoppingCart className="w-4 h-4 text-[#d4af37]" />
														My Orders
													</button>
												</div>
												<hr className="border-[#e8e0d5]" />
												<div className="py-1.5">
													<button
														type="button"
														className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
														onClick={handleLogoutClick}
													>
														<FiLogOut className="w-4 h-4" />
														Logout
													</button>
												</div>
											</>
										) : (
											<div className="py-1.5">
												<button
													type="button"
													className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-[#0c100c] hover:bg-[#f5f1e8] transition-colors duration-200"
													onClick={() => { setMenuOpen(false); navigate('/auth/login'); }}
												>
													Login
												</button>
												<button
													type="button"
													className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-[#0c100c] hover:bg-[#f5f1e8] transition-colors duration-200"
													onClick={() => { setMenuOpen(false); navigate('/auth/signup'); }}
												>
													Signup
												</button>
											</div>
										)}
									</div>
								)}
							</div>

							{/* Mobile Menu Button */}
							<button
								type="button"
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
								aria-label="Menu"
							>
								{mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
							</button>
						</div>
					</div>

					{/* Mobile Search */}
					{showSearch && mobileMenuOpen && (
						<div className="md:hidden pb-4 pt-4 border-t border-[#e8e0d5]">
							<div className="flex items-center rounded-lg bg-[#f5f1e8] border border-[#e8e0d5] px-3 py-2">
								<FiSearch className="w-4 h-4 text-[#2b1e1e]/60" />
								<input
									value={searchValue || ''}
									onChange={(e) => onSearchChange?.(e.target.value)}
									placeholder="Search products..."
									className="flex-1 ml-2 bg-transparent text-sm text-[#0c100c] outline-none placeholder:text-[#2b1e1e]/50"
								/>
							</div>
						</div>
					)}
				</div>
			</header>
			<CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

			{/* Logout Confirmation Modal */}
			<AnimatePresence>
				{showLogoutModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
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
		</>
	);
};

export default StorefrontNavbar;
