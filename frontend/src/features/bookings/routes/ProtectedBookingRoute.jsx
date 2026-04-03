import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import useBookingAuthGate from "../hooks/useBookingAuthGate";

function getCurrentPath(location) {
  return `${location.pathname}${location.search}${location.hash}`;
}

export default function ProtectedBookingRoute({ children }) {
  const { isAuthLoaded, isAuthenticated, requestAuthentication } =
    useBookingAuthGate();

  const location = useLocation();
  const hasRequestedSignInRef = useRef(false);

  useEffect(() => {
    if (!isAuthLoaded) return;

    if (isAuthenticated) {
      hasRequestedSignInRef.current = false;
      return;
    }

    if (!hasRequestedSignInRef.current) {
      hasRequestedSignInRef.current = true;
      requestAuthentication(getCurrentPath(location));
    }
  }, [isAuthLoaded, isAuthenticated, location, requestAuthentication]);

  if (!isAuthLoaded || !isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-28">
        <section className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/80 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            Authentication required
          </p>

          <h2 className="mt-2 text-xl font-bold text-white">
            Sign in to continue booking
          </h2>

          <p className="mt-2 text-sm text-zinc-300">
            Your booking flow is saved. Sign in and you will be redirected back
            to this page.
          </p>

          <button
            type="button"
            onClick={() => requestAuthentication(getCurrentPath(location))}
            className="mt-5 inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
          >
            Sign in
          </button>
        </section>
      </main>
    );
  }

  return children;
}
