import React, { useState } from "react";
import "./FarmerSchemes.css";

const allSchemes = {
  India: [
    {
      name: "PM-KISAN",
      desc: "₹6000 per year income support.",
      link: "https://pmkisan.gov.in/"
    },
    {
      name: "PM Fasal Bima Yojana",
      desc: "Crop insurance scheme.",
      link: "https://pmfby.gov.in/"
    },
    {
      name: "Kisan Credit Card",
      desc: "Low interest farm loans.",
      link: "https://www.myscheme.gov.in/schemes/kcc"
    },
    {
      name: "Soil Health Card",
      desc: "Soil testing program.",
      link: "https://soilhealth.dac.gov.in/"
    }
  ],

  TamilNadu: [
    {
      name: "Uzhavar Sandhai",
      desc: "Direct farmer markets.",
      link: "https://www.tn.gov.in/scheme/data_view/765"
    },
    {
      name: "Chief Minister Farmer Scheme",
      desc: "Subsidy for equipment.",
      link: "https://www.tn.gov.in/scheme/data_view/777"
    }
  ],

  Karnataka: [
    {
      name: "Raitha Siri",
      desc: "Financial support scheme.",
      link: "https://raitamitra.karnataka.gov.in/"
    }
  ],

  AndhraPradesh: [
    {
      name: "YSR Rythu Bharosa",
      desc: "₹13,500 support.",
      link: "https://ysrrythubharosa.ap.gov.in/"
    }
  ],

  Maharashtra: [
    {
      name: "MahaDBT Farmer Schemes",
      desc: "Subsidy portal.",
      link: "https://mahadbt.maharashtra.gov.in/"
    }
  ]
};

const Farmer= () => {
  const [state, setState] = useState("India");

  return (
    <div className="scheme-container">
      <h2>🇮🇳 Farmer Support Schemes</h2>
      <p>Select your state to view schemes</p>

      <select
        className="state-dropdown"
        value={state}
        onChange={(e) => setState(e.target.value)}
      >
        <option value="India">All India</option>
        <option value="TamilNadu">Tamil Nadu</option>
        <option value="Karnataka">Karnataka</option>
        <option value="AndhraPradesh">Andhra Pradesh</option>
        <option value="Maharashtra">Maharashtra</option>
      </select>

      <div className="scheme-grid">
        {allSchemes[state].map((item, index) => (
          <div className="scheme-card" key={index}>
            <h3>{item.name}</h3>
            <p>{item.desc}</p>
            <button onClick={() => window.open(item.link, "_blank")}>
              View Scheme
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Farmer;
