import React, { useState } from 'react';
import { useCart } from '../hooks/use-cart';
import { useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save order details to context or backend here
    navigate('/payment', { state: { address, city, country, paymentMethod } });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Cart Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul className="divide-y divide-gray-200 mb-4">
            {cartItems.map((item: any) => (
              <li key={item.id} className="py-2 flex justify-between items-center">
                <span>{item.name} <span className="text-xs text-gray-400">x{item.quantity}</span></span>
                <span className="font-semibold">${item.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${cartTotal}</span>
          </div>
        </div>
        {/* Address & Payment */}
        <form className="bg-white rounded-lg shadow p-6" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
          <input
            className="w-full mb-3 p-2 border rounded"
            placeholder="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
          <input
            className="w-full mb-3 p-2 border rounded"
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />
          <input
            className="w-full mb-3 p-2 border rounded"
            placeholder="Country"
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
          />
          <h2 className="text-xl font-semibold mb-4 mt-6">Payment Method</h2>
          <div className="flex gap-4 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              Card
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              Cash on Delivery
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
