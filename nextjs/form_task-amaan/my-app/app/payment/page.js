// app/payment/page.js
import Script from 'next/script';
import PaymentPopup from '../../component/payment';

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-8">Checkout</h1>
        <p className="text-zinc-400 mb-10">Demo Payment Popup</p>
        
        <PaymentPopup customerId={1} />
      </div>
    </div>
  );
}