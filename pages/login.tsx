"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";

import { API_URL } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (token) {
      router.push("/dashboard");
    }
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);

      setError("");

      const res = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );

        router.push("/dashboard");

      } else {
        setError(data.error);
      }

    } catch (err) {
      setError("Something went wrong");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white border rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="border p-3 w-full mb-4 rounded-xl"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="border p-3 w-full mb-6 rounded-xl"
        />

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            bg-black
            text-white
            w-full
            p-3
            rounded-xl
            disabled:opacity-50
          "
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </div>
    </div>
  );
}