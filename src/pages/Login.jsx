import apiEndpoint from "../constants/apiEndpoint";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load token dari localStorage
    const token = localStorage.getItem("access_token");
    const lastInteraction = localStorage.getItem("last_interaction");

    if (token && lastInteraction) {
      const currentTime = new Date().getTime();
      const interactionTime = parseInt(lastInteraction, 10);

      if (currentTime - interactionTime > 60 * 60 * 1000) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("last_interaction");
        navigate("/");
      } else {
        navigate("/dashboard");
      }
    }

    const savedUsername = localStorage.getItem("remember_username");
    const savedPassword = localStorage.getItem("remember_password");
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, [navigate]);

  const validateInputs = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Username tidak boleh kosong.";
    }
    if (!password.trim()) {
      newErrors.password = "Password tidak boleh kosong.";
    }
    return newErrors;
  };

  const authenticateUser = async () => {
    const response = await fetch(apiEndpoint.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateInputs();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await authenticateUser();
      setIsLoading(false);

      if (data.token) {
        // Simpan token dan waktu interaksi terakhir
        localStorage.setItem("access_token", data.token);
        localStorage.setItem("last_interaction", new Date().getTime().toString());

        if (rememberMe) {
          localStorage.setItem("remember_username", username);
          localStorage.setItem("remember_password", password);
        } else {
          localStorage.removeItem("remember_username");
          localStorage.removeItem("remember_password");
        }

        navigate("/dashboard");
      } else {
        const message = data.message || "Login gagal.";
        if (message.includes("password")) {
          setErrors({ password: "Password salah. Silakan coba lagi." });
        } else if (message.includes("username")) {
          setErrors({ username: "Username tidak ditemukan." });
        } else {
          setErrors({ form: message });
        }
      }
    } catch (error) {
      setIsLoading(false);
      setErrors({ form: "Terjadi kesalahan, coba lagi nanti.", error});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:w-full sm:max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <img
            className="h-20 w-auto"
            src="src/assets/images/Logo.svg"
            alt="Logo"
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800">Masuk ke Akun Anda</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {errors.form && (
            <div className="text-red-500 text-sm text-center mb-4">{errors.form}</div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Masukkan username Anda"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Masukkan password Anda"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mt-6 flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "Memuat..." : "Masuk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
