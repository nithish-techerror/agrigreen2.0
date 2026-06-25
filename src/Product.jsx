import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./App.css"
import OrderNav from "./OrderNav";

const API = "http://127.0.0.1:8000";

// ----- ADS -----
function Ads() {
  return (
    <div className="ads">
      <h3>🌾 Agrigreen</h3>
      <p> fixed rate delivey at packet</p>
    </div>
  );
}

// ----- SIDEBAR -----
function Sidebar() {
  return (
    <div className="side-bar">
      <ul>
        <li><Link to="/product" className="sidea">All Products</Link></li>
          <li><Link to="/product/vegetables" className="sidea">Vegetables</Link></li>
        <li><Link to="/product/seeds" className="sidea">Seeds</Link></li>
        <li><Link to="/product/fruits" className="sidea">Fruits</Link></li>
        <li><Link to="/product/grains" className="sidea">Grains</Link></li>
        <li><Link to="/product/fertilizers" className="sidea">Fertilizers</Link></li>
                <li><Link to="/product/pesticides" className="sidea">pesticides</Link></li>
        <li><Link to="/product/tools" className="sidea">Tools</Link></li>
      </ul>
    </div>
  );
}

//  PRODUCT PAGE
function Product() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const token = localStorage.getItem("access");

  useEffect(() => {
    setLoading(true);

    fetch(`${API}/api/products/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        let list = Array.isArray(data) ? data : data.results || [];

        // CATEGORY FILTER
        if (category) {
          list = list.filter(
            p =>
              p.category &&
              p.category.toLowerCase() === category.toLowerCase()
          );
        }

        // Default quantity = 1
        const qtyObj = {};
        list.forEach(p => (qtyObj[p.id] = 0));

        setQuantities(qtyObj);
        setProducts(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, token]);

  const changeQty = (id, value) => {
    if (value < 0) return;
    setQuantities({ ...quantities, [id]: value });
  };

  const deleteProduct = (id) => {
    if (!window.confirm("Delete this product?")) return;

    fetch(`${API}/api/products/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setProducts(products.filter(p => p.id !== id));
    });
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <>
    {/* navbar */}
      <Navbar />
    {/* ads block */}
      <Ads />
      {/* toolbar */}
      <Sidebar />

      <div className="product-container">
        {products.length === 0 ? (
          <h2> <center>Login First Then Show The Products....</center></h2>
        ) : (
          products.map(p => (
            <div key={p.id} className="product-card">
              <img
                src={
                  p.image
                    ? p.image.startsWith("http")
                      ? p.image
                      : API + p.image
                    : "https://via.placeholder.com/150"
                }
                alt={p.title}
              />

              <h3>{p.title}</h3>
              <p>₹ {p.price}</p>

              {/* Quantity */}
              <div className="qty-box">
                <button onClick={() => changeQty(p.id, quantities[p.id] - 1)} className="prdt-quty">
                  -
                </button>
                <span>{quantities[p.id]}</span>
                <button onClick={() => changeQty(p.id, quantities[p.id] + 1)} className="prdt-quty">
                  +
                </button>
              </div>

              <button
                onClick={() =>
                  navigate(`/order/${p.id}?qty=${quantities[p.id]}`)
                }
                className="buy-now"
              >
                Buy Now
              </button>
            </div>
          ))
        )}
      </div>
      <div><OrderNav /></div>
    </>
  );
}

export default Product;
