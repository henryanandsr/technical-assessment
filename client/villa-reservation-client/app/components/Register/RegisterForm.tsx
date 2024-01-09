"use client";
import React, { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { Alert, Button, Input } from "@material-tailwind/react";

const RegisterForm = () => {
  const Router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "password" && e.target.value.length < 8) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (passwordError) {
      return;
    }
    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      setTimeout(() => {
        setPasswordMatch(true);
      }, 2000);
      return;
    }

    // Send registration request
    try {
      const url = `${process.env.SERVER_URL}/api/user`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Show success notification for successful registration
        setShowSuccessNotification(true);
        setTimeout(() => {
          setShowSuccessNotification(false);
        }, 3000);
        Router.push("/login");
      } else {
        // Handle other registration errors here
        console.error("Registration failed:", response.statusText);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-primary">Register</h2>
      <form onSubmit={handleSubmit}>
        {showSuccessNotification && (
          <Alert color="green" className="mb-2">
            Registration successful!
          </Alert>
        )}
        {!passwordMatch && <Alert color="red">Passwords do not match!</Alert>}
        {passwordError && (
          <Alert color="red" className="mb-2">
            Password must be at least 8 characters long.
          </Alert>
        )}
        <div className="mb-4">
          <Input
            label="Name"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            crossOrigin={undefined}
          />
        </div>
        <div className="mb-4">
          <Input
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            crossOrigin={undefined}
          />
        </div>
        <div className="mb-4">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              crossOrigin={undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 -translate-x-1/3 text-sm text-gray-600 cursor-pointer"
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              crossOrigin={undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 -translate-x-1/3 text-sm text-gray-600 cursor-pointer"
            >
              {showConfirmPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
          </div>
        </div>
        <Button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-orange-600 w-full"
          placeholder={"Submit"}
        >
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
