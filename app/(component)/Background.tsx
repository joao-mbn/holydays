import Image from 'next/image';
import background from '../../public/bg-3k-3k.webp';

export function Background() {
  return (
    <div className="absolute h-full w-full">
      <Image alt="Beach Scene" src={background} fill className="absolute object-cover" />
      <div className="-z-10 h-full w-full bg-white/60 backdrop-brightness-125" />
    </div>
  );
}
