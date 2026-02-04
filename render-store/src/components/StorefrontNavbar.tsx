import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useStorefront } from '../contexts/store.context';
import { useStorefrontCart } from '../contexts/storefront-cart.context';
import { useStorefrontAuth } from '../contexts/storefront-auth.context';
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
	const { storeFrontMeta } = useStorefront();
	const { items } = useStorefrontCart();
	const { user, logout } = useStorefrontAuth();
	const [cartOpen, setCartOpen] = React.useState(false);
	const [menuOpen, setMenuOpen] = React.useState(false);

	React.useEffect(() => {
		const onDocClick = () => setMenuOpen(false);
		if (menuOpen) document.addEventListener('click', onDocClick);
		return () => document.removeEventListener('click', onDocClick);
	}, [menuOpen]);

	return (
		<>
		<header className="fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
			<div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
				{showBack && (
					<button
						type="button"
						aria-label="Back"
						onClick={() => (onBack ? onBack() : navigate(-1))}
						className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
					>
						<FiArrowLeft />
					</button>
				)}

				<button
					type="button"
					onClick={() => navigate('/')}
					className="flex items-center gap-2"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow">
						Z
					</div>
					<div className="max-w-[180px] truncate text-left text-base font-semibold text-gray-900 sm:max-w-[260px]">
						{storeFrontMeta?.name || 'Store'}
					</div>
				</button>

				{showSearch && (
					<div className="ml-2 hidden w-full max-w-md items-center rounded-xl bg-gray-100 px-3 py-2 sm:flex">
						<FiSearch className="text-gray-500" />
						<input
							value={searchValue || ''}
							onChange={(e) => onSearchChange?.(e.target.value)}
							placeholder="Search products..."
							className="ml-2 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
						/>
					</div>
				)}

				<div className="flex-1" />

				<button
					type="button"
					onClick={() => setCartOpen(true)}
					className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
					aria-label="Cart"
				>
					<FiShoppingCart />
					{items.length > 0 && (
						<span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-xs font-semibold text-white">
							{items.length}
						</span>
					)}
				</button>

				<div className="relative">
					<button
						type="button"
						onClick={(e) => { e.stopPropagation(); setMenuOpen((s) => !s); }}
						className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gray-100 px-3 text-gray-900 hover:bg-gray-200"
						aria-label="Account menu"
					>
						<FiUser />
						<span className="hidden text-sm font-medium sm:block">
							{user ? user.firstName : 'Account'}
						</span>
					</button>

					{menuOpen && (
						<div
							onClick={(e) => e.stopPropagation()}
							className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg"
						>
							{user ? (
								<>
									<button
										type="button"
										className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
										onClick={() => { setMenuOpen(false); navigate('/profile'); }}
									>
										Profile
									</button>
									<button
										type="button"
										className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
										onClick={() => { setMenuOpen(false); navigate('/my-orders'); }}
									>
										My Orders
									</button>
									<button
										type="button"
										className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
										onClick={() => { setMenuOpen(false); logout(); }}
									>
										Logout
									</button>
								</>
							) : (
								<>
									<button
										type="button"
										className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
										onClick={() => { setMenuOpen(false); navigate('/auth/login'); }}
									>
										Login
									</button>
									<button
										type="button"
										className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-50"
										onClick={() => { setMenuOpen(false); navigate('/auth/signup'); }}
									>
										Signup
									</button>
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</header>
		<CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
		</>
	);
};

export default StorefrontNavbar;
