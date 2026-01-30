import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon } from '@heroicons/react/24/outline';

// Define the types for the modal props to ensure type safety in TypeScript
type ModalProps = {
  onClose: () => void; // Callback function to handle modal close events
  open: boolean; // Boolean to determine if the modal is visible (using 'open' for backward compatibility)
  children: React.ReactNode; // The content to render inside the modal
  width?: number; // Optional width of the modal
  height?: number; // Optional height of the modal
  isCallModal?: boolean; // Optional flag to prevent closing on backdrop click
  title?: React.ReactNode; // Optional title for the modal
  maxWidth?: 'sm' | 'md' | 'lg'; // Optional max width preset
  actions?: React.ReactNode; // Optional action buttons
};

export const Modal = ({
  open = false,
  onClose,
  children,
  width,
  height,
  isCallModal = false,
  title,
  maxWidth = 'sm',
  actions,
}: ModalProps) => {
  // Local state to track whether the modal is mounted (client-side only)
  const [mounted, setMounted] = useState(false);

  // Effect hook to ensure the modal logic runs only on the client side
  useEffect(() => {
    setMounted(true); // Set the mounted state to true when the component is rendered on the client
    return () => setMounted(false); // Cleanup to set the mounted state to false when the component unmounts
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open && mounted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open, mounted]);

  // If the modal is not open or the component is not yet mounted on the client, render nothing
  if (!open || !mounted) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-4xl',
  };

  const modalWidth = width ? `${width}px` : undefined;
  const modalHeight = height ? `${height}px` : undefined;

  // Use React Portals to render the modal content outside of the main DOM hierarchy
  return createPortal(
    <div
      onClick={isCallModal ? () => {} : onClose} // Clicking outside the modal content triggers the `onClose` function (unless it's a call modal)
      className="z-5000 bg-black/20 w-screen h-screen fixed inset-0 flex items-center justify-center"
    >
      {/* Modal content container */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent the click event from propagating to the overlay
        className={`relative bg-white border border-gray-200 w-full ${maxWidthClasses[maxWidth]} ${
          modalHeight ? '' : 'max-h-[calc(100vh-80px)]'
        } flex flex-col shadow-xl`}
        style={{
          width: modalWidth,
          height: modalHeight,
        }}
      >
        {/* Title section */}
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            {typeof title === 'string' ? (
              <h2 className="text-base font-medium text-gray-900">{title}</h2>
            ) : (
              title
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content section */}
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

        {/* Actions section */}
        {actions && (
          <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement // Render the modal into the modal root (defined in index.html)
  );
};

export default Modal;
