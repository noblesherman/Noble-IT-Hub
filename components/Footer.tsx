export default function Footer() {
  return (
    <footer className="w-full py-12 bg-neutral-900 text-neutral-400 text-sm">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <p>© {new Date().getFullYear()} Noble Sherman.</p>
        <p className="text-neutral-500">Built with Next.js & love.</p>
      </div>
    </footer>
  );
}