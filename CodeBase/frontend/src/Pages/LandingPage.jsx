import { Button } from "@/components/ui/button";
import { Search, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const LandingPage = () => {
  return (
    <div className="">
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 xl:py-48 w-full">
          <div className="px-4 md:px-6 container">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className=" font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl/none tracking-tighter">Discover Legal Insights with Ease</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Powerful legal case search engine with <span className="font-bold"> AI-powered chatbot</span> assistance. Find the information you
                  need, faster.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-blue-700 hover:bg-blue-700/90" asChild>
                  <Link href="/chatbot">Chat Bot!</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/search">Search Engine</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="bg-gray-200 dark:bg-gray-800 py-12 md:py-24 lg:py-32 w-full">
          <div className="px-4 md:px-6 container">
            <div className="gap-10 grid sm:grid-cols-2">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-full">
                  <Search className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
                <h2 className="font-bold text-2xl">Powerful Search Engine</h2>
                <p className="max-w-[300px] text-gray-500 dark:text-gray-400">
                  Find relevant legal cases quickly with our advanced search algorithms.
                </p>
                <Button asChild variant="link">
                  <Link to="/search">
                    Try Search <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-full">
                  <MessageSquare className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
                <h2 className="font-bold text-2xl">AI-Powered Chatbot</h2>
                <p className="max-w-[300px] text-gray-500 dark:text-gray-400">
                  Get instant answers to your legal questions with our intelligent chatbot.
                </p>
                <Button asChild variant="link">
                  <Link to="/chatbot">
                    Try Chatbot <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex sm:flex-row flex-col items-center gap-2 px-4 md:px-6 py-6 border-t w-full shrink-0">
        <p className="text-gray-500 text-xs dark:text-gray-400">© 2024 LegalSearch. All rights reserved.</p>
        <nav className="flex gap-4 sm:gap-6 sm:ml-auto">
          <a className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </a>
          <a className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default LandingPage;
