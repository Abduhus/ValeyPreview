import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { address, city, country, paymentMethod } = location.state || {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/order-confirmation', { state: { address, city, country, paymentMethod } });
    }, 2000);
  };

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Payment</h1>
      <form className="bg-white rounded-lg shadow p-6" onSubmit={handleSubmit}>
        {paymentMethod === 'card' ? (
          <>
            <label className="block mb-2 font-semibold">Card Number</label>
            <input
              className="w-full mb-4 p-2 border rounded"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              required
              maxLength={19}
            />
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block mb-2 font-semibold">Expiry</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  required
                  maxLength={5}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2 font-semibold">CVC</label>
                <input
                  className="w-full p-2 border rounded"
                  placeholder="123"
                  value={cvc}
                  onChange={e => setCvc(e.target.value)}
                  required
                  maxLength={4}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="mb-6 text-center text-lg font-semibold text-green-700">
            Cash on Delivery selected. No payment required now.
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition disabled:opacity-60"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay & Place Order'}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
