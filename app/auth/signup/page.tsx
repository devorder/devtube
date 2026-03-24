"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "./schema";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();
  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await res.json();
      if (!res.ok) {
        // Attach server-side errors to the form so they render next to fields.
        if (responseData?.error) {
          setError("root", { type: "server", message: responseData.error });
        }

        return;
      }
      router.push("/auth/signin");
    } catch (error) {
      console.error("Registration failed:", error);
      setError("root", {
        type: "server",
        message: "Registration failed. Please try again.",
      });
    }
  };
  return (
    <div className="w-full h-full flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center">Create Account</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            {...register("password")}
            type="password"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        {(errors as any).root && (
          <p className="text-red-500 text-sm text-left mt-2">
            {(errors as any).root.message}
          </p>
        )}
        <div className="w-full flex flex-col">
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {isSubmitting ? "Creating..." : "Register"}
          </button>
          <span className="w-full text-center">or</span>
          <Link
            href="/auth/signin"
            className="w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Already Have an account ?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
