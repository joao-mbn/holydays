import { Background, Header, OptimizationForm } from './(component)';

export default function Home() {
  return (
    <main className="relative flex h-screen w-screen flex-col items-center gap-6 overflow-hidden font-sans text-sky-950">
      <Background />
      <div className="z-10 flex h-full w-full flex-col gap-20 bg-white/60 backdrop-brightness-125">
        <Header />
        <OptimizationForm />
      </div>
    </main>
  );
}
