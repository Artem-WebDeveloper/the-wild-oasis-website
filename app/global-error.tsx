"use client";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-semibold">Something went wrong!</h1>
          <p className="text-lg">{error.message}</p>

          <button
            onClick={unstable_retry}
            className="inline-block bg-accent-500 px-6 py-3 text-lg text-primary-800"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
