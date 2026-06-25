import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./Payment.css";

const API = "http://127.0.0.1:8000";

// ── YOUR PHONEPE UPI ID ─────
const PHONEPE_UPI_ID = "9435718129@ybl";
const MERCHANT_NAME = "Agrigreen";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ FIX: moved inside component
  const orderData = location.state?.orderData;
  const quantity = location.state?.quantity || 1;

  const productFromState = location.state?.product || null;

  const [product, setProduct] = useState(productFromState);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ── build UPI string ── */
  const buildUpiString = (amount, note) =>
    `upi://pay?pa=${PHONEPE_UPI_ID}&pn=${encodeURIComponent(
      MERCHANT_NAME
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note || "Payment")}`;

  /* ── build PhonePe deep-link ── */
  const buildPhonePeLink = (amount, note) =>
    `phonepe://pay?pa=${PHONEPE_UPI_ID}&pn=${encodeURIComponent(
      MERCHANT_NAME
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note || "Payment")}`;

  /* ── generate QR ── */
  useEffect(() => {
    if (!product) return;

    const upiStr = buildUpiString(product.price, product.title);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      upiStr
    )}`;

    setQrDataUrl(qrUrl);
  }, [product]);

  /* ── confirm payment ── */
  const handleConfirm = async () => {
    const confirmPay = window.confirm("Have you completed the payment?");
    if (!confirmPay) return;

    setLoading(true);

    const token = localStorage.getItem("access");

    try {
      await fetch(`${API}/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: product.id,
          quantity: quantity,
          payment_type: "UPI",
          status: "PAID",

          // ✅ FIX: now works
          name: orderData?.name,
          email: orderData?.email,
          phone: orderData?.phone,
        }),
      });

      // ✅ FIX: pass data to success page
      navigate("/Myorders", {
        state: {
          product: product.title,
          price: product.price,
          payment_id: "UPI-" + Date.now(),

          name: orderData?.name,
          email: orderData?.email,
          phone: orderData?.phone,
        },
      });

    } catch (e) {
      console.error(e);
      alert("Error saving order!");
    } finally {
      setLoading(false);
    }
  };

  /* ── copy UPI ── */
  const handleCopy = () => {
    navigator.clipboard.writeText(PHONEPE_UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!product)
    return (
      <>
        <Navbar />
        <div className="payment-container">
          <p style={{ color: "red" }}>
            No product selected. Please go back and choose a product.
          </p>
        </div>
      </>
    );

  const isMobile = window.innerWidth < 768;

  return (
    <>
      <Navbar />
      <div className="payment-container">
        <div className="payment-card">

          {/* Product image */}
          <img
            src={
              product.image
                ? product.image.startsWith("http")
                  ? product.image
                  : API + product.image
                : "https://via.placeholder.com/200"
            }
            alt={product.title}
          />

          <h2>{product.title}</h2>
          <p className="price">₹ {product.price}</p>

          <div className="upi-box">

            <div className="phonepe-header">
              <span>Pay via PhonePe / UPI</span>
            </div>

            {!isMobile && qrDataUrl && (
              <div className="qr-wrap">
                <img src={qrDataUrl} alt="Scan QR" className="qr-img" />
                <p className="qr-hint">Scan with any UPI app</p>
              </div>
            )}

            <div className="upi-id-row">
              <span className="upi-id-text">{PHONEPE_UPI_ID}</span>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? "✅ Copied!" : "Copy UPI ID"}
              </button>
            </div>

            {isMobile && (
              <a
                href={buildPhonePeLink(product.price, product.title)}
                className="pay-btn phonepe-btn"
                style={{
                  display: "block",
                  marginBottom: 12,
                  textDecoration: "none",
                }}
              >
                Open PhonePe App 📱
              </a>
            )}

            <button
              className="pay-btn confirm-btn"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Processing..." : "✅ I've Paid — Confirm Order"}
            </button>

            <p className="upi-note">
              * After paying in any UPI app, click confirm.
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;