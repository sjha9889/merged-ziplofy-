import { Link } from 'react-router-dom';

type Props = {
  storeName: string;
};

/** Storefront footer: store name and real routes only (no demo brand copy). */
export function SwissWristFooter({ storeName }: Props) {
  return (
    <footer className="bg-neutral-950 text-neutral-400">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{storeName}</h3>
            <p className="mt-2 text-sm">Thanks for shopping with us.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm" aria-label="Footer">
            <Link to="/products" className="hover:text-white">
              Products
            </Link>
            <Link to="/collection" className="hover:text-white">
              Collections
            </Link>
            <Link to="/blog" className="hover:text-white">
              Blog
            </Link>
            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
            <Link to="/wishlist" className="hover:text-white">
              Wishlist
            </Link>
          </nav>
        </div>
        <p className="mt-8 border-t border-neutral-800 pt-6 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
