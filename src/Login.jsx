import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Home.css";
import "./product.css";
import "./App.css";
import farmer from "./image/loginimg.png"

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("access", result.access);
        localStorage.setItem("refresh", result.refresh);
        localStorage.setItem("is_staff", result.is_staff ? "true" : "false");
        if (result.is_staff) {
          navigate("/home");
        } else {
          navigate("/home");
        }
        alert("login successfully")
      } else {
        alert("Invalid login");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <>
      <Navbar />
      <div id="content">
        <div className="login-con">
          <img src={farmer} alt="" className="farmer-log"/>
          <div className="login-con2">
          <h1>Login</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="login-from">
            <h3>
             user Name or Email
              <br />
              <input
                type="text"
                placeholder="Name or Email"
                className="login-style"
                {...register("username")}
              />
            </h3>

            <h3>
              Password
              <br />
              <input
                type="password"
                className="login-style"
                {...register("password")}
              />
            </h3>

            <button type="submit" className="submit-button">Login</button>
          </form>
          
          <Link to="/forgetpassword">forget password..?</Link> {" "}
          <br />
          <Link to="/register">Register New User</Link> {" "}
          
          </div>
        </div>
      </div>
    </>
  );
  
}

export default Login;
