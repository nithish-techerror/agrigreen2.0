import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import "./Profile.css";
import profileimg from "./image/profile/profileimg.jpg";


const API = "http://127.0.0.1:8000";
const categories = ["Vegetables", "Fruits", "Seeds", "Grains", "Tools", "Fertilizers", "Pesticides", "Animals foods"];

/* ─── small helper ─── */
const Field = ({ label, icon, value, name, type = "text", editing, onChange }) => (
  <div className="pf-field">
    <label className="pf-label"><span className="pf-icon">{icon}</span>{label}</label>
    {editing
      ? <input className="pf-input" type={type} name={name} value={value ?? ""} onChange={onChange} />
      : <p className="pf-value">{value || <span className="pf-empty">Not set</span>}</p>}
  </div>
);

function Profile() {
  /* ── state ── */
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState("products"); // "products" | "add"
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [orderCount, setOrderCount] = useState(0);

  const [newPost, setNewPost] = useState({ image: null, price: "", title: "", category: "fruits", description: "" });
  const [adding, setAdding] = useState(false);

  const fileRef = useRef();

   // order count
  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/order-count/", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      setOrderCount(data.order_count);
    });
}, []);

  /* ── load profile ── */
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { setProfile(false); return; }

    fetch(`${API}/api/profile/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setProfile(d); setForm(d); })
      .catch(() => setProfile(false));
  }, []);

  /* ── load my products ── */
useEffect(() => {
  const loadProducts = async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const res = await fetch(`${API}/api/products/my/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch products");
        setPosts([]);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setPosts(data);
      } else if (data.results) {
        setPosts(data.results);
      } else {
        setPosts([]);
      }

    } catch (error) {
      console.error("Error loading products:", error);
      setPosts([]);
    }
  };

  loadProducts();
}, []);

  /* ── save profile ── */
  const saveProfile = async () => {
    setSaving(true);
    const token = localStorage.getItem("access");

    // send only the editable text fields as JSON
    const payload = {
      username: form.username,
      email: form.email,
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone,
      address: form.address,
      state: form.state,
      farm_size: form.farm_size,
    };

    try {
      const r = await fetch(`${API}/api/profile/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const err = await r.json();
        setSaveMsg("❌ " + (err.error || "Update failed."));
        setTimeout(() => setSaveMsg(""), 3500);
        setSaving(false);
        return;
      }
      const d = await r.json();
      setProfile(d); setForm(d); setEditing(false);
      setSaveMsg("✅ Profile updated!"); setTimeout(() => setSaveMsg(""), 3000);
    } catch { setSaveMsg("❌ Network error."); setTimeout(() => setSaveMsg(""), 3000); }
    setSaving(false);
  };

  /* ── add product ── */
  const addPost = async () => {
    if (!newPost.title || !newPost.price || !newPost.image) return alert("Please fill all fields and select an image.");
    setAdding(true);
    const token = localStorage.getItem("access");
    const fd = new FormData();
    fd.append("title", newPost.title);
    fd.append("category", newPost.category);
    fd.append("image", newPost.image);
    fd.append("price", newPost.price);
    if (newPost.description) fd.append("description", newPost.description);

    try {
      const r = await fetch(`${API}/api/products/`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const d = await r.json();
      setPosts(p => [d, ...p]);
      setNewPost({ image: null, price: "", title: "", category: "Fruits", description: "" });
      setTab("products");
    } catch { alert("Failed to add product."); }
    setAdding(false);
  };

  /* ── delete product ── */
  const deletePost = (id) => {
    if (!window.confirm("Delete this product?")) return;
    const token = localStorage.getItem("access");
    fetch(`${API}/api/products/${id}/`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      .then(() => setPosts(p => p.filter(x => x.id !== id)));
  };

  if (profile === null) return (
    <div className="pf-loading"><div className="pf-spinner" /><p>Loading profile…</p></div>
  );
  if (profile === false) return (<>
    <Navbar/>
    <div className="pf-loading"><p>⚠️ Please <a href="/">login</a> again then view profile</p></div>
    </>
  );

  const joined = profile.date_joined ? new Date(profile.date_joined).toLocaleDateString("en-IN", { year: "numeric", month: "long" }) : "—";
 
  return (
    <>
      <Navbar/>

      <div className="pf-page">

        {/* ══ LEFT SIDEBAR ══ */}
        <aside className="pf-sidebar">

          {/* avatar */}
          <div className="pf-avatar-wrap">
            <img
              className="pf-avatar"
              src={avatarPreview || profileimg}
              alt="avatar"
            />
            {editing && (
              <>
                <button className="pf-avatar-btn" onClick={() => fileRef.current.click()}>📷 Change Photo</button>
                <input ref={fileRef} type="file" accept="image/*" hidden
                  onChange={e => {
                    const f = e.target.files[0];
                    if (f) { setForm(v => ({ ...v, avatar: f })); setAvatarPreview(URL.createObjectURL(f)); }
                  }}
                />
              </>
            )}
          </div>

          {/* name + role */}
          <h2 className="pf-name">{profile.first_name ? `${profile.first_name} ${profile.last_name}` : profile.username}</h2>
          <span className="pf-role-badge">🌾 Farmer</span>
          <p className="pf-joined">Member since {joined}</p>

          {/* mini stats */}
          <div className="pf-mini-stats">
            <div className="pf-mini-stat">
              <strong>{posts.length}</strong>
              <span>Products</span>
            </div>
            <div className="pf-mini-stat">
              <strong>{orderCount}</strong>
              <span>Orders</span>
            </div>
            <div className="pf-mini-stat">
              <strong>{profile.rating ?? "—"}</strong>
              <span>Rating</span>
            </div>
          </div>

          {/* contact quick-view */}
          <div className="pf-contact-list">
            <div className="pf-contact-item"><span>📧</span>{profile.email || "—"}</div>
            <div className="pf-contact-item"><span>📞</span>{profile.phone || "Not set"}</div>
            <div className="pf-contact-item"><span>📍</span>{profile.address || "Not set"}</div>
          </div>
        </aside>

        {/* ══ MAIN PANEL ══ */}
        <main className="pf-main">

          {/* ─ Personal Info ─ */}
          <section className="pf-card">
            <div className="pf-card-header">
              <div>
                <h3 className="pf-card-title">👤 Personal Information</h3>
                <p className="pf-card-sub">Your registered details on Agrigreen</p>
              </div>
              <div className="pf-header-actions">
                {saveMsg && <span className="pf-save-msg">{saveMsg}</span>}
                {editing
                  ? <>
                    <button className="pf-btn-cancel" onClick={() => { setEditing(false); setForm(profile); setAvatarPreview(null); }}>Cancel</button>
                    <button className="pf-btn-save" onClick={saveProfile} disabled={saving}>{saving ? "Saving…" : "💾 Save"}</button>
                  </>
                  : <button className="pf-btn-edit" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
                }
              </div>
            </div>

            <div className="pf-fields-grid">
              <Field label="First Name" icon="🧑" value={form.first_name} name="first_name" editing={editing} onChange={e => setForm(v => ({ ...v, first_name: e.target.value }))} />
              <Field label="Last Name" icon="🧑" value={form.last_name} name="last_name" editing={editing} onChange={e => setForm(v => ({ ...v, last_name: e.target.value }))} />
              <Field label="Username" icon="🔖" value={form.username} name="username" editing={editing} onChange={e => setForm(v => ({ ...v, username: e.target.value }))} />
              <Field label="Email" icon="📧" value={form.email} name="email" type="email" editing={editing} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} />
              <Field label="Phone" icon="📞" value={form.phone} name="phone" type="tel" editing={editing} onChange={e => setForm(v => ({ ...v, phone: e.target.value }))} />
              <Field label="State" icon="🗺️" value={form.state} name="state" editing={editing} onChange={e => setForm(v => ({ ...v, state: e.target.value }))} />
              <Field label="Address" icon="📍" value={form.address} name="address" editing={editing} onChange={e => setForm(v => ({ ...v, address: e.target.value }))} />
              <Field label="Farm Size (acres)" icon="🌾" value={form.farm_size} name="farm_size" editing={editing} onChange={e => setForm(v => ({ ...v, farm_size: e.target.value }))} />
            </div>
          </section>

          {/* ─ Products Panel ─ */}
          <section className="pf-card">
            <div className="pf-tab-bar">
              <button className={`pf-tab ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>
                📦 My Products <span className="pf-tab-count">{posts.length}</span>
              </button>
              <button className={`pf-tab ${tab === "add" ? "active" : ""}`} onClick={() => setTab("add")}>
                ➕ Add Product
              </button>
            </div>

            {/* ── My Products ── */}
            {tab === "products" && (
              posts.length === 0
                ? <div className="pf-empty-state">
                  <p className="pf-empty-icon">📦</p>
                  <p>No products yet.</p>
                  <button className="pf-btn-save" onClick={() => setTab("add")}>Add your first product</button>
                </div>
                : <div className="pf-product-grid">
                  {posts.map(post => (
                    <div className="pf-product-card" key={post.id}>
                      <div className="pf-product-img-wrap">
                        <img src={API + post.image} alt={post.title} />
                        <span className="pf-cat-badge">{post.category}</span>
                      </div>
                      <div className="pf-product-body">
                        <h4 className="pf-product-title">{post.title}</h4>
                        {post.description && <p className="pf-product-desc">{post.description}</p>}
                        <p className="pf-product-price">₹ {Number(post.price).toLocaleString("en-IN")}</p>
                        <div className="pf-product-actions">
                          <button className="pf-btn-delete" onClick={() => deletePost(post.id)}>🗑️ Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            )}

            {/* ── Add Product ── */}
            {tab === "add" && (
              <div className="pf-add-form">
                <div className="pf-fields-grid">
                  <div className="pf-field">
                    <label className="pf-label"><span className="pf-icon">📝</span>Product Title</label>
                    <input className="pf-input" placeholder="e.g. Organic Tomatoes" value={newPost.title}
                      onChange={e => setNewPost(v => ({ ...v, title: e.target.value }))} />
                  </div>
                  <div className="pf-field">
                    <label className="pf-label"><span className="pf-icon">🏷️</span>Category</label>
                    <select className="pf-input" value={newPost.category}
                      onChange={e => setNewPost(v => ({ ...v, category: e.target.value }))}>
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="pf-field">
                    <label className="pf-label"><span className="pf-icon">💰</span>Price (₹)</label>
                    <input className="pf-input" type="number" placeholder="0.00" value={newPost.price}
                      onChange={e => setNewPost(v => ({ ...v, price: e.target.value }))} />
                  </div>
                  <div className="pf-field">
                    <label className="pf-label"><span className="pf-icon">🖼️</span>Product Image</label>
                    <input className="pf-input pf-file" type="file" accept="image/*"
                      onChange={e => setNewPost(v => ({ ...v, image: e.target.files[0] }))} />
                  </div>
                </div>
                <div className="pf-field" style={{ marginTop: "4px" }}>
                  <label className="pf-label"><span className="pf-icon">📄</span>Description (optional)</label>
                  <textarea className="pf-input pf-textarea" placeholder="Describe your product…" rows={3}
                    value={newPost.description}
                    onChange={e => setNewPost(v => ({ ...v, description: e.target.value }))} />
                </div>
                <div className="pf-add-actions">
                  <button className="pf-btn-cancel" onClick={() => setTab("products")}>Cancel</button>
                  <button className="pf-btn-save" onClick={addPost} disabled={adding}>{adding ? "Adding…" : "➕ Add Product"}</button>
                </div>
              </div>
            )}
          </section>

        </main>
      </div>
    </>
  );
}

export default Profile;
