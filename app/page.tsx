import { Background, Footer, Header, OptimizationForm } from './(component)';

export default function Home() {
  return (
    <main className="relative flex h-full min-h-screen w-screen flex-col items-center gap-6 font-sans text-sm !leading-8 text-sky-950 tiny:text-base tiny:!leading-10 sm:text-2xl sm:!leading-12">
      <Background />
      <div className="z-10 my-10 flex h-full w-full flex-1 flex-col tiny:my-12">
        <div className="flex flex-col gap-10 tiny:gap-12">
          <Header />
          <OptimizationForm />
        </div>
        <Footer />
      </div>
    </main>
  );
}
