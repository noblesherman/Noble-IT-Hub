// app/not-found.tsx

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold mb-4 text-neutral-900">
        Page Not Found
      </h1>
      <p className="text-lg text-neutral-600 max-w-md mb-8">
        Dang. Looks like this page forgot to exist. But your website won’t.
      </p>

      <a
        href="/"
        className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:opacity-90 transition"
      >
        Go Home
      </a>
    </main>
  );
}