"use client";
import React, { useEffect, useState } from "react";
import axiosPrivate from "@/app/utils/api";
import useRefreshToken from "@/app/utils/refresh";
import {
  Button,
  Card,
  Input,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ProfileForm() {
  const axiosInstance = axiosPrivate();
  const refresh = useRefreshToken();
  useEffect(() => {
    const URI = process.env.SERVER_URL + "/api/info";
    const fetchInfo = async () => {
      const res = await axiosInstance.get(URI, { withCredentials: true });
      setFormData({
        name: res.data.data.name,
        email: res.data.data.email,
        password: "",
        confirmPassword: "",
      });
      setId(res.data.data.id);
    };
    fetchInfo();
  }, []);

  const [id, setId] = useState("");
  const [passwordDidNotMatch, setPasswordDidNotMatch] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState(false);

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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordDidNotMatch(true);
      setTimeout(() => {
        setPasswordDidNotMatch(false);
      }, 3000);
      return;
    }
    const URI = process.env.SERVER_URL + "/api/user" + "/" + id;
    axiosInstance
      .put(URI, formData, { withCredentials: true })
      .then((response) => {
        console.log(response);
        refresh();
        // refresh page
        window.location.reload();
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 3000);
      });
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="bg-white p-8 rounded shadow-md w-96" placeholder={"x"}>
        <FontAwesomeIcon icon={faUser} />
        <Typography className="text-2xl font-bold mb-6" placeholder={""}>
          Profile
        </Typography>
        {passwordError ? (
          <Alert className="mb-2" color="red">
            Password must be at least 8 characters long.
          </Alert>
        ) : null}
        {passwordDidNotMatch ? (
          <Alert className="" color="red">
            Password not match
          </Alert>
        ) : null}
        {success ? (
          <Alert className="" color="green">
            Profile updated successfully
          </Alert>
        ) : null}
        {error ? (
          <Alert className="" color="red">
            Error updating profile
          </Alert>
        ) : null}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              required
              crossOrigin={undefined}
            />
          </div>
          <div className="mb-4">
            <Input
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
              crossOrigin={undefined}
            />
          </div>
          <div className="mb-4">
            <Input
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
              crossOrigin={undefined}
            />
          </div>
          <div className="mb-6">
            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
              crossOrigin={undefined}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-tertiary text-white py-2 rounded hover:bg-tertiary-dark transition duration-300"
            placeholder={"Submit"}
          >
            Edit Profile
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ProfileForm;
