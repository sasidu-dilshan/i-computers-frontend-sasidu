import api from "./api"; // ඔයාගේ axios backend instance එක

export function getCart() {
  const cartInString = localStorage.getItem("cart");

  if (cartInString == null) {
    localStorage.setItem("cart", "[]");
    return [];
  } else {
    try {
      const cart = JSON.parse(cartInString);
      return cart;
    } catch (e) {
      return [];
    }
  }
}

async function syncCartToBackend(cart) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const backendCartPayload = cart.map((item) => ({
      product: item.product._id || item.product.productId,
      qty: item.qty,
    }));

    await api.put(
      "/users/cart",
      { cart: backendCartPayload },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    console.error("Failed to sync cart with backend:", error);
  }
}

export function addToCart(product, qty) {
  const cart = getCart();

  const pId = product._id || product.productId;

  const productIndex = cart.findIndex((item) => {
    const itemPId = item.product._id || item.product.productId;
    return itemPId === pId;
  });

  if (productIndex === -1) {
    if (qty < 1) return;

    cart.push({
      product: {
        _id: pId,
        productId: pId,
        name: product.name,
        image: Array.isArray(product.images) ? product.images[0] : (product.image || product.images),
        price: product.price,
        labelledPrice: product.labelledPrice,
      },
      qty: qty,
    });
  } else {
    cart[productIndex].qty += qty;

    if (cart[productIndex].qty < 1) {
      cart.splice(productIndex, 1);
    }
  }

  const cartInString = JSON.stringify(cart);
  localStorage.setItem("cart", cartInString);

  syncCartToBackend(cart);
}

export async function fetchCartFromBackend() {
  const token = localStorage.getItem("token");
  if (!token) return getCart();

  try {
    const res = await api.get("/users/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data && res.data.cart) {
      const formattedCart = res.data.cart
        .filter((item) => item.product != null)
        .map((item) => ({
          product: {
            _id: item.product._id,
            productId: item.product._id,
            name: item.product.name,
            image: Array.isArray(item.product.images) ? item.product.images[0] : item.product.image,
            price: item.product.price,
            labelledPrice: item.product.labelledPrice,
          },
          qty: item.qty,
        }));

      localStorage.setItem("cart", JSON.stringify(formattedCart));
      return formattedCart;
    }
  } catch (error) {
    console.error("Failed to fetch cart from backend:", error);
  }

  return getCart();
}

export function getCartTotal(cart) {
  let total = 0;
  if (!Array.isArray(cart)) return 0;

  for (let i = 0; i < cart.length; i++) {
    total += (cart[i].product.price || 0) * (cart[i].qty || 0);
  }

  return total;
}

export const clearCart = () => {
  localStorage.removeItem("cart");
  syncCartToBackend([]);
};