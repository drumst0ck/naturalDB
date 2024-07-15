import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="text-white bg-[#121212] min-h-screen">
      <section className="flex flex-col items-center justify-center min-h-[600px] bg-center bg-cover relative overflow-hidden">
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h1 className="text-5xl animated-gradient font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Revolutionize Your PostgreSQL Queries with Natural Language
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Effortlessly interact with your Postgres database. Boost
            productivity and simplify data analysis.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              className="bg-emerald-500 hover:bg-emerald-600 h-[50px] text-white px-8 py-3 rounded-full transition-all duration-300"
              href="/dashboard"
            >
              Try Dashboard
            </Link>

            <Button
              variant="outline"
              className="border-emerald-500 h-[50px] text-emerald-500 hover:bg-emerald-500 hover:text-white px-8 py-3 rounded-full transition-all duration-300"
            >
              <Link
                variant="outline"
                className="w-full h-full"
                href="/dashboard"
              >
                Login No needed
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="py-20 relative bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Transform Complex Queries into Simple Conversations
          </h2>
          <p className="text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto">
            Our AI-powered platform translates natural language into precise
            SQL, making database interaction intuitive for everyone.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              title="Natural Language Processing"
              description="Communicate with your PostgreSQL database using everyday language, no SQL expertise required."
            />
            <FeatureCard
              title="Real-time Query Generation"
              description="Watch as your natural language input transforms into optimized SQL queries instantly."
            />
            <FeatureCard
              title="Seamless Integration"
              description="Easily integrate our tool into your existing PostgreSQL workflow for enhanced productivity."
            />
          </div>
        </div>
      </section>
      <section className="py-20 relative bg-[#121212] ">
        <div className="absolute inset-0 bg-[url('/background-grid.svg')] opacity-20 z-[2]"></div>
        <div className="container relative z-[99] mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Empower Your Data Team with AI-Assisted Database Querying
          </h2>
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <CallToActionCard
              title="Intuitive Dashboard"
              description="Access powerful database insights through our user-friendly interface."
              buttonText="Explore Dashboard"
              buttonLink="/dashboard"
            />
            <CallToActionCard
              title="Secure Authentication"
              description="Protect your data with our robust sign-in and sign-up processes, ensuring only authorized access."
              buttonText="Sign In"
              buttonLink="/sign-in"
            />
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 py-12 relative">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <FooterColumn
              title="Features"
              links={[
                "Natural Language Queries",
                "Real-time SQL Generation",
                "Data Visualization",
                "Query History",
              ]}
            />
            <FooterColumn
              title="Resources"
              links={["Documentation", "API Reference", "Tutorials", "Blog"]}
            />
            <FooterColumn
              title="Company"
              links={["About Us", "Careers", "Contact", "Partners"]}
            />
            <FooterColumn
              title="Legal"
              links={[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Security",
              ]}
            />
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <Card className="bg-gray-800 border-0 overflow-hidden group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function CallToActionCard({ title, description, buttonText, buttonLink }) {
  return (
    <Card className="bg-gray-800 border-0 overflow-hidden group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 mb-6">{description}</p>
        <Link
          className="bg-emerald-500 mt-4 hover:bg-emerald-600 text-white px-6 py-2 rounded-full transition-all duration-300"
          href={buttonLink}
        >
          {buttonText}
        </Link>
      </CardContent>
    </Card>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-bold text-lg mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href="#"
              className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
