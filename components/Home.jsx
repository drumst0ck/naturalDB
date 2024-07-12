import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
      <div className="text-black dark:text-white bg-white dark:bg-[#121212] transition-colors duration-300">
        <section
            className="flex flex-col items-center justify-center min-h-[500px] bg-center bg-cover"
            style={{ backgroundImage: "url(/background-grid.svg)" }}>
          <h1 className="text-4xl font-bold text-center">Revolutionize Your PostgreSQL Queries with Natural Language</h1>
          <p className="mt-4 text-center">
            Effortlessly interact with your Postgres database. Boost productivity and simplify data analysis.
          </p>
          <div className="flex mt-6 space-x-4">
            <Button variant="default" className="hover:scale-105 transition-transform">
              <Link href="/dashboard">Try Dashboard</Link>
            </Button>
            <Button
                variant="outline"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <Link href="/sign-up">Sign Up Now</Link>
            </Button>
          </div>
        </section>
        <section className="p-8">
          <h2 className="text-3xl font-bold text-center">Transform Complex Queries into Simple Conversations</h2>
          <p className="mt-4 text-center">
            Our AI-powered platform translates natural language into precise SQL, making database interaction intuitive for everyone.
          </p>
          <div className="grid gap-8 mt-8 md:grid-cols-3">
            <Card className="dark:bg-black transition-colors duration-300">
              <CardContent>
                <h3 className="mt-4 text-xl font-bold">Natural Language Processing</h3>
                <p className="mt-2">
                  Communicate with your PostgreSQL database using everyday language, no SQL expertise required.
                </p>
              </CardContent>
            </Card>
            <Card className="dark:bg-black transition-colors duration-300">
              <CardContent>
                <h3 className="mt-4 text-xl font-bold">Real-time Query Generation</h3>
                <p className="mt-2">Watch as your natural language input transforms into optimized SQL queries instantly.</p>
              </CardContent>
            </Card>
            <Card className="dark:bg-black transition-colors duration-300">
              <CardContent>
                <h3 className="mt-4 text-xl font-bold">Seamless Integration</h3>
                <p className="mt-2">
                  Easily integrate our tool into your existing PostgreSQL workflow for enhanced productivity.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="p-8">
          <h2 className="text-3xl font-bold text-center">Empower Your Data Team with AI-Assisted Database Querying</h2>
          <div className="grid gap-8 mt-8 md:grid-cols-2">
            <Card className="dark:bg-black transition-colors duration-300">
              <CardContent>
                <h3 className="mt-4 text-xl font-bold">Intuitive Dashboard</h3>
                <p className="mt-2">Access powerful database insights through our user-friendly interface.</p>
                <Button variant="default" className="mt-4 hover:scale-105 transition-transform">
                  <Link href="/dashboard">Explore Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="dark:bg-black transition-colors duration-300">
              <CardContent>
                <h3 className="mt-4 text-xl font-bold">Secure Authentication</h3>
                <p className="mt-2">
                  Protect your data with our robust sign-in and sign-up processes, ensuring only authorized access.
                </p>
                <Button variant="default" className="mt-4 hover:scale-105 transition-transform">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="p-8">
          <h2 className="text-3xl font-bold text-center">Enterprise-Grade Security for Your Data</h2>
          <div className="grid gap-8 mt-8 md:grid-cols-3">
            <Card className="dark:bg-black transition-colors duration-300">
              <CardContent>
                <h3 className="mt-4 text-xl font-bold">End-to-End Encryption</h3>
                <p className="mt-2">Your queries and data are protected with state-of-the-art encryption technology.</p>
              </CardContent>
            </Card>
            <Card className="dark:bg-black transition-colors duration-300">
              <CardContent>
                <h3 className="mt-4 text-xl font-bold">GDPR Compliant</h3>
                <p className="mt-2">We adhere to strict data protection regulations to ensure your privacy.</p>
              </CardContent>
            </Card>
            <Card className="dark:bg-black transition-colors duration-300">
              <CardContent>
                <h3 className="mt-4 text-xl font-bold">Regular Security Audits</h3>
                <p className="mt-2">We continuously monitor and improve our security measures to keep your data safe.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        <footer className="p-8">
          <div className="flex justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Start Your Natural Language Database Journey Today</h3>
              <p>Simplify PostgreSQL queries with the power of AI.</p>
            </div>
            <div className="flex space-x-4">
              <Button variant="default" className="hover:scale-105 transition-transform">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="grid gap-8 mt-8 md:grid-cols-4">
              <div>
                <h4 className="font-bold">Features</h4>
                <ul className="mt-2 space-y-2">
                  <li>
                    <Link href="/dashboard" prefetch={false}>
                      Natural Language Queries
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" prefetch={false}>
                      Real-time SQL Generation
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" prefetch={false}>
                      Data Visualization
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" prefetch={false}>
                      Query History
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold">Resources</h4>
                <ul className="mt-2 space-y-2">
                  <li>
                    <Link href="#" prefetch={false}>
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" prefetch={false}>
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <Link href="#" prefetch={false}>
                      Tutorials
                    </Link>
                  </li>
                  <li>
                    <Link href="#" prefetch={false}>
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold">Company</h4>
                <ul className="mt-2 space-y-2">
                  <li>
                    <Link href="#" prefetch={false}>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" prefetch={false}>
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" prefetch={false}>
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="#" prefetch={false}>
                      Partners
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold">Legal</h4>
                <ul className="mt-2 space-y-2">
                  <li>
                    <Link href="#" prefetch={false}>
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" prefetch={false}>
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#" prefetch={false}>
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" prefetch={false}>
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}