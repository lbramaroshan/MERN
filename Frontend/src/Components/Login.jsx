import React from "react";
import { useAppContext } from "../Context/AppContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setShowUserLogin, setUser, axios } = useAppContext();
  const navigate = useNavigate();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        // ✅ Save to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user._id); // 🔑 Fix for "Please login to add address"

        setUser(data.user);
        setShowUserLogin(false);
        navigate("/");

        toast.success(
          state === "register"
            ? "Account created successfully!"
            : "Logged in successfully!",
          {
            position: "top-center",
            duration: 1000,
          }
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (state === "register"
            ? "Failed to create account. Please try again."
            : "Login failed. Please check your credentials."),
        {
          position: "top-center",
          duration: 3000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 w-full max-w-md p-6 rounded-2xl shadow-2xl border border-gray-200 bg-white animate-scale-in"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            <span className="text-primary">Welcome</span> Back
          </h2>
          <p className="text-gray-500 mt-2">
            {state === "login"
              ? "Login to access your account"
              : "Create a new account"}
          </p>
        </div>

        {state === "register" && (
          <div className="w-full space-y-1">
            <label className="text-gray-700 font-medium">Full Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Your full name"
              className="w-full p-2.5 mt-1 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full space-y-1">
          <label className="text-gray-700 font-medium">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="your@email.com"
            className="w-full p-2.5 mt-1 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            type="email"
            required
          />
        </div>

        <div className="w-full space-y-1 relative">
          <label className="text-gray-700 font-medium">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="********"
            className="w-full p-2.5 pr-10 mt-1 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 bottom-2.5 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {state === "login" && (
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <button type="button" className="text-primary hover:underline">
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-all ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting
            ? "Processing..."
            : state === "register"
            ? "Create Account"
            : "Login"}
        </button>

        <div className="text-center text-sm text-gray-500">
          {state === "register" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setState("login")}
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setState("register")}
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
