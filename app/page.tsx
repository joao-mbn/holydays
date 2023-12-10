import { Background, Header, OptimizationForm } from './(component)';
import { Footer } from './(component)/Footer';

export default function Home() {
  return (
    <main className="tiny:text-base tiny:!leading-10 relative flex h-full min-h-screen w-screen flex-col items-center gap-6 font-sans text-sm !leading-8 text-sky-950 sm:text-2xl sm:!leading-12">
      <Background />
      <div className="tiny:my-12 z-10 my-10 flex h-full w-full flex-1 flex-col">
        <div className="tiny:gap-12 flex flex-col gap-10">
          <Header />
          <OptimizationForm />
        </div>
        <Footer />
      </div>
    </main>
  );
}
