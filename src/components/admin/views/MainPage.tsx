"use client";
import Image from "next/image";
import { logo } from "../../../../public";

export default function MainPage() {
  return (
    <div className="relative h-full w-full">
      <div className="relative h-full w-full">

        {/* Logo */}
        <div className="absolute inset-0 flex items-start justify-center pt-40">
          <Image 
            src={logo}
            alt="Logo"
            width={undefined}
            height={undefined}
            className="object-contain brightness-0 w-100 h-100"
          />
        </div>
      </div>
    </div>
  );
} 
