import React, { useState } from "react";
import Navbar from "./Navbar";
import "./Guide.css";
import fertilizer from './image/guide/fertilizer.png';
import vegetable from './image/guide/vegetable.png'
import pesiticide from './image/guide/pesiticides.png'


const product_guides = [
    {
        id: 1,
        product_name: "TOMATO",
        category: "vegetables",
        description:
            "Learn how to apply organic fertilizers for maximum yield. Covers dosage, timing, and soil preparation.",
        icon:vegetable,
        ppt_url: "https://docs.google.com/presentation/d/1V34rbHpCMEdldx4nSWDiVaw7wxDpVaQPwZkDea8_QY4/edit?usp=sharing", 
        color: "#f2f3f2",
    },
    {
        id: 2,
        product_name: "Pesticide Safety Manual",
        category: "Pesticides",
        description:
            "Safe handling, storage, and application of pesticides. Includes safety gear recommendations and first-aid.",
        icon:pesiticide,
        ppt_url:"",
        color: "#fdf9f9",
    },
     {
        id: 3,
        product_name: "FERTILIZER",
        category: "fertilizers",
        description:
            "Safe handling, storage, and application of pesticides. Includes safety gear recommendations and first-aid.",
        icon: fertilizer,
        ppt_url: "https://docs.google.com/presentation/d/1I4Rn5g4zEoT6-cilghtH8uTZ7O2NiE1L/edit?usp=drive_link&ouid=102948466378852662191&rtpof=true&sd=true",
        color: "#fdf9f9",
    },
    {
        id: 4,
        product_name: "DAP FERTILIZER",
        category: "fertilizers",
        description:
            "Safe handling, storage, and application of pesticides. Includes safety gear recommendations and first-aid.",
        icon:fertilizer,
        ppt_url: "https://docs.google.com/presentation/d/1TAs-Vj9BxoY4vGnhZRhrzZNKNvoACnxD/edit?usp=drive_link&ouid=102948466378852662191&rtpof=true&sd=true",
        color: "#fdf9f9",
    },
     {
        id: 5,
        product_name: "ONION FARMING ",
        category: "vegetables",
        description:"Learn how to apply organic fertilizers for maximum yield. Covers dosage, timing, and soil preparation.",
        icon:vegetable,
        ppt_url: "https://docs.google.com/presentation/d/1TAs-Vj9BxoY4vGnhZRhrzZNKNvoACnxD/edit?usp=drive_link&ouid=102948466378852662191&rtpof=true&sd=true",
        color: "#fdf9f9",
    },
];

function Guide() {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", ...new Set(product_guides.map((g) => g.category))];

    const filtered = product_guides.filter((g) => {
        const matchSearch =
            g.product_name.toLowerCase().includes(search.toLowerCase()) ||
            g.description.toLowerCase().includes(search.toLowerCase());
        const matchCat =
            activeCategory === "All" || g.category === activeCategory;
        return matchSearch && matchCat;
    });

    const openGuide = (guide) => {
        setSelected(guide);
        document.body.style.overflow = "hidden";
    };

    const closeGuide = () => {
        setSelected(null);
        document.body.style.overflow = "";
    };

    return (
        <>
            <Navbar />
            <div className="guide-page">
                {/* Hero */}
                <div className="guide-hero">
                    <div className="guide-hero-content">
                        <span className="guide-hero-badge">📚 Knowledge Hub</span>
                        <h1>Product Guide Center</h1>
                        <p>
                            Explore step-by-step guides and presentation materials
                            for Agrigreen products.
                        </p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="guide-toolbar">
                    <input
                        className="guide-search"
                        type="text"
                        placeholder="Search guides..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="guide-cats">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`guide-cat-btn ${
                                    activeCategory === cat ? "active" : ""
                                }`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* guide Cards */}
                <div className="guide-grid">
                    {filtered.map((guide) => (
                        <div
                            className="guide-card"
                            key={guide.id}
                            style={{ borderTop: `5px solid ${guide.color}` }}
                        >
                            <div className="guide-card-body">
                                <h3><img src={guide.icon} alt="" width="30px" height="30px"/> {guide.product_name}</h3>
                                <p>{guide.description}</p>
                            </div>

                            <div className="guide-card-footer">
                                {guide.ppt_url ? (
                                    <button
                                        className="guide-view-btn"
                                        onClick={() => openGuide(guide)}
                                    >
                                        📊 View Presentation
                                    </button>
                                ) : (
                                    <span>🕐 Coming Soon</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selected && (
                <div className="guide-modal-overlay" onClick={closeGuide}>
                    <div
                        className="guide-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="guide-modal-header">
                            <h2>
                                {selected.icon} {selected.product_name}
                            </h2>
                            <button onClick={closeGuide}>✕</button>
                        </div>

                        <div className="guide-modal-body">
                            <p>{selected.description}</p>

                            <a
                                href={selected.ppt_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="guide-download-btn"
                           download={selected.ppt_url} >        
                                <h3>     view &#128065;</h3>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Guide;