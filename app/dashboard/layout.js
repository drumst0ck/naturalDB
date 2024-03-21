import { auth } from "@clerk/nextjs/server";

export default async function Layout({ children }) {
  return <>{children}</>;
}
