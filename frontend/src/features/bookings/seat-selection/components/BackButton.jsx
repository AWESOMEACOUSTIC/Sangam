import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:bg-white/5 hover:text-white"
      aria-label="Go back"
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  );
}

export default BackButton;