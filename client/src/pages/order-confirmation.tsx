import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, city, country, paymentMethod } = location.state || {};

  return (
    <div className="max-w-lg mx-auto py-16 px-4 text-center">
      <div className="mb-8">
        <svg className="mx-auto mb-4" width="64" height="64" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-lg text-gray-600 mb-4">Your order has been placed successfully.</p>
        <p className="italic text-gray-500 mb-6">“Perfume is the art that makes memory speak.”</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 text-left mb-8">
        <h2 className="text-xl font-semibold mb-2">Order Details</h2>
        <div className="mb-2"><span className="font-semibold">Shipping Address:</span> {address}, {city}, {country}</div>
        <div className="mb-2"><span className="font-semibold">Payment Method:</span> {paymentMethod === 'card' ? 'Card' : 'Cash on Delivery'}</div>
      </div>
      <button
        className="bg-black text-white py-3 px-8 rounded font-bold hover:bg-gray-800 transition"
        onClick={() => navigate('/')}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmationPage;
