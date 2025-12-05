import { useState } from "react";
import { apiFetch } from "../../api";

interface BuyButtonProps {
  amount: number;
  course_id: number;

  user?: {
    id: number;
    name: string;
    email: string;
  } | null;

  guestName: string;
  guestEmail: string;
}

export default function BuyButton({
  amount,
  course_id,
  user,
  guestName,
  guestEmail
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    // Require guest info when no user account is present
    if (!user && (!guestName || !guestEmail)) {
      alert("Please enter your name & email");
      return;
    }

    setLoading(true);

    try {
      // 1) CREATE RAZORPAY ORDER
      const order = await apiFetch("/payment/order", {
        method: "POST",
        body: JSON.stringify({
          amount,
          course_id,
          customer_name: guestName,
          customer_email: guestEmail
        })
      });

      if (!order || !order.id) {
        alert("Unable to create payment order.");
        setLoading(false);
        return;
      }

      // 2) CONFIGURE CHECKOUT
      const options: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ProdemyX",
        description: "Course Purchase",
        order_id: order.id,

        prefill: {
          name: user?.name || guestName,
          email: user?.email || guestEmail
        },

        handler: async function (response: any) {
          try {
            // 3) VERIFY PAYMENT
            await apiFetch("/payment/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount,
                course_id,
                customer_name: guestName,
                customer_email: guestEmail
              })
            });

            window.location.href = `/payment-success/${course_id}`;
          } catch (err) {
            console.error(err);
            window.location.href = "/payment-failed";
          }
        }
      };

      // 4) OPEN CHECKOUT
      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error(err);
      alert("Payment could not be started.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={startPayment}
      disabled={loading}
      className="w-[360px] h-[55px]"
      style={{
        backgroundColor: "#F9C93A",
        color: "#000",
        padding: "4px 24px",
        fontWeight: 600,
        borderRadius: "50px",
        border: "2px solid #000",
        boxShadow: "4px 4px 0 #000",
        cursor: loading ? "not-allowed" : "pointer",
        fontSize: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {loading ? "Processing..." : "Enroll Now"}
    </button>
  );
}
