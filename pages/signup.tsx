"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";
import { API_URL } from "../lib/api";

export default function SignupPage() {
  const router = useRouter();

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

  const handleSignup = async () => {
    console.log("API URL =", API_URL);
    const res = await fetch(
      `${API_URL}/auth/signup`,
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

    if (data.user) {
      router.push("/login");

    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white border rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-6">
          Signup 
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

        <button
          onClick={handleSignup}
          className="bg-black text-white w-full p-3 rounded-xl"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}