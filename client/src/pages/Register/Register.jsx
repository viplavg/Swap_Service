import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerUser } from "../../api/auth";
import { registerSchema } from "../../schemas/register.schema";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "EMPLOYEE",
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      navigate("/login", {
        replace: true,
        state: {
          message:
            "Registration successful. Please log in.",
        },
      });
    },
  });

  const onSubmit = (formData) => {
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
    };

    registerMutation.mutate(payload);
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-header">
          <p className="register-label">
            Shift Swap System
          </p>

          <h1>Create your account</h1>

          <p>
            Register to manage your shifts and swap
            requests.
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="register-form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={registerMutation.isPending}
              {...register("name")}
            />

            {errors.name && (
              <span className="register-error">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="register-form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              disabled={registerMutation.isPending}
              {...register("email")}
            />

            {errors.email && (
              <span className="register-error">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="register-form-group">
            <label htmlFor="role">
              Role
            </label>

            <select
              id="role"
              disabled={registerMutation.isPending}
              {...register("role")}
            >
              <option value="EMPLOYEE">
                Employee
              </option>

              <option value="MANAGER">
                Manager
              </option>
            </select>

            {errors.role && (
              <span className="register-error">
                {errors.role.message}
              </span>
            )}
          </div>

          <div className="register-password-grid">
            <div className="register-form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                disabled={registerMutation.isPending}
                {...register("password")}
              />

              {errors.password && (
                <span className="register-error">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="register-form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                autoComplete="new-password"
                disabled={registerMutation.isPending}
                {...register("confirmPassword")}
              />

              {errors.confirmPassword && (
                <span className="register-error">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>

          {registerMutation.isError && (
            <div className="register-api-error">
              {registerMutation.error?.response?.data
                ?.message ||
                "Unable to create account. Please try again."}
            </div>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p className="register-login-link">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;