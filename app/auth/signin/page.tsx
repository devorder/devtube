"use client";
import Link from "next/link";
import { useActionState } from "react";
import { signInAction } from "./actions";

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(signInAction, {
    error: "",
  });
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        action={formAction}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {state?.error && !pending && (
          <div className="text-red-500 text-sm">{state.error}</div>
        )}
        <div className="w-full flex flex-col">
          <button
            disabled={pending}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Sign In
          </button>
          <span className="w-full text-center">or</span>
          <Link
            href="/auth/signup"
            className="w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create An Account
          </Link>
        </div>
      </form>
    </div>
  );
}
