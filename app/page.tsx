import { Background, Header, OptimizationForm } from './(component)';

export default function Home() {
  return (
    <main className="relative flex h-full min-h-screen w-screen flex-col items-center gap-6 font-sans text-sky-950">
      <Background />
      <div className="z-10 flex h-full w-full flex-col gap-10 sm:gap-20">
        <Header />
        <OptimizationForm />
      </div>
    </main>
  );
}
