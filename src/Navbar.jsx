import { Link } from 'react-router-dom'
import './App.css'
import Head from './image/Headimg.png'
import Homeic from './image/icon/homeic.png'
import Productic from './image/icon/productic.png'
import Guideic from './image/icon/guideic.png'
import Contactic from './image/icon/contactic.png'
import Logic from './image/icon/logic.png'
import Login from './image/icon/login.png'




function Navbar() {
  const isStaff = localStorage.getItem("is_staff") === "true";

  return (
    <div id="header">
      <div id="headimg">
        <img src={Head} alt="Logo" className="logo" />
      </div>

      <div className="nav-bar">
        <ul>
          <li><Link to="/home">Home <img src={Homeic} alt="" width="25px" height="20px"/></Link></li>
          <li><Link to="/product">Product <img src={Productic} alt="" width="20px" height="20px"/></Link></li>
          <li><Link to="/guide">Guide <img src={Guideic} alt="" width="20px" height="20px"/></Link></li>
          <li><Link to="/contact">Contact <img src={Contactic} alt="" width="20px" height="20px"/></Link></li>
          <li><Link to="/profile">Profile <img src={Logic} alt="" width="20px" height="20px"/></Link></li>
           <li><Link to="/">Login <img src={Login} alt="" width="20px" height="20px"/></Link></li>
          {isStaff && <li><Link to="/admin" style={{color: "#f5a623", fontWeight: "bold"}}>🛡️ Admin</Link></li>}
        </ul>
      </div>
    </div>
  )
}

export default Navbar
