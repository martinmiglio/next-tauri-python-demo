import Service from '@/components/Service';

export default function Home() {
  return (
    <div className="flex-grow">
      <h2 className="mb-12 py-6 text-4xl font-extrabold sm:text-5xl">
        Next.js + Tauri + FastAPI Python Demo!
      </h2>
      <div className="flex flex-col gap-6 text-lg">
        <Service />
      </div>
    </div>
  );
}
