import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import "./Payment.css";

const API = "http://127.0.0.1:8000";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  useEffect(() => {
    if (!data) return;

    const saveOrder = async () => {
      const token = localStorage.getItem("access");

      try {
        await fetch(`${API}/api/orders/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            product_name: data?.product,
            amount: data?.price,
            payment_id: data?.payment_id,
            payment_type: "ONLINE",
            status: "PAID",

            
            name: data?.name,
            email: data?.email,
            phone: data?.phone,
          }),
        });

        console.log("Order saved after payment");
      } catch (error) {
        console.error("Error saving order:", error);
      }
    };

    saveOrder();
  }, [data]);

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="payment-success">
          <h2>No Payment Data Found</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="payment-success">
        <h1>✅ Payment Successful</h1>

        <p><b>Product:</b> {data.product}</p>
        <p><b>Amount:</b> ₹{data.price}</p>
        <p><b>Payment ID:</b> {data.payment_id}</p>

         <p><b>Name:</b> {data.name}</p>
        {data.email && <p><b>Email:</b> {data.email}</p>}
        {data.phone && <p><b>Phone:</b> {data.phone}</p>}

        <button onClick={() => navigate("/myorders")}>
          View My Orders
        </button>
      </div>
    </>
  );
}

export default PaymentSuccess;