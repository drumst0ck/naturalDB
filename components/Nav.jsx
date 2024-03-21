"use client";
import Image from "next/image";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { UserButton } from "@clerk/nextjs";
import { MenuMobile } from "./MenuMobile";
export default function Nav() {
  return (
    <>
      <div className="flex flex-row justify-center items-center w-full p-2">
        <div className="flex flex-col w-full items-between max-w-[1200px] ">
          <div className="grid grid-cols-2 lg:grid-cols-3">
            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent  after:dark:opacity-40 before:lg:h-[360px]">
              <Image
                style={{ width: "100px", height: "auto" }}
                className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                src="/next.svg"
                alt="Next.js Logo"
                width={0}
                height={0}
                priority
              />
            </div>
            <div className="lg:flex hidden flex-col justify-center items-center">
              <NavigationMenu className="flex flex-row w-full">
                <NavigationMenuList className="gap-10">
                  <NavigationMenuItem>
                    {" "}
                    <Link href="/sign-in">Sign-in</Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/sign-up">Sign-up</Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="lg:flex hidden flex-col items-end justify-center">
              <div className="flex flex-row justify-end gap-2 items-center w-full">
                <UserButton />
                <ModeToggle />
              </div>
            </div>
            <div className="flex lg:hidden flex-col items-end justify-center">
              <div className="flex flex-row justify-end gap-2 items-center w-full">
                <UserButton />
                <ModeToggle />
                <MenuMobile />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
