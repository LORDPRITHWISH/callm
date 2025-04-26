// import React from 'react';
// export default function Home() {
//   return (
//     <div>
//       <h1>pages</h1>
//     </div>
//   );
// }
// // About.tsx

import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-slate-900 to-indigo-950 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full  rounded-2xl shadow-2xl p-10 space-y-8">
        <h1 className="text-4xl font-bold text-center text-blue-700">About Callm</h1>
        <p className="text-lg text-blue-200 text-center">
          Your AI-powered emotional support companion — here to listen, uplift, and connect whenever you need.
        </p>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-blue-600">Our Vision</h2>
          <p className="text-blue-200">
            At Callm, we believe that mental wellness should be accessible, personalized, and stigma-free. 
            We are building a future where everyone feels supported, understood, and empowered to thrive.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-blue-600">What We Offer</h2>
          <ul className="list-disc list-inside text-blue-200 space-y-2">
            <li>AI-driven mood analysis and personalized motivation.</li>
            <li>Real-time, judgment-free community support groups.</li>
            <li>Private and secure interactions powered by robust technology.</li>
            <li>Continuous insights to empower your mental wellness journey.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-blue-600">Why Callm?</h2>
          <p className="text-blue-200">
            Life isn &apos;t always easy — but you don&apos;t have to face it alone. 
            With Callm, compassionate AI support and vibrant communities are just a click away, anytime you need.
          </p>
        </section>

        <div className="flex justify-center pt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300">
            Join the Callm Community
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

