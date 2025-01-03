import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";
import { Link, useNavigate } from "react-router-dom";

interface FormValues {
  displayName: string;
  email: string;
  password: string;
}

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const showToast = (message: string, type: string) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
  };

  // Handle form submission
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const userCredential = await createAuthUserWithEmailAndPassword(
        data.email,
        data.password
      );
      if (userCredential) {
        const user = userCredential.user;
        await createUserDocumentFromAuth(user, {
          displayName: data.displayName,
        });
        showToast("Account created successfully!", "success");
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      showToast("Failed to create account. Please try again.", "error");
    }
    reset();
  };

  return (
    <div className="flex justify-center items-center w-full mx-auto h-[90vh] md:w-3/5 ">
      {/* Daisy UI Toast */}
      {toast && (
        <div className="toast toast-end">
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
          Sign Up
        </h1>

        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label className="text-2xl text-yellow-300">Name</label>
          <input
            {...register("displayName", { required: "Name is required" })}
            placeholder="Enter your name"
            className="p-3 text-lg"
          />
          {errors.displayName && (
            <p className="bg-red-700 text-black">
              {errors.displayName.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="text-2xl text-yellow-300">Email</label>
          <input
            className="p-3 text-lg"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="bg-red-700 text-black">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <label className="text-2xl text-yellow-300">Password</label>
          <div className="flex gap-5">
            <input
              className="p-3 text-lg"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              placeholder="Enter your password"
            />
            <button type="button" onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="bg-red-700 text-black text-lg">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex w-full flex-col border-opacity-50">
          <button
            type="submit"
            className="bg-yellow-300 p-2 rounded-sm text-black text-xl"
          >
            Sign Up
          </button>
          <div className="divider">OR</div>
          <Link
            to="/signin"
            className="bg-yellow-300 p-2 rounded-sm text-black text-xl text-center"
          >
            Already Have An Account? Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
