import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, {
        id: "registration-success"
      });

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location.pathname, location.state, navigate]);

  if (isAuthenticated) {
    return (
      <Navigate
        to={
          user.role === "MANAGER"
            ? "/manager-dashboard"
            : "/employee-dashboard"
        }
        replace
      />
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      const { token, user } = response.data.data;

      login(user, token);

      toast.success("Logged in successfully.");

      navigate(
        user.role === "MANAGER"
          ? "/manager-dashboard"
          : "/employee-dashboard",
        {
          replace: true,
        }
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <div className="brand-badge">SS</div>

          <h1>Welcome back</h1>

          <p>Sign in to manage your shifts and swap requests.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="employee@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="register-text">
          Don&apos;t have an account?
          <button
            type="button"
            className="register-button"
            onClick={() => navigate("/register")}
          >
            Create account
          </button>
        </p>
      </section>
    </main>
  );
}

export default Login;