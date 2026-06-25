import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Productorder.css";
import Navbar from "./Navbar";
import upiic from "./image/upiic/upi.jpeg";

const API = "http://127.0.0.1:8000";

function Order() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const qty = Number(params.get("qty")) || 1;

  const [product, setProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    payment: "COD"
  });

  useEffect(() => {
    const token = localStorage.getItem("access");

    fetch(`${API}/api/products/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.log(err));
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  const total = product.price * qty;

  // SAVE ORDER FUNCTION
  const saveOrder = async () => {
    const token = localStorage.getItem("access");

    try {
      await fetch(`${API}/api/orders/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          product: product.id,
          quantity: qty,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          payment_type: form.payment
        })
      });

    } catch (error) {
      console.error("Order error:", error);
    }
  };

  // CONFIRM ORDER
  const confirmOrder = async () => {

    if (!form.name || !form.phone || !form.address) {
      alert("Please fill all delivery details");
      
      return;
    }

    // ✅ COD
    if (form.payment === "COD") {
      await saveOrder();
      alert("Order placed successfully!");
      navigate("/myorders");
      return;
    }

    // ✅ UPI → REDIRECT TO PHONEPE PAGE
  if (form.payment === "UPI") {
  navigate("/payment", {
    state: {
      product: {
        ...product,
        price: total
      },
      orderData: form,   
      quantity: qty      
    }
  });
  {console.log("Sending Order Data:", orderData);}
  
}

    // ✅ CARD → RAZORPAY
    if (form.payment === "CARD") {

      if (!window.Razorpay) {
        alert("Razorpay not loaded");
        return;
      }

      const options = {
        key: "rzp_test_xxxxxxxxx", // replace with your key
        amount: total * 100,
        currency: "INR",
        name: "Agri Store",
        description: product.title,
        image: product.image,

        handler: async function (response) {
          await saveOrder();

          navigate("/paymentsuccess", {
            state: {
              product: product.title,
              price: total,
              payment_id: response.razorpay_payment_id
            }
          });
        },

        theme: {
          color: "#2e7d32"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <div className="order-layout">

          {/* PRODUCT */}
          <div className="card">
            <h2>Product</h2>

            <img
              src={
                product.image
                  ? product.image.startsWith("http")
                    ? product.image
                    : API + product.image
                  : "https://via.placeholder.com/200"
              }
              width="200"
              alt={product.title}
            />

            <h3>{product.title}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Quantity: {qty}</p>
            <b>Total: ₹{total}</b>
          </div>

          {/* FORM */}
          <div className="card">
            <h2>Delivery & Payment</h2>

            <div className="form-group">
              <label>Full Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <h3 className="section-title">Payment Method</h3>

            <div className="payment-options">

              <label>
                <input
                  type="radio"
                  checked={form.payment === "COD"}
                  onChange={() => setForm({ ...form, payment: "COD" })}
                />
                Cash on Delivery 💵
              </label>

              <label>
                <input
                  type="radio"
                  checked={form.payment === "UPI"}
                  onChange={() => setForm({ ...form, payment: "UPI" })}
                />
                UPI <img src={upiic} alt="UPI" width="120" height="60" />
              </label>

              <label>
                <input
                  type="radio"
                  checked={form.payment === "CARD"}
                  onChange={() => setForm({ ...form, payment: "CARD" })}
                />
                Card 💳
              </label>

            </div>

            <button className="btn btn-primary" onClick={confirmOrder}>
              Confirm & Pay ₹{total} {}
            </button>
              
          </div>
        </div>
      </div>
    </>
  );
}

export default Order;