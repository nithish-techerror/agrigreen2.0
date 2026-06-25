import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Register successfully");
        navigate("/home");
      } else {
        alert("Error: " + JSON.stringify(result));
      }

    } catch (error) {
      console.error(error);
      alert("Server not running");
    }
  };

  return (
    <>
      <Navbar />

      <div className="form-container">
        <h2 className="form-title">Event Registration</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">username:</label>
            <input
              className="form-input"
              type="text"
              {...register("username", {
                required: "Name is required",
                maxLength: {
                  value: 50,
                  message: "Name cannot exceed 50 characters",
                },
              })}
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              className="form-input"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email format is invalid",
                },
              })}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          {/* Event Date */}
          <div className="form-group">
            <label className="form-label">Event Date:</label>
            <input
              className="form-input"
              type="date"
              {...register("eventDate", {
                required: "Event date is required",
                validate: (value) => {
                  const today = new Date().toISOString().split("T")[0];
                  return value >= today || "Event date cannot be in the past";
                },
              })}
            />
            {errors.eventDate && (
              <span className="error-message">
                {errors.eventDate.message}
              </span>
            )}
          </div>

          {/* Age */}
          <div className="form-group">
            <label className="form-label">Age:</label>
            <input
              className="form-input"
              type="number"
              {...register("age", {
                required: "Age is required",
                min: {
                  value: 18,
                  message: "You must be at least 18 years old",
                },
                max: {
                  value: 100,
                  message: "Age must be less than 100",
                },
              })}
            />
            {errors.age && (
              <span className="error-message">{errors.age.message}</span>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number:</label>
            <input
              className="form-input"
              type="text"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be 10 digits",
                },
              })}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              className="form-input"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span className="error-message">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password:</label>
            <input
              className="form-input"
              type="password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span className="error-message">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button className="submit-button" type="submit">
            Register
          </button>
        </form>
      </div>
      
    </>
  );
}

export default Register;
