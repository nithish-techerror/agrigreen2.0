import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./App.css";

const API = "http://127.0.0.1:8000";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/api/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("API Response:", data);

        // ✅ handle different API formats
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data.orders) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }

      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  // ❌ Cancel Order
  const cancelOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmDelete) return;

    try {
      await fetch(`${API}/api/orders/${orderId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ remove from UI
      setOrders((prev) => prev.filter((o) => o.id !== orderId));

    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <h2 style={{ textAlign: "center" }}>Loading Orders...</h2>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <h2>📦 My Orders</h2>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="order-card">

              {/* ✅ Safe image */}
              {o.product?.image && (
                <img
                  src={
                    o.product.image.startsWith("http")
                      ? o.product.image
                      : API + o.product.image
                  }
                  alt={o.product?.title}
                />
              )}

              <div className="details">
                <h3>{o.product?.title || "Product"}</h3>
                <p>Qty: {o.quantity}</p>
                <p>
                  Total: ₹
                  {(o.product?.price || 0) * (o.quantity || 1)}
                </p>
                <p>Payment: {o.payment_type}</p>
                <p>
                  Status: <b>{o.status || "Pending"}</b>
                </p>
              </div>

              <div className="order-meta">
                <p>Name: {o.name}</p>
                <p>Email: {o.email}</p>
                <p>Phone: {o.phone}</p>
                <p>Address: {o.address}</p>
              </div>

              {/* ✅ Disable cancel if already cancelled */}
              <button
                className="btn btn-danger"
                onClick={() => cancelOrder(o.id)}
                disabled={o.status === "Cancelled"}
              >
                {o.status === "Cancelled" ? "Cancelled" : "Cancel Order"}
              </button>

            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MyOrders;