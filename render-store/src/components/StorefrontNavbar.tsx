import React from 'react';
import { FiLogOut, FiSearch, FiShoppingBag, FiUser, FiX, FiChevronDown, FiPackage } from 'react-icons/fi';
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
	};

	const cancelLogout = () => {
		setShowLogoutModal(false);
	};

	React.useEffect(() => {
		const onDocClick = () => setMenuOpen(false);
		if (menuOpen) document.addEventListener('click', onDocClick);
		return () => document.removeEventListener('click', onDocClick);
	}, [menuOpen]);

	React.useEffect(() => {
		const handler = () => setCartOpen(true);
		window.addEventListener('open-cart-drawer', handler);
		return () => window.removeEventListener('open-cart-drawer', handler);
	}, []);

	const displayItems = isGuest ? guestItems : items;
	const totalItems = displayItems.reduce((sum, item) => sum + item.quantity, 0);

	return (
		<>
			<header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between gap-6">
						{/* Logo and Store Name */}
						<button
							type="button"
							onClick={() => navigate('/')}
							className="flex items-center gap-3 group flex-shrink-0"
						>
							<div className="h-9 w-9 rounded-xl bg-gray-900 flex items-center justify-center text-white text-sm font-semibold group-hover:scale-105 transition-transform duration-200">
								{storeFrontMeta?.name?.charAt(0) || 'S'}
							</div>
							<div className="hidden sm:block">
								<div className="text-[15px] font-semibold text-gray-900 tracking-tight">
									{storeFrontMeta?.name || 'Store'}
								</div>
							</div>
						</button>

						{/* Search Bar - Centered */}
						{showSearch && (
							<div className="hidden md:flex flex-1 max-w-lg mx-auto">
								<div className={`w-full flex items-center rounded-full transition-all duration-300 ${
									searchFocused 
										? 'bg-white ring-2 ring-gray-900 shadow-lg' 
										: 'bg-gray-100 hover:bg-gray-50'
								}`}>
									<FiSearch className={`ml-4 w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
										searchFocused ? 'text-gray-900' : 'text-gray-400'
									}`} />
									<input
										value={searchValue || ''}
										onChange={(e) => onSearchChange?.(e.target.value)}
										onFocus={() => setSearchFocused(true)}
										onBlur={() => setSearchFocused(false)}
										placeholder="Search products..."
										className="flex-1 px-3 py-2.5 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
									/>
									{searchValue && (
										<button
											type="button"
											onClick={() => onSearchChange?.('')}
											className="mr-3 p-1 rounded-full hover:bg-gray-200 transition-colors"
										>
											<FiX className="w-3.5 h-3.5 text-gray-400" />
										</button>
									)}
								</div>
							</div>
						)}

						{/* Right Side Actions */}
						<div className="flex items-center gap-1">
							{/* Mobile Search Toggle */}
							{showSearch && (
								<button
									type="button"
									onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
									className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
									aria-label="Search"
								>
									<FiSearch className="w-5 h-5" />
								</button>
							)}

							{/* Cart Button */}
							<button
								type="button"
								onClick={() => setCartOpen(true)}
								className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 transition-all duration-200"
								aria-label="Cart"
							>
								<FiShoppingBag className="w-5 h-5" />
								{totalItems > 0 && (
									<span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-900 px-1.5 text-[10px] font-semibold text-white">
										{totalItems}
									</span>
								)}
							</button>

							{/* User Menu */}
							<div className="relative">
								<button
									type="button"
									onClick={(e) => { e.stopPropagation(); setMenuOpen((s) => !s); }}
									className="inline-flex h-10 items-center justify-center gap-2 rounded-full px-2 text-gray-700 hover:bg-gray-100 transition-all duration-200"
									aria-label="Account menu"
								>
									{user ? (
										<div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-xs font-semibold">
											{user.firstName.charAt(0).toUpperCase()}
										</div>
									) : (
										<div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
											<FiUser className="w-4 h-4" />
										</div>
									)}
									<FiChevronDown className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
								</button>

								{/* Dropdown Menu */}
								<AnimatePresence>
									{menuOpen && (
										<motion.div
											initial={{ opacity: 0, y: 8, scale: 0.96 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: 8, scale: 0.96 }}
											transition={{ duration: 0.15 }}
											onClick={(e) => e.stopPropagation()}
											className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100"
										>
											{user ? (
												<>
													<div className="px-4 py-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
														<div className="flex items-center gap-3">
															<div className="h-11 w-11 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
																{user.firstName.charAt(0).toUpperCase()}
															</div>
															<div className="min-w-0">
																<p className="text-sm font-semibold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
																<p className="text-xs text-gray-500 truncate">{user.email}</p>
															</div>
														</div>
													</div>
													<div className="py-2">
														<button
															type="button"
															className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
															onClick={() => { setMenuOpen(false); navigate('/profile'); }}
														>
															<FiUser className="w-4 h-4 text-gray-400" />
															<span>My Profile</span>
														</button>
														<button
															type="button"
															className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
															onClick={() => { setMenuOpen(false); navigate('/my-orders'); }}
														>
															<FiPackage className="w-4 h-4 text-gray-400" />
															<span>My Orders</span>
														</button>
													</div>
													<div className="border-t border-gray-100 py-2">
														<button
															type="button"
															className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
															onClick={handleLogoutClick}
														>
															<FiLogOut className="w-4 h-4" />
															<span>Sign out</span>
														</button>
													</div>
												</>
											) : (
												<div className="p-4">
													<p className="text-sm text-gray-500 mb-3">Welcome! Sign in to access your account.</p>
													<div className="space-y-2">
														<button
															type="button"
															className="w-full px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-150"
															onClick={() => { setMenuOpen(false); navigate('/auth/login'); }}
														>
															Sign in
														</button>
														<button
															type="button"
															className="w-full px-4 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
															onClick={() => { setMenuOpen(false); navigate('/auth/signup'); }}
														>
															Create account
														</button>
													</div>
												</div>
											)}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>

					{/* Mobile Search */}
					<AnimatePresence>
						{showSearch && mobileMenuOpen && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="md:hidden overflow-hidden"
							>
								<div className="pb-4 pt-2">
									<div className="flex items-center rounded-full bg-gray-100 px-4 py-2.5">
										<FiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
										<input
											value={searchValue || ''}
											onChange={(e) => onSearchChange?.(e.target.value)}
											placeholder="Search products..."
											className="flex-1 ml-3 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
											autoFocus
										/>
										{searchValue && (
											<button
												type="button"
												onClick={() => onSearchChange?.('')}
												className="p-1 rounded-full hover:bg-gray-200 transition-colors"
											>
												<FiX className="w-4 h-4 text-gray-400" />
											</button>
										)}
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
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
						className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
						onClick={cancelLogout}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ type: 'spring', damping: 25, stiffness: 300 }}
							className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="p-6 text-center">
								<div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
									<FiLogOut className="w-6 h-6 text-red-500" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">Sign out</h3>
								<p className="text-sm text-gray-500 mb-6">
									Are you sure you want to sign out of your account?
								</p>
								<div className="flex gap-3">
									<button
										onClick={cancelLogout}
										className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
									>
										Cancel
									</button>
									<button
										onClick={confirmLogout}
										className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors"
									>
										Sign out
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
