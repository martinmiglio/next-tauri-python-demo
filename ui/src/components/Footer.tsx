import Link from 'next/link';

export default function Footer() {
  return (
    <div className="flex w-full flex-row flex-wrap items-center justify-between py-8 text-sm opacity-60">
      <Link className="pb-1 hover:underline" href="https://martinmiglio.dev/">
        © {new Date().getFullYear()} Martin Miglio
      </Link>
    </div>
  );
}
