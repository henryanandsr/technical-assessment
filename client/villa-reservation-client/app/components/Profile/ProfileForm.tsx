"use client";
import React, { useEffect, useState } from "react";
import axiosPrivate from "@/app/utils/api";
import useRefreshToken from "@/app/utils/refresh";

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
      });
      setId(res.data.data.id);
    };
    fetchInfo();
  }, []);

  const [id, setId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const URI = process.env.SERVER_URL + "/api/user" + "/" + id;
    axiosInstance
      .put(URI, formData, { withCredentials: true })
      .then((response) => {
        console.log(response);
        refresh();
        // refresh page
        window.location.reload();
        alert("Profile updated successfully");
      })
      .catch((error) => {
        console.log(error);
        alert("Profile update failed");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Profile Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-tertiary text-white py-2 rounded hover:bg-tertiary-dark transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileForm;
