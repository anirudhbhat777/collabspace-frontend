"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.push("/login");

    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}