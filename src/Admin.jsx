import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const API = "http://127.0.0.1:8000";
const CATEGORIES = ["Vegetables", "Fruits", "Seeds", "Grains", "Tools", "Fertilizers", "Pesticides", "Animals foods"];

/* ════════════════════════════════════════════
   CANVAS CHART HELPERS (no external library)
   ════════════════════════════════════════════ */

const CHART_COLORS = [
  "#37ee1f", "#1725e9", "#2ecc71", "#e74c3c",
  "#9b59b6", "#1abc9c", "#e67e22", "#fd79a8",
];

function drawBarChart(canvas, labels, values, title) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const W = rect.width, H = rect.height;
  const pad = { top: 20, right: 20, bottom: 60, left: 50 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  ctx.clearRect(0, 0, W, H);

  if (values.length === 0) {
    ctx.fillStyle = "#8b8fa3";
    ctx.font = "14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No data available", W / 2, H / 2);
    return;
  }

  const maxVal = Math.max(...values, 1);
  const barW = Math.min(50, (chartW / values.length) * 0.6);
  const gap = (chartW - barW * values.length) / (values.length + 1);

  // grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + chartH - (chartH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = "#8b8fa3";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(Math.round((maxVal * i) / 4), pad.left - 8, y + 4);
  }

  // bars
  values.forEach((v, i) => {
    const x = pad.left + gap + i * (barW + gap);
    const barH = (v / maxVal) * chartH;
    const y = pad.top + chartH - barH;

    const grad = ctx.createLinearGradient(x, y, x, pad.top + chartH);
    grad.addColorStop(0, CHART_COLORS[i % CHART_COLORS.length]);
    grad.addColorStop(1, CHART_COLORS[i % CHART_COLORS.length] + "44");
    ctx.fillStyle = grad;

    // rounded top
    const r = Math.min(6, barW / 2);
    ctx.beginPath();
    ctx.moveTo(x, pad.top + chartH);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.lineTo(x + barW - r, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
    ctx.lineTo(x + barW, pad.top + chartH);
    ctx.closePath();
    ctx.fill();

    // value on top
    ctx.fillStyle = "#e8e8ec";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(v, x + barW / 2, y - 6);

    // label
    ctx.fillStyle = "#8b8fa3";
    ctx.font = "10px Inter, sans-serif";
    ctx.save();
    ctx.translate(x + barW / 2, pad.top + chartH + 10);
    ctx.rotate(Math.PI / 6);
    ctx.textAlign = "left";
    const lbl = labels[i].length > 12 ? labels[i].slice(0, 12) + "…" : labels[i];
    ctx.fillText(lbl, 0, 0);
    ctx.restore();
  });
}

function drawPieChart(canvas, labels, values) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const W = rect.width, H = rect.height;
  ctx.clearRect(0, 0, W, H);

  const total = values.reduce((a, b) => a + b, 0);
  if (total === 0) {
    ctx.fillStyle = "#8b8fa3";
    ctx.font = "14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No data available", W / 2, H / 2);
    return;
  }

  const cx = W * 0.38, cy = H / 2, radius = Math.min(cx - 20, cy - 20);
  let startAngle = -Math.PI / 2;

  values.forEach((v, i) => {
    const slice = (v / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = CHART_COLORS[i % CHART_COLORS.length];
    ctx.fill();

    // white gap
    ctx.strokeStyle = "#1a1d27";
    ctx.lineWidth = 2;
    ctx.stroke();

    startAngle += slice;
  });

  // donut hole
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = "#222636";
  ctx.fill();

  // center text
  ctx.fillStyle = "#e8e8ec";
  ctx.font = "bold 20px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(total, cx, cy - 6);
  ctx.font = "11px Inter, sans-serif";
  ctx.fillStyle = "#8b8fa3";
  ctx.fillText("Total", cx, cy + 14);

  // legend (right side)
  const legendX = W * 0.68;
  let legendY = 30;
  labels.forEach((l, i) => {
    ctx.fillStyle = CHART_COLORS[i % CHART_COLORS.length];
    ctx.fillRect(legendX, legendY, 12, 12);
    ctx.fillStyle = "#e8e8ec";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    const pct = ((values[i] / total) * 100).toFixed(1);
    ctx.fillText(`${l} (${pct}%)`, legendX + 18, legendY + 6);
    legendY += 24;
  });
}

/* ════════════════════════════════════════════
   ADMIN COMPONENT
   ════════════════════════════════════════════ */

export default function Admin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const isStaff = localStorage.getItem("is_staff") === "true";

  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  // Edit modal
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", price: "", category: "" });

  // Chart refs
  const barRef = useRef(null);
  const pieRef = useRef(null);
  const monthlyRef = useRef(null);
  
  // Auth check
  useEffect(() => {
    if (!token || !isStaff) {
      navigate("/");
    }
  }, [token, isStaff, navigate]);

  // Fetch data
  useEffect(() => {
    if (!token || !isStaff) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API}/api/admin/users/`, { headers }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/products/admin/`, { headers }).then(r => r.ok ? r.json() : []),
      fetch(`${API}/api/orders/admin/analytics/`, { headers }).then(r => r.ok ? r.json() : null),
    ])
      .then(([u, p, a]) => {
        setUsers(Array.isArray(u) ? u : []);
        setProducts(Array.isArray(p) ? p : []);
        setAnalytics(a);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, isStaff]);

  // Draw charts when analytics tab is active
  const drawCharts = useCallback(() => {
    if (!analytics) return;

    // Product sales bar chart
    if (barRef.current && analytics.product_sales) {
      const labels = analytics.product_sales.map(s => s.product__title);
      const values = analytics.product_sales.map(s => s.total_qty);
      drawBarChart(barRef.current, labels, values, "Product Sales");
    }

    // Category pie chart
    if (pieRef.current && analytics.category_sales) {
      const labels = analytics.category_sales.map(s => s.product__category || "Other");
      const values = analytics.category_sales.map(s => s.total_qty);
      drawPieChart(pieRef.current, labels, values);
    }

    // Monthly trend bar chart
    if (monthlyRef.current && analytics.monthly_trend) {
      const labels = analytics.monthly_trend.map(m => m.month);
      const values = analytics.monthly_trend.map(m => m.order_count);
      drawBarChart(monthlyRef.current, labels, values, "Monthly Orders");
    }
  }, [analytics]);

  useEffect(() => {
    if (tab === "analytics") {
      setTimeout(drawCharts, 100);
    }
  }, [tab, drawCharts]);

  // Delete user
  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;
    fetch(`${API}/api/admin/users/${id}/delete/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => {
      if (r.ok) setUsers(u => u.filter(x => x.id !== id));
      else r.json().then(d => alert(d.error || "Failed"));
    });
  };

  // Delete product
  const deleteProduct = (id) => {
    if (!window.confirm("Delete this product?")) return;
    fetch(`${API}/api/products/admin/${id}/delete/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => {
      if (r.ok) setProducts(p => p.filter(x => x.id !== id));
    });
  };

  // Edit product
  const openEdit = (p) => {
    setEditProduct(p);
    setEditForm({ title: p.title, price: p.price, category: p.category });
  };

  const saveEdit = () => {
  if (!editProduct || !editProduct.id) {
    alert("No product selected");
    return;
  }

  fetch(`${API}/api/products/admin/${editProduct.id}/edit/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editForm),
  })
    .then(async (r) => {
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err?.error || "Update failed");
      }
      return r.json();
    })
    .then((updated) => {
      setProducts((p) =>
        p.map((x) => (x.id === updated.id ? updated : x))
      );
      setEditProduct(null);
    })
    .catch((err) => {
      alert(err.message);
    });
};

  // Logout
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("is_staff");
    navigate("/");
  };

  // If not authenticated, don't render anything
  if (!token || !isStaff) {
    return null;
  }

  // Filtered data
  const filteredUsers = users.filter(u =>
    (u.username || "").toLowerCase().includes(searchUser.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    (p.title || "").toLowerCase().includes(searchProduct.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(searchProduct.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-spinner" />
          <p>Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* ══ HEADER ══ */}
      <header className="admin-header">
        <div className="admin-header-left">
          <span className="admin-header-icon"></span>
          <h1>Agrigreen Admin</h1>
        </div>
        <div className="admin-header-right">
          <span className="admin-badge">ADMIN PANEL</span>
          <button className="admin-logout-btn" onClick={logout}>🚪 Logout</button>
        </div>
      </header>

      {/* ══ STAT CARDS ══ */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon users">👥</div>
          <div className="admin-stat-info">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon products">📦</div>
          <div className="admin-stat-info">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon orders">🛒</div>
          <div className="admin-stat-info">
            <h3>{analytics?.total_orders ?? 0}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon revenue">📊</div>
          <div className="admin-stat-info">
            <h3>{analytics?.product_sales?.length ?? 0}</h3>
            <p>Products Sold</p>
          </div>
        </div>
      </div>

      {/* ══ TABS ══ */}
      <div className="admin-tabs">
        <button className={`admin-tab ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>
          👥 Users
        </button>
        <button className={`admin-tab ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>
          📦 Products
        </button>
        <button className={`admin-tab ${tab === "analytics" ? "active" : ""}`} onClick={() => setTab("analytics")}>
          📊 Analytics
        </button>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="admin-content">

        {/* ─── USERS TAB ─── */}
        {tab === "users" && (
          <div className="admin-section" key="users">
            <div className="admin-section-header">
              <h2>👥 All Users ({filteredUsers.length})</h2>
              <input
                className="admin-search"
                placeholder="🔍 Search users…"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
              />
            </div>

            {filteredUsers.length === 0 ? (
              <div className="admin-empty">
                <p className="admin-empty-icon">👥</p>
                <p>No users found.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>State</th>
                    <th>Staff</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          {u.first_name ? `${u.first_name} ${u.last_name}` : u.username}
                        </div>
                      </td>
                      <td>{u.email || "—"}</td>
                      <td>{u.phone || "—"}</td>
                      <td>{u.state || "—"}</td>
                      <td>
                        <span className={`admin-staff-badge ${u.is_staff ? "yes" : "no"}`}>
                          {u.is_staff ? "Staff" : "User"}
                        </span>
                      </td>
                      <td>{new Date(u.date_joined).toLocaleDateString("en-IN")}</td>
                      <td>
                        {!u.is_staff && (
                          <button className="admin-btn-delete" onClick={() => deleteUser(u.id)}>
                            🗑️ Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ─── PRODUCTS TAB ─── */}
        {tab === "products" && (
          <div className="admin-section" key="products">
            <div className="admin-section-header">
              <h2>📦 All Products ({filteredProducts.length})</h2>
              <input
                className="admin-search"
                placeholder="🔍 Search products…"
                value={searchProduct}
                onChange={e => setSearchProduct(e.target.value)}
              />
            </div>

            {filteredProducts.length === 0 ? (
              <div className="admin-empty">
                <p className="admin-empty-icon">📦</p>
                <p>No products found.</p>
              </div>
            ) : (
              <div className="admin-product-grid">
                {filteredProducts.map(p => (
                  <div className="admin-product-card" key={p.id}>
                    <img
                      className="admin-product-img"
                      src={p.image ? (p.image.startsWith("http") ? p.image : API + p.image) : "https://via.placeholder.com/300x180"}
                      alt={p.title}
                    />
                    <div className="admin-product-body">
                      <span className="admin-cat">{p.category}</span>
                      <h4>{p.title}</h4>
                      <p className="admin-price">₹ {Number(p.price).toLocaleString("en-IN")}</p>
                      <p className="admin-owner">👤 {p.user}</p>
                      <div className="admin-product-actions">
                        <button className="admin-btn-edit" onClick={() => openEdit(p)}>✏️ Edit</button>
                        <button className="admin-btn-del" onClick={() => deleteProduct(p.id)}>🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── ANALYTICS TAB ─── */}
        {tab === "analytics" && (
          <div className="admin-section" key="analytics">
            <div className="admin-section-header">
              <h2>📊 Sales Analytics</h2>
            </div>

            <div className="admin-charts">
              {/* Bar chart – Product Sales */}
              <div className="admin-chart-card">
                <h3>🏷️ Product Sales (Quantity)</h3>
                <canvas ref={barRef} style={{ width: "100%", height: "300px" }} />
              </div>

              {/* Pie chart – Category Breakdown */}
              <div className="admin-chart-card">
                <h3>🥧 Category Breakdown</h3>
                <canvas ref={pieRef} style={{ width: "100%", height: "300px" }} />
              </div>

              {/* Monthly Trend */}
              <div className="admin-chart-card full-width">
                <h3>📈 Monthly Order Trend</h3>
                <canvas ref={monthlyRef} style={{ width: "100%", height: "300px" }} />
              </div>
            </div>

            {/* Sales Table */}
            {analytics?.product_sales?.length > 0 && (
              <div className="admin-analytics-table">
                <h3>📋 Product Sales Breakdown</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Total Qty Sold</th>
                      <th>Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.product_sales.map((s, i) => (
                      <tr key={i}>
                        <td>{s.product__title}</td>
                        <td>{s.product__category}</td>
                        <td>{s.total_qty}</td>
                        <td>{s.order_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ EDIT MODAL ══ */}
      {editProduct && (
        <div className="admin-modal-overlay" onClick={() => setEditProduct(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>✏️ Edit Product</h3>

            <label>Title</label>
            <input
              value={editForm.title}
              onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
            />

            <label>Price (₹)</label>
            <input
              type="number"
              value={editForm.price}
              onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
            />

            <label>Category</label>
            <select
              value={editForm.category}
              onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>

            <div className="admin-modal-actions">
              <button className="admin-btn-cancel" onClick={() => setEditProduct(null)}>Cancel</button>
              <button className="admin-btn-save"onClick={saveEdit} disabled={!editProduct}> 💾 Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
