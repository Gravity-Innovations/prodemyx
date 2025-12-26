// src/pages/CartArea.tsx
import { useState } from "react";
import {
  clear_cart,
  remove_cart_product,
} from "../../../redux/features/cartSlice";

import { useDispatch, useSelector } from "react-redux";
import UseCartInfo from "../../../hooks/UseCartInfo";
import { RootState } from "../../../redux/store";
import { Link } from "react-router-dom";
import { apiFetch } from "../../../api";

/* ======================================================
   Razorpay SDK Loader (CRITICAL)
====================================================== */
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () =>
      reject(new Error("Razorpay SDK failed to load"));

    document.body.appendChild(script);
  });
}

const CartArea = () => {
  const productItem = useSelector((state: RootState) => state.cart.cart);
  const dispatch = useDispatch();
  const { total } = UseCartInfo();

  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestNameInput, setGuestNameInput] = useState("");
  const [guestEmailInput, setGuestEmailInput] = useState("");
  const [guestPhoneInput, setGuestPhoneInput] = useState("");

  /* --------------------------------------------
     Detect logged-in (non-admin) user
  -------------------------------------------- */
  const isLoggedInUser = (() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      return user && user.role !== "admin";
    } catch {
      return false;
    }
  })();

  /* --------------------------------------------
     Save guest details
  -------------------------------------------- */
  const saveGuestDetails = () => {
    if (
      !guestNameInput.trim() ||
      !guestEmailInput.trim() ||
      !guestPhoneInput.trim()
    ) {
      alert("Please enter name, email and phone");
      return;
    }

    registerAndProceed(
      guestNameInput.trim(),
      guestEmailInput.trim(),
      guestPhoneInput.trim()
    );
  };

  const registerAndProceed = async (
    name: string,
    email: string,
    phone: string
  ) => {
    try {
      const response = await apiFetch("/auth/register-guest", {
        method: "POST",
        body: JSON.stringify({ name, email, phone }),
      });

      if (response.success) {
        localStorage.setItem("guest_name", name);
        localStorage.setItem("guest_email", email);
        localStorage.setItem("guest_phone", phone);

        setShowGuestModal(false);
        await startCartPayment(true);
      } else {
        alert(response.message || "Failed to register guest.");
      }
    } catch (err) {
      console.error("Guest registration error:", err);
      alert("Error registering guest.");
    }
  };

  /* --------------------------------------------
     Start Razorpay Payment (FIXED)
  -------------------------------------------- */
  const startCartPayment = async (skipModal = false) => {
    if (!isLoggedInUser && !skipModal) {
      setShowGuestModal(true);
      return;
    }

    if (productItem.length === 0) {
      alert("Your cart is empty");
      return;
    }

    let ownerName = "";
    let ownerEmail = "";
    let ownerPhone = "";

    if (isLoggedInUser) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      ownerName = storedUser?.name || "";
      ownerEmail = storedUser?.email || "";
      ownerPhone = storedUser?.phone || "";
    } else {
      ownerName = localStorage.getItem("guest_name") || "";
      ownerEmail = localStorage.getItem("guest_email") || "";
      ownerPhone = localStorage.getItem("guest_phone") || "";
    }

    if (!ownerName || !ownerEmail || !ownerPhone) {
      alert("Missing name, email, or phone");
      return;
    }

    try {
      /* ---------- ENSURE SDK LOADED ---------- */
      await loadRazorpay();

      if (!(window as any).Razorpay) {
        throw new Error("Razorpay SDK not available");
      }

      const amount = total;
      const course_ids = productItem.map((i: any) => i.id);

      /* ---------- CREATE ORDER ---------- */
      const order = await apiFetch("/payment/order", {
        method: "POST",
        body: JSON.stringify({
          amount,
          course_ids,
          customer_name: ownerName,
          customer_email: ownerEmail,
          customer_phone: ownerPhone,
        }),
      });

      if (!order?.id) {
        throw new Error("Failed to create Razorpay order");
      }

      /* ---------- CHECKOUT ---------- */
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "ProdemyX – Cart Checkout",
        description: "Purchase Multiple Courses",
        order_id: order.id,

        prefill: {
          name: ownerName,
          email: ownerEmail,
          contact: ownerPhone,
        },

        handler: async (response: any) => {
          try {
            await apiFetch("/payment/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount,
                course_ids,
                customer_name: ownerName,
                customer_email: ownerEmail,
                customer_phone: ownerPhone,
              }),
            });

            dispatch(clear_cart());
            window.location.href = "/payment-success";
          } catch (err) {
            console.error("Verification error:", err);
            window.location.href = "/payment-failed";
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Unable to start payment");
    }
  };

  /* --------------------------------------------
     RENDER UI (UNCHANGED)
  -------------------------------------------- */
  return (
    <>
      {/* Guest Modal */}
      {showGuestModal && !isLoggedInUser && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            style={{
              width: "420px",
              background: "#fff",
              padding: "32px",
              borderRadius: "20px",
              border: "2px solid #000",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>
              Enter Your Details
            </h2>

            <input
              type="text"
              placeholder="Your Name"
              value={guestNameInput}
              onChange={(e) => setGuestNameInput(e.target.value)}
              className="form-control mb-2"
            />

            <input
              type="email"
              placeholder="Your Email"
              value={guestEmailInput}
              onChange={(e) => setGuestEmailInput(e.target.value)}
              className="form-control mb-2"
            />

            <input
              type="tel"
              placeholder="Your Phone"
              value={guestPhoneInput}
              onChange={(e) => setGuestPhoneInput(e.target.value)}
              className="form-control mb-4"
            />

            <button onClick={saveGuestDetails} className="btn btn-primary w-100 mb-2">
              Continue To Checkout
            </button>

            <button
              onClick={() => setShowGuestModal(false)}
              className="btn btn-light w-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CART UI */}
      <div className="cart__area section-py-120">
        <div className="container">
          {productItem.length === 0 ? (
            <div className="text-center">
              <p className="py-3">Your Bag is Empty</p>
              <Link to="/Courses">
                <button className="btn">Go To Courses</button>
              </Link>
            </div>
          ) : (
            <div className="row">
              <div className="col-lg-8">
                <table className="table cart__table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Product</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {productItem.map((item: any, i: number) => (
                      <tr key={i}>
                        <td>
                          <img
                            src={item.thumb}
                            alt="cart"
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        </td>
                        <td>
                          <Link to={`/shop-details/${item.id}`}>
                            {item.title}
                          </Link>
                        </td>
                        <td>₹{item.price}.00</td>
                        <td>
                          <a
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              dispatch(remove_cart_product(item))
                            }
                          >
                            ×
                          </a>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={4} className="cart__actions">
                        <button
                          type="button"
                          onClick={() => dispatch(clear_cart())}
                          className="btn btn-danger"
                          style={{ marginLeft: "auto" }}
                        >
                          Clear Cart
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="col-lg-4">
                <div className="cart__collaterals-wrap">
                  <h2 className="title">Cart Totals</h2>
                  <ul className="list-wrap">
                    <li>
                      Subtotal <span>₹{total.toFixed(2)}</span>
                    </li>
                    <li>
                      Total <span>₹{total.toFixed(2)}</span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => startCartPayment()}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartArea;
