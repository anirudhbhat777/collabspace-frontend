"use client";

import { useRouter } from "next/router";

import {
  useEffect,
  useState,
} from "react";

import { io } from "socket.io-client";

import DashboardLayout from "../../components/DashboardLayout";

import {
  SOCKET_URL,
} from "../../lib/api";

const socket = io(SOCKET_URL);

export default function DocsPage() {
  const router = useRouter();

  const { id } = router.query;

  const room = id as string;

  const [content, setContent] =
    useState("");

  const [onlineUsers, setOnlineUsers] =
    useState(0);

  const [cursors, setCursors] =
    useState<any>({});

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.push("/login");

      return;
    }

    if (!room) return;

    socket.emit("join_room", room);

    socket.emit("get_document", room);

    socket.on("load_document", (data) => {
      setContent(data);
    });

    socket.on(
      "receive_document",
      (data) => {
        setContent(data);
      }
    );

    socket.on(
      "room_users",
      (count) => {
        setOnlineUsers(count);
      }
    );

    socket.on(
      "receive_cursor",
      (data) => {
        setCursors((prev: any) => ({
          ...prev,

          [data.socketId]:
            data.position,
        }));
      }
    );

    return () => {
      socket.off("load_document");

      socket.off("receive_document");

      socket.off("room_users");

      socket.off("receive_cursor");
    };
  }, [room]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;

    setContent(value);

    setSaving(true);

    const cursorPosition =
      e.target.selectionStart;

    socket.emit("cursor_move", {
      room,
      position: cursorPosition,
    });

    socket.emit("document_change", {
      room,
      content: value,
    });

    setTimeout(() => {
      setSaving(false);
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">
            Share URL and collaborate live in the same room
          </h1>

          <div className="text-sm text-gray-500">
            {onlineUsers} users online
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          {saving ? "Saving..." : "Saved"}
        </div>

        <div className="mb-4 space-y-1">
          {Object.entries(cursors).map(
            ([id, pos]: any) => (
              <div
                key={id}
                className="text-sm text-blue-500"
              >
                User {id.slice(0, 4)}
                {" "}
                typing at:
                {" "}
                {pos}
              </div>
            )
          )}
        </div>

        <textarea
          value={content}
          onChange={handleChange}
          className="
            w-full
            min-h-[75vh]
            border
            rounded-2xl
            p-8
            text-lg
            outline-none
            bg-white
            shadow-sm
            resize-none
          "
          placeholder="Start typing..."
        />
      </div>
    </DashboardLayout>
  );
}