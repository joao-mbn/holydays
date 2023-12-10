import { Background, Header, OptimizationForm } from './(component)';

export default function Home() {
  return (
    <main className="relative flex h-full min-h-screen w-screen flex-col items-center gap-6 font-sans text-sky-950">
      <Background />
      <div className="tiny:text-base tiny:!leading-10 z-10 h-full w-full text-sm !leading-8 sm:text-2xl">
        <div className="tiny:my-12 tiny:gap-12 my-10 flex flex-col gap-10 sm:!leading-12">
          <Header />
          <OptimizationForm />
        </div>
      </div>
    </main>
  );
}
