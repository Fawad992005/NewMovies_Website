import { useForm, SubmitHandler } from "react-hook-form";
import {
  signInAuthUserWithEmailAndPassword,
  signInWithGoogle,
} from "../../utils/firebase/firebase.utils";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface SigninFormValues {
  email: string;
  password: string;
}

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SigninFormValues>();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const showToast = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
  };

  const signinWithGoogle = async () => {
    try {
      await signInWithGoogle();
      showToast("Sign in successful!", "success");
      navigate("/");
    } catch (error) {
      showToast("Invalid email or password. Please try again.", "error");
    }
  };

  const onSubmit: SubmitHandler<SigninFormValues> = async (data) => {
    try {
      if (!data.email || errors.email) {
        showToast("Please enter a valid email address.", "error");
        return;
      }
      if (!data.password || errors.password) {
        showToast("Password must be at least 8 characters long.", "error");
        return;
      }
      await signInAuthUserWithEmailAndPassword(data.email, data.password);
      showToast("Sign in successful!", "success");
      reset();
      navigate("/");
    } catch (error) {
      console.log(error);
      showToast("Invalid email or password. Please try again.", "error");
    }
  };

  return (
    <div className="flex justify-center items-center w-full mx-auto h-[90vh] md:w-3/5 ">
      {/* Daisy UI Toast */}
      {toast && (
        <div className={`toast toast-end `}>
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 rounded-md w-3/4 md:w-1/2"
      >
        <h1 className="text-center text-4xl text-yellow-300 bg-black rounded-3xl p-2">
          Sign In
        </h1>
        {/* Email Input */}
        <div className="flex flex-col gap-2">
          <label className="text-2xl text-yellow-300">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
            placeholder="Enter your email"
            className="p-3 text-lg "
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-2">
          <label className="text-2xl text-yellow-300">Password</label>
          <div className="flex w-full gap-3">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              placeholder="Enter your password"
              className="p-3 text-lg "
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex w-full flex-col border-opacity-50">
          <button
            type="submit"
            className="bg-yellow-300 p-2 rounded-sm text-black text-xl"
          >
            Sign In
          </button>
          <div className="divider">OR</div>
          <button
            type="button"
            onClick={signinWithGoogle}
            className="bg-yellow-300 p-2 rounded-sm text-black text-xl text-center"
          >
            Sign In With Google
          </button>
          <div className="divider">OR</div>
          <Link
            to="/signup"
            className="bg-yellow-300 p-2 rounded-sm text-black text-xl text-center"
          >
            Don't Have An Account? Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signin;
