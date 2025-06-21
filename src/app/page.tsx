import WhisperingPoetPageClient from '@/components/whispering-poet/WhisperingPoetPageClient';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="Subtle floral background pattern"
        layout="fill"
        objectFit="cover"
        className="opacity-10 z-[-1]"
        data-ai-hint="floral pattern"
        priority
      />
      <div className="relative z-10">
        <WhisperingPoetPageClient />
      </div>
    </main>
  );
}
