"use client";
import Image from "next/image";
import { Suspense } from "react";
export default function Nav() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-row justify-center items-center w-full py-4 p-2">
          <div className="flex flex-col w-full items-between max-w-[1400px] ">
            <div className="grid grid-cols-2 lg:grid-cols-3">
              <Image
                priority
                height={70}
                width={70}
                src="https://supabase.drumstock.dev/storage/v1/object/public/glorieta/logofinal.png?t=2024-07-18T10%3A17%3A39.991Z"
                alt="Logo de Glorieta"
                style={{ width: "70px", height: "70px", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
}
