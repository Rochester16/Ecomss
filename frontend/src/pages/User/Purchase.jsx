import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Purchase() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setItems(cart);
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  const handleProceed = () => {
    navigate("/checkout", { state: { items, subtotal, shipping, total } });
  };

  return (
    <div className="purchase-container" style={{ padding: "20px" }}>
      <h2>Your Order Summary</h2>

      {items.length === 0 ? (
        <p>No items in your cart.</p>
      ) : (
        <>
          <div>
            {items.map((item) => (
              <div key={item._id} style={{ marginBottom: "12px" }}>
                <strong>{item.name}</strong> × {item.quantity}  
                <br />
                ₱{item.price * item.quantity}
              </div>
            ))}
          </div>

          <hr />

          <p>Subtotal: ₱{subtotal.toFixed(2)}</p>
          <p>Shipping: ₱{shipping.toFixed(2)}</p>
          <h3>Total: ₱{total.toFixed(2)}</h3>

          <button
            style={{ marginTop: "16px", padding: "10px 20px" }}
            onClick={handleProceed}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
