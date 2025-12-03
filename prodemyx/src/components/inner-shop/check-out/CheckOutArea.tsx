import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useState } from "react";
import UseCartInfo from "../../../hooks/UseCartInfo";
import CheckOutForm from "./CheckOutForm";

const CheckOutArea = () => {
  const notify = () => toast("Order Submit");

  const productItem = useSelector((state: RootState) => state.cart.cart);
  const { total } = UseCartInfo();

  // Billing form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="checkout__area section-py-120">
      <div className="container">
        <div className="row">

          {/* Coupon box */}
          <div className="col-12">
            <div className="coupon__code-wrap">
              <div className="coupon__code-info">
                <span><i className="far fa-bookmark"></i> Have a coupon?</span>
                <Link to="#" id="coupon-element">Click here to enter your code</Link>
              </div>
              <form onSubmit={(e) => e.preventDefault()} className="coupon__code-form">
                <p>If you have a coupon code, please apply it below.</p>
                <input type="text" placeholder="Coupon code" />
                <button type="submit" className="btn">Apply coupon</button>
              </form>
            </div>
          </div>

          {/* Billing details form */}
          <CheckOutForm
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setEmail={setEmail}
            setPhone={setPhone}
          />

          {/* ORDER SUMMARY */}
          <div className="col-lg-5">
            <div className="order__info-wrap">
              <h2 className="title">YOUR ORDER</h2>

              <ul className="list-wrap">
                <li className="title">
                  Product <span>Subtotal</span>
                </li>

                {productItem.map((item, index) => (
                  <li key={index}>
                    {item.title} <strong>{item.price.toFixed(2)} x {item.quantity}</strong>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}

                <li>Subtotal <span>${total.toFixed(2)}</span></li>
                <li>Total <span className="amount">${total.toFixed(2)}</span></li>
              </ul>

              <p>Your personal data will be used to process your order.</p>

              <button onClick={notify} className="btn">
                Place order
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckOutArea;
