import { handleLogin } from "@/app/utils/auth";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await handleLogin(email, password);
      if (res.status === "success") {
        setShowSuccessNotification(true);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (err) {
      setShowErrorNotification(true);

      // Hide error notification after 3 seconds
      setTimeout(() => {
        setShowErrorNotification(false);
      }, 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-primary">Login</h2>
      <form onSubmit={handleSubmit}>
        {showSuccessNotification && (
          <div className="mt-4 p-2 bg-green-200 text-green-800 rounded-md mb-2">
            Login successful!
          </div>
        )}
        {showErrorNotification && (
          <div className="mt-4 p-2 bg-red-200 text-red-800 rounded-md mb-2">
            Invalid email or password. Please try again.
          </div>
        )}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Input your email here"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md pr-10"
              placeholder="Input your password here"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 transform -translate-y-1/3 -translate-x-1/3 text-sm text-gray-600 cursor-pointer"
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-orange-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
