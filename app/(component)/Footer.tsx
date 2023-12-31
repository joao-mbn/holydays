export function Footer() {
  return (
    <footer className="mt-auto text-center text-xs tiny:text-sm sm:text-xl">
      Made with ❤️ by{' '}
      <a
        data-testid="github-link"
        target="_blank"
        href="https://github.com/joao-mbn"
        className="gradient-underline gradient-amber-fuchsia px-[0.125rem] hover:bg-gradient-to-l hover:from-fuchsia-500 hover:to-amber-500 hover:bg-auto hover:bg-center">
        João
      </a>
    </footer>
  );
}
