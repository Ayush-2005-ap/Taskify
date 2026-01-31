import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Register() {
    const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", {name, email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-10 animate-fade">
      <div className="backdrop-blur bg-white/80 border border-white/30 rounded-2xl shadow-2xl p-8 w-[350px] transition-all duration-500 hover:shadow-indigo-300 animate-card">
        <h2 className="text-3xl font-bold text-indigo-400 text-center mb-6">
          Create Account 🚀
        </h2>

        {error && (
          <p className="text-red-200 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white hover:cursor-pointer font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50">
            Register
          </button>
        </form>

        <p className="text-indigo-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="underline hover:text-indigo-800">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
