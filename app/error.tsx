"use client";

import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-lg">{error.message}</p>

      <div className="space-x-7">
        <button
          onClick={unstable_retry}
          className="inline-block bg-accent-500 px-6 py-3 text-lg text-primary-800"
        >
          Try again
        </button>

        <Link
          href="/"
          className="inline-block bg-accent-500 px-6 py-3 text-lg text-primary-800"
        >
          Go back home
        </Link>
      </div>
    </main>
  );
}
