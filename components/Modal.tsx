
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-neutral-dark">{title}</h2>
            <button 
              onClick={onClose} 
              className="text-neutral-dark hover:text-accent text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
    