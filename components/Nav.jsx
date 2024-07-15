"use client";
import Image from "next/image";
import { Suspense } from "react";
export default function Nav() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-row justify-center items-center w-full py-4 p-2">
          <div className="flex flex-col w-full items-between max-w-[1400px] ">
            <div className="grid grid-cols-2 lg:grid-cols-3">LOGO</div>
          </div>
        </div>
      </Suspense>
    </>
  );
}
