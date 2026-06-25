import Navbar from "./Navbar";
import Farmer from "./Farmer";
import './Home.css';
import './App.css'
import Homeimg from "./image/home/img1.jpg";
import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <div id="header">
                {<Navbar />}
                
            </div>

            <div id="content">
                <div className="home-page">

                    {/* herosection */}
                    <section className="hero-section">
                        <div className="hero-image-wrapper">
                            <img src={Homeimg} alt="Lush green farm fields" className="hero-img" />
                            <div className="hero-overlay" />
                        </div>
                        <div className="hero-content">
                            <span className="hero-badge">🌿 Cultivating the Future</span>
                            <h1 className="hero-title">
                                Empowering Farmers,<br />
                                <span className="hero-highlight">Nourishing the World</span>
                            </h1>
                            <p className="hero-subtitle">
                                A one-stop platform connecting farmers with premium seeds, fertilizers,
                                tools, and government schemes — all in one place.
                            </p>
                            <div className="hero-actions">
                                <Link to="/product" className="btn-primary">🛒 Shop Products</Link>
                                <Link to="/login" className="btn-outline">Get Started →</Link>
                            </div>
                        </div>
                    </section>

                    {/* ── STATS ── */}
                    <section className="stats-section">
                        <div className="stat-card">
                            <span className="stat-icon">🌾</span>
                            <h3 className="stat-number">50,000+</h3>
                            <p className="stat-label">Farmers Served</p>
                        </div>
                        <div className="stat-card">
                            <span className="stat-icon">📦</span>
                            <h3 className="stat-number">1,200+</h3>
                            <p className="stat-label">Products Listed</p>
                        </div>
                        <div className="stat-card">
                            <span className="stat-icon">🏛️</span>
                            <h3 className="stat-number">35+</h3>
                            <p className="stat-label">Govt. Schemes</p>
                        </div>
                        <div className="stat-card">
                            <span className="stat-icon">⭐</span>
                            <h3 className="stat-number">4.9 / 5</h3>
                            <p className="stat-label">Farmer Rating</p>
                        </div>
                    </section>

                    {/* ── FEATURES ── */}
                    <section className="features-section">
                        <div className="section-header">
                            <span className="section-tag">What We Offer</span>
                            <h2 className="section-title">Everything a Farmer Needs</h2>
                            <p className="section-sub">
                                From premium farming supplies to financial support, we cover every
                                aspect of modern agriculture.
                            </p>
                        </div>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon-wrap">🌱</div>
                                <h3>Quality Seeds</h3>
                                <p>Certified, high-yield seeds sourced directly from trusted agricultural research centres and farms.</p>
                                <Link to="/product" className="feature-link">Explore Seeds →</Link>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon-wrap">🧪</div>
                                <h3>Fertilizers & Pesticides</h3>
                                <p>Organic and chemical solutions to maximise crop health, soil nutrition, and yield per acre.</p>
                                <Link to="/product" className="feature-link">Shop Now →</Link>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon-wrap">🚜</div>
                                <h3>Farming Tools</h3>
                                <p>Modern and traditional farm equipment to help you work smarter and more efficiently on the field.</p>
                                <Link to="/product" className="feature-link">View Tools →</Link>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon-wrap">📋</div>
                                <h3>Govt. Schemes</h3>
                                <p>Easily discover and apply for state and central government subsidies, loans, and insurance.</p>
                                <Link to="/schemes" className="feature-link">Browse Schemes →</Link>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon-wrap">🐄</div>
                                <h3>Animal Care</h3>
                                <p>Feed, medicines, and equipment for livestock. Keep your animals healthy for maximum productivity.</p>
                                <Link to="/product" className="feature-link">See Products →</Link>
                            </div>
                            <div className="feature-card">
                                <div className="feature-icon-wrap">🌿</div>
                                <h3>Organic Farming</h3>
                                <p>Transition to sustainable, chemical-free farming with our curated organic product range.</p>
                                <Link to="/product" className="feature-link">Go Organic →</Link>
                            </div>
                        </div>
                    </section>

                    <section className="why-section">
                        <div className="why-text">
                            <span className="section-tag">Why Choose Us</span>
                            <h2 className="section-title">Built for Every Indian Farmer</h2>
                            <p className="section-sub">
                                We understand the challenges faced by the farming community and have
                                built a platform that is simple, affordable, and effective.
                            </p>
                            <ul className="why-list">
                                <li><span className="why-check">✔</span> Competitive prices with no middlemen</li>
                                <li><span className="why-check">✔</span> Verified products with quality assurance</li>
                                <li><span className="why-check">✔</span> Doorstep delivery across India</li>
                                <li><span className="why-check">✔</span> 24 / 7 farmer support helpline</li>
                                <li><span className="why-check">✔</span> Available in multiple regional languages</li>
                            </ul>
                            <Link to="/register" className="btn-primary" style={{ display: "inline-block", marginTop: "28px" }}>
                                Join the Community →
                            </Link>
                        </div>
                        <div className="why-card-grid">
                            <div className="why-card accent-green">
                                <span className="why-card-icon">🌍</span>
                                <h4>Eco-Friendly</h4>
                                <p>Promoting sustainable practices for a greener tomorrow.</p>
                            </div>
                            <div className="why-card accent-yellow">
                                <span className="why-card-icon">💰</span>
                                <h4>Affordable</h4>
                                <p>Best prices guaranteed with farmer-first pricing.</p>
                            </div>
                            <div className="why-card accent-blue">
                                <span className="why-card-icon">🔬</span>
                                <h4>Science-Backed</h4>
                                <p>Products tested by agricultural science experts.</p>
                            </div>
                            <div className="why-card accent-orange">
                                <span className="why-card-icon">🤝</span>
                                <h4>Community</h4>
                                <p>A trusted network of 50,000+ Indian farmers.</p>
                            </div>
                        </div>
                    </section>

                    <Farmer />

                    <section className="cta-section">
                        <div className="cta-content">
                            <h2>🌾 Ready to Transform Your Farm?</h2>
                            <p>Join thousands of farmers already using AgriMart to grow better crops, earn more, and access government benefits effortlessly.</p>
                            <div className="cta-actions">
                                <Link to="/register" className="btn-primary">Create Free Account</Link>
                                <Link to="/product" className="btn-outline-white">Browse Products</Link>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
            
                
        </>
    );
}

export default Home;