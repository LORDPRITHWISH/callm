"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
//import { Button } from "@/components/ui/button";
import { Heart, Shield, Users } from "lucide-react";
import { RainbowButton } from "@/components/ui/rainbow-button";
//import Magnet from "@/components/Magnet";
import { Spotlight } from "@/components/ui/spotlight-new";
import  GradientText  from "@/components/GradientText";
import {AuroraText} from "@/components//ui/aurora-text";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }

const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const parallaxElements = document.querySelectorAll(".parallax");

      parallaxElements.forEach((element) => {
        const speed = element.dataset.speed || 0.2;
        const yPos = -(scrollPosition * Number(speed));
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center">
          <Link
            href="#"
            className="flex items-center gap-1 font-bold text-white"
          >
            <span className="text-2xl">calm</span>
            <span className="text-blue-400 text-xl">★</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link
            href="#features"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-gray-400 hover:text-white transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#community"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Community
          </Link>
        </div>
      </nav>

      <section
        ref={heroRef}
        className="relative pt-20 md:pt-32 pb-24 overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl parallax"
            data-speed="0.1"
          ></div>
          <div
            className="absolute bottom-10 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl parallax"
            data-speed="0.15"
          ></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 min-h-screen"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500 text-blue-300 text-sm mb-6 backdrop-blur-sm">
              <span className="bg-blue-400 w-2 h-2 rounded-full mr-2 animate-pulse"></span>
              Your AI Companion
            </span>
            {/* <Magnet padding={50} disabled={false} magnetStrength={50} className="mb-6">
              <p>Your AI Companion</p>
            </Magnet> */}

            {/* <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-100">
              Find Peace with <span className="text-blue-400">calm</span>
            </h1> */}
            <Spotlight>
            Find Peace with <span className="text-blue-400">calm</span>
            </Spotlight>

            <p className="text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
              An AI-powered emotional support companion that adapts to your
              needs, providing comfort and connection when you need it most.
            </p>
            <a href="https://drive.google.com/file/d/1Lf50V5_5wYuGk0eLQsYkgom6kB55zQmY/view?usp=sharing" target="_blank" rel="noopener noreferrer">
            <RainbowButton>
              Download Now
              </RainbowButton>
            </a>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
              {/* <Link href="/get-started" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                >
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/learn-more" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full px-8 py-6 border-gray-700 hover:bg-gray-800/50 transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link> */}
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            {/* <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="text-blue-400">calm</span> Supports You
            </h2> */}
            <GradientText size="large">
              How calm Supports You
            </GradientText>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI companion uses advanced technology to provide personalized
              emotional support tailored to your unique needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Emotional Support</h3>
              <p className="text-gray-400">
                Receive compassionate support through AI that adapts to your
                emotional state, offering comfort when you need it most.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Community Connection
              </h3>
              <p className="text-gray-400">
                Join supportive groups where you can share experiences and
                connect with others who understand what you&apos;re going
                through.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Safe Space</h3>
              <p className="text-gray-400">
                Express yourself freely in a private, judgment-free environment
                designed to support your emotional wellbeing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-black relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-16">
            {/* <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="text-blue-400">calm</span> Works
            </h2> */}
            <h1 className="text-3xl font-bold tracking-tighter md:text-5xl lg:text-6xl ">
              How <AuroraText>calm </AuroraText> Works
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our advanced AI learns from your interactions to provide
              increasingly personalized support.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-900/40 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-blue-500/20 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-blue-400">
                    1
                  </span>
                  Adaptive AI Technology
                </h3>
                <p className="text-gray-400 mb-4">
                  Our AI analyzes speech patterns and emotional cues to
                  understand your current state.
                </p>
                <p className="text-gray-400">
                  It then adapts its tone and responses to best match what you
                  need in the moment.
                </p>
              </div>

              <div className="bg-gray-900/40 backdrop-blur-sm p-8 rounded-xl border border-gray-800">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="bg-blue-500/20 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-blue-400">
                    2
                  </span>
                  Community Support
                </h3>
                <p className="text-gray-400 mb-4">
                  Connect with others in similar situations through our
                  carefully moderated support groups.
                </p>
                <p className="text-gray-400">
                  Share experiences and build meaningful connections in a safe
                  environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-12 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link
                href="#"
                className="flex items-center gap-1 font-bold text-white"
              >
                <span className="text-2xl">calm</span>
                <span className="text-blue-400 text-xl">★</span>
              </Link>
              <p className="text-gray-400 text-sm mt-2">
                Your AI companion for emotional support
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link
                href="#features"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-400 hover:text-white transition-colors"
              >
                How It Works
              </Link>
              {/* <Link
                href="#community"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Community
              </Link> */}
              
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm text-center">
              © 2025 Zenux Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

