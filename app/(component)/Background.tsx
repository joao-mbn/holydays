import Image from 'next/image';

export function Background() {
  return <Image alt="Beach Scene" src="/bg-16-9.webp" priority fill className="absolute object-cover" />;
}
