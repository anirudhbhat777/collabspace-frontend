"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { useRouter } from "next/router";

import DashboardLayout from "../components/DashboardLayout";

import { API_URL } from "../lib/api";

export default function Dashboard() {
  const router = useRouter();

  const [documents, setDocuments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          router.push("/login");

          return;
        }

        const res = await fetch(
          `${API_URL}/documents/all`,
          {
            headers: {
              Authorization:
                "Bearer " + token,
            },
          }
        );

        const data = await res.json();

        setDocuments(
          data.documents || []
        );

      } catch (err) {
        console.error(err);

        setDocuments([]);

      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const createDocument = async () => {
    try {
      const res = await fetch(
        `${API_URL}/documents/create`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              "Bearer " +
              localStorage.getItem(
                "token"
              ),
          },

          body: JSON.stringify({
            title:
              "Untitled Document",
          }),
        }
      );

      const data = await res.json();

      router.push(
        `/docs/${data.id}`
      );

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">
            Your Documents
          </h1>

          <button
            onClick={createDocument}
            className="
              bg-black
              text-white
              px-5
              py-3
              rounded-xl
              hover:opacity-90
              transition
            "
          >
            New Document
          </button>
        </div>

        {loading ? (
          <p>Loading documents...</p>

        ) : (
          <div className="grid gap-5">
            {documents.map(
              (doc: any) => (
                <Link
                  key={doc.id}
                  href={`/docs/${doc.id}`}
                  className="
                    bg-white
                    border
                    rounded-2xl
                    p-6
                    shadow-sm
                    hover:shadow-md
                    transition
                  "
                >
                  <h2 className="text-xl font-semibold">
                    {doc.title}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Collaborative document
                  </p>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}