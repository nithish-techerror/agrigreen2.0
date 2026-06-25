import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import orderic from './image/icon/orderic.png'
import './App.css'

function OrderNav() {
    return (
        <>
        
            
            <div className="order-nav">
                
                    <Link to="/Myorders"><img src={orderic} alt="My Orders" width="30px" height="30px" /></Link>
                </div>
             
            
        </>
        );
}

export default OrderNav