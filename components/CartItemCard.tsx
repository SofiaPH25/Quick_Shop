
import React from 'react';
import { CartItem } from '../types';
import { useCart } from '../hooks/useCart';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-neutral bg-white rounded-md shadow mb-2">
      <div className="flex items-center space-x-4">
        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
        <div>
          <h3 className="text-lg font-semibold text-neutral-dark">{item.name}</h3>
          <p className="text-primary font-medium">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center border border-neutral rounded">
          <button 
            onClick={() => handleQuantityChange(item.quantity - 1)} 
            className="p-1.5 hover:bg-neutral-light transition-colors disabled:opacity-50"
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            <MinusIcon className="w-4 h-4 text-neutral-dark" />
          </button>
          <span className="px-3 text-neutral-dark">{item.quantity}</span>
          <button 
            onClick={() => handleQuantityChange(item.quantity + 1)} 
            className="p-1.5 hover:bg-neutral-light transition-colors disabled:opacity-50"
            disabled={item.quantity >= item.stock}
            aria-label="Increase quantity"
          >
            <PlusIcon className="w-4 h-4 text-neutral-dark" />
          </button>
        </div>
        <p className="text-md font-semibold text-neutral-dark w-20 text-right">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button 
          onClick={() => removeFromCart(item.id)} 
          className="text-accent hover:text-red-700 transition-colors p-1"
          aria-label="Remove item"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
    