import { Link } from "react-router-dom";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff3f3] px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg text-center border border-red-300">

        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-4"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>

        <h1 className="text-3xl font-bold text-red-600">
          Payment Failed
        </h1>

        <p className="mt-3 text-gray-700 text-lg">
          Something went wrong while processing your payment.
        </p>

        <Link
          to="/cart"
          className="mt-6 inline-block bg-red-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-red-700 transition"
        >
          Try Again
        </Link>

        <p className="mt-4 text-gray-600">
          If money was deducted, it will be refunded automatically.
        </p>
      </div>
    </div>
  );
}
