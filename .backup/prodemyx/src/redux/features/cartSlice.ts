// src/redux/features/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { setLocalStorage, getLocalStorage } from "../../utils/localstorage";

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumb?: string; // Add thumb property
  user_name?: string;
  user_email?: string;
}


interface CartState {
  cart: Product[];
  orderQuantity: number;
}

function getOwnerEmail() {
  const guest = localStorage.getItem("guest_email");
  if (guest) return guest;

  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.role !== "admin") return user.email;
  } catch { }

  return null;
}


function storageKeyForOwner(email: string | null) {
  if (!email) return "cart_anonymous";
  return `cart_${email}`;
}

function loadUserCart(): Product[] {
  const owner = getOwnerEmail();
  return getLocalStorage<Product>(storageKeyForOwner(owner)) || [];
}

function saveUserCart(cart: Product[]) {
  const owner = getOwnerEmail();
  setLocalStorage(storageKeyForOwner(owner), cart);
}

const initialState: CartState = {
  cart: loadUserCart(),
  orderQuantity: 1
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, { payload }: PayloadAction<Product>) => {
      const productIndex = state.cart.findIndex(
        (item) => item.id === payload.id && item.user_email === payload.user_email
      );

      if (productIndex >= 0) {
        state.cart[productIndex].quantity += 1;
        toast.info(`${payload.title} quantity increased`, { position: "top-right" });
      } else {
        const tempProduct = { ...payload, quantity: payload.quantity || 1 };
        state.cart.push(tempProduct);
        toast.success(`${payload.title} added to cart`, { position: "top-right" });
      }

      saveUserCart(state.cart);
    },

    decrease_quantity: (state, { payload }: PayloadAction<Product>) => {
      const cartIndex = state.cart.findIndex(
        (item) => item.id === payload.id && item.user_email === payload.user_email
      );
      if (cartIndex >= 0 && state.cart[cartIndex].quantity > 1) {
        state.cart[cartIndex].quantity -= 1;
        toast.info(`${payload.title} quantity decreased`, { position: "top-right" });
        saveUserCart(state.cart);
      }
    },

    remove_cart_product: (state, { payload }: PayloadAction<Product>) => {
      state.cart = state.cart.filter(
        (item) => !(item.id === payload.id && item.user_email === payload.user_email)
      );
      toast.error(`Removed from your cart`, { position: "top-right" });
      saveUserCart(state.cart);
    },

    // inside cartSlice.ts reducers:
    clear_cart: (state) => {
      // Clear without asking
      state.cart = [];
      setLocalStorage("cart", state.cart);
    },


    get_cart_products: (state) => {
      state.cart = loadUserCart();
    },

    // optional: replace entire cart (useful after login or switching owner)
    replace_cart_for_owner: (state, { payload }: PayloadAction<Product[]>) => {
      state.cart = payload || [];
      saveUserCart(state.cart);
    }
  }
});

export const {
  addToCart,
  decrease_quantity,
  remove_cart_product,
  clear_cart,
  get_cart_products,
  replace_cart_for_owner
} = cartSlice.actions;

export default cartSlice.reducer;
