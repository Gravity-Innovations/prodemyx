import BreadcrumbOne from "../../common/breadcrumb/BreadcrumbOne";
import CartArea from "./CartArea";

const Cart = () => {
  return (
    <>
      <main className="main-area fix">
        <BreadcrumbOne title="Cart" sub_title="Cart" />
        <CartArea />
      </main>
    </>
  );
};

export default Cart;
