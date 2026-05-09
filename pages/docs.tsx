"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../lib/api";

const socket = io(SOCKET_URL);

export default function DocsPage() {
  const [room] = useState("team-doc");
  const [content, setContent] = useState("");

  useEffect(() => {
    socket.emit("join_room", room);

    socket.emit("get_document", room);

    socket.on("load_document", (data) => {
      setContent(data);
    });

    socket.on("receive_document", (data) => {
      setContent(data);
    });

    return () => {
      socket.off("load_document");
      socket.off("receive_document");
    };
  }, [room]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;

    setContent(value);

    socket.emit("document_change", {
      room,
      content: value,
    });
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Collaborative Docs 
      </h1>

      <textarea
        value={content}
        onChange={handleChange}
        className="w-full h-[500px] border p-4"
        placeholder="Start typing..."
      />
    </div>
  );
}