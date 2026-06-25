import { useState } from "react";
import "./contact.css";
import Navbar from "./Navbar";
import a1 from "./image/a1.png";  

function Contact() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
      [e.target.email]:e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent Successfully 🚀");
    setForm({ name: "", email: "", message: "" });
  };

  // PROGRAMMER DATA
  const programmers = [
    {
      programmer_id: 1,
      programmer_img:a1,
      proname: "Nithish Kumar",
      proemail: "nithishofficial09@gmail.com",
      userdescription:
        "Nithish Kumar is a skilled software developer with expertise in full-stack development and building modern web applications.",
      skills: [
        "HTML", "CSS", "JavaScript", "React", "Node.js", "Python","Django", "SQL","MARIADB","NETWORKING","CYBER SECURITY","PHP","GITHUB","LINKEDIN","PURUSING(BOOTSTRAP,DATASCIENCE & ANALYSTICS)"
      ],
      linkedin_profile: "https://www.linkedin.com/in/nithishkumar09/",
      github_profile: "https://nithish-techerror.github.io/portfolio/",
      projects:[" FOOD ORDER SYSTEM( USING BY PHP)","  JOB PORTAL( USING BY REACT.JS & DJANGO)","  PORTFOLIO WEBSITE( USING BY REACT.JS)","  AGRI BASE( USING BY REACTJS & DJANGO)"
]},
  ];

  return (
    <>
      <Navbar />

      <div className="contact-page">

        {/* HEADER */}
        <div className="contact-header">
          <h1>Contact Us & About Us</h1>
          <p>We would love to hear from you 🌱</p>
        </div>

        <div className="contact-container">

          {/* CONTACT INFO */}
          <div className="contact-info">
            <h2>Get in Touch</h2>

            <p>Have questions about our agriculture platform?</p>

            <div className="info-item">📍 Cuddalore, Tamil Nadu</div>
            <div className="info-item">📞 +91 98765 43210</div>
            <div className="info-item">✉️ support@agribase.com</div>
          </div>

          {/* CONTACT FORM */}
          <div className="contact-form">
            <h2>Send Message</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <textarea
                name="message"
                placeholder="Write your message..."
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
              />

              <button type="submit">
                Send Message 🚀
              </button>
            </form>
          </div>
        </div>

        {/* ABOUT PROGRAMMERS */}
        <div className="aboutus">
          <h2>About Developer 👨‍💻</h2>

          {programmers.map((programmer, index) => (
            <div className="programmer1" key={index}>
              <img
                src={programmer.programmer_img || "https://via.placeholder.com/150"}
                alt={programmer.proname} width="150px" height="150px" style={{ borderRadius: "50%" }}
              />

              <h3>{programmer.proname}</h3>

              <p>{programmer.userdescription}</p>
              <h4>Projects:</h4>
                <ul className="project-list">
              {programmer.projects?.map((project, i) => (
             <li key={i}>{project}</li>
             ))}
            </ul>
              <p>
                <strong>Skills:</strong>{" "}
                {programmer.skills.map((skill, i) => (
                  <span key={i} className="con-skill">{skill}</span>  
                ))}
              </p>

              <h4>Visit MyProfile &#128071;</h4>

              <a href={programmer.linkedin_profile} target="_blank" rel="noreferrer" className="con-me">
               <span >LinkedIn</span>
              </a>

              <a href={programmer.github_profile} target="_blank" rel="noreferrer"className="con-me">
                GitHub
              </a>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default Contact;