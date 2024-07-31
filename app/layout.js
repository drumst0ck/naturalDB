import Providers from "@/components/Providers";
export const metadata = {
  title: "NaturalDB | PostgreSQL Queries with Natural Language",
  description:
    "Communicate with your PostgreSQL database using everyday language, no SQL expertise required.",
};
export default function RootLayout({ children }) {
  return <Providers>{children}</Providers>;
}
