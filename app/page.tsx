'use client'

import { Mail } from 'lucide-react';
import Image from 'next/image';

import Logo from '@/components/Logo';
import WaitlistForm from '@/components/WaitlistForm';
import DecorativeLines from '@/components/Decorativelines';
import Starfield from '@/components/Starfield';

const page = () => {
  return (
    <div className="relative min-h-screen h-screen max-h-screen bg-black text-white overflow-hidden">
      <Starfield />
      <DecorativeLines />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6 pt-0">
        <Image src="/logo.png" alt="Logo" width={1000} height={1000} className="h-[5rem] w-auto" />

        <a
          href="https://wa.me/2348107960605"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
          </svg>
        </a>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] px-4">
        <Logo />

        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.2em] text-text-dimmed mb-6 uppercase">
            RENTME PLATFORM
          </p>

          <h1 className="text-5xl md:text-6xl font-medium mb-2 tracking-tight">
            <span className="">Join the waitlist for</span>
            <br />
            <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent font-medium">RentMe!</span>
          </h1>
        </div>

        <WaitlistForm />
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col items-center justify-center pb-8 px-4 text-center">
        {/* <p className="text-sm text-stone-400 mb-1">
          RentMe is launching soon.
        </p>
        <p className="text-sm text-stone-400 mb-4">
          The easiest way to find your perfect rental property.
        </p> */}

        <div className="flex flex-row items-center pt-8 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
            </svg>
            <span>08107960605</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-white" />
            <a
              href="mailto:rentme@gmail.com"
              className="hover:text-foreground transition-colors"
            >
              rentme@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default page;
