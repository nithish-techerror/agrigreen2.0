import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Home.css";
import "./App.css";

function ForgetPassword() {
  const navigate = useNavigate();

 
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/check-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Email verified! Please set a new password.");
        setStep(2);
      } else {
        setError(data.error || "Email not found. Please try again.");
      }
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  /* ── STEP 2: reset the password ── */
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Password reset successfully! Please login.");
        navigate("/");
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div id="content">
        <center>
        <div className="login-con">
          <div className="login-con2" style={{ width: "100%", maxWidth: 420 }}>
            <h1>Forgot Password</h1>

            {/* ── progress indicator ── */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <span
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 4,
                  background: step >= 1 ? "#4caf50" : "#ddd",
                  transition: "background 0.3s",
                }}
              />
              <span
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 4,
                  background: step >= 2 ? "#4caf50" : "#ddd",
                  transition: "background 0.3s",
                }}
              />
            </div>

            {/* ── feedback messages ── */}
            {message && (
              <p style={{ color: "#4caf50", fontWeight: 600, marginBottom: 10 }}>
                ✅ {message}
              </p>
            )}
            {error && (
              <p style={{ color: "#e53935", fontWeight: 600, marginBottom: 10 }}>
                ❌ {error}
              </p>
            )}

             {/* Email  */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="login-from">
                <h3>
                  Registered Email
                  <br />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="login-style"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </h3>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Checking…" : "Verify Email"}
                </button>
              </form>
            )}

            {/* New Password */}
            {step === 2 && (
              <form onSubmit={handleResetSubmit} className="login-from">
                <h3>
                  New Password
                  <br />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="login-style"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </h3>
                <h3>
                  Confirm Password
                  <br />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="login-style"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </h3>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Resetting…" : "Reset Password"}
                </button>
              </form>
            )}

            <br />
            <a
              href="/"
              style={{ color: "#4caf50", fontWeight: 500, cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              ← Back to Login
            </a>
          </div>
        </div>
        </center>
      </div>
    </>
  );
}

export default ForgetPassword;