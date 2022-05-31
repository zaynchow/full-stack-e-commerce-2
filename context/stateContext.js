import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const context = createContext();
export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);
  let foundProduct;

  const onAdd = (product, quantity) => {
    onQtyChange(product, quantity);
    toast.success(`${quantity} ${product.name} added`);
  };

  const onDelete = (product, quantity) => {
    onQtyChange(product, quantity);
    toast.success(`${-1 * quantity} ${product.name} removed`);
  };

  const onQtyChange = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (cartProduct) => cartProduct._id === product._id
    );

    setTotalPrice(totalPrice + product.price * quantity);
    setTotalQuantities(totalQuantities + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) {
          return { ...cartProduct, quantity: cartProduct.quantity + quantity };
        }
        return cartProduct;
      });

      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }
  };

  const toggleCartItemQuantity = (id, val) => {
    foundProduct = cartItems.find((item) => item._id === id);

    if (val === "inc") {
      onAdd(foundProduct, 1);
    } else if (val === "dec") {
      if (foundProduct.quantity > 1) {
        onDelete(foundProduct, -1);
      }
    }
  };

  const onRemove = (id) => {
    foundProduct = cartItems.find((item) => item._id === id);
    onDelete(foundProduct, -foundProduct.quantity);
    console.log(foundProduct.quantity);
    let updatedCart = cartItems.filter((item) => {
      return item._id !== id;
    });
    setCartItems([...updatedCart]);
  };

  const incQty = () => setQty((prev) => prev + 1);
  const decQty = () =>
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });

  return (
    <context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useStateContext = () => useContext(context);
