import React, { useState } from 'react';
import Head from 'next/head';

import FloatingHeader from '../components/common/floatingHeader.component';

export default function Home() {
  const [concept, setConcept] = useState(0);

  function renderConcept(index) {
    console.log(index);
    switch (index) {
      default:
      case 0:
        return (
          <div className="fuel-concept-container flex flex-col items-center justify-start w-full flex-1">
            <div className="text-4xl font-bold">
              <span>Are you tired of <span className="underline">endless</span> project management?</span>
            </div>

            <div className="mt-3 text-2xl relative">
              Creating tasks, managing tasks, assigning tasks, making labels, assigning labels, expectations, goals, reports, and on and on...
              <div className="bg-gradient-to-t from-[#FFFFFF] dark:from-stone-700 absolute top-0 right-0 bottom-0 left-0">&nbsp;</div>
            </div>

            <div className="text-4xl font-bold mt-10">
              Meet <span className="text-orange-600">Fuel</span>.
            </div>
          </div>
        );
      case 1:
        return (
          <div className="fuel-concept-container flex flex-col items-center justify-start w-full flex-1">
            <div className="text-4xl font-bold">
              <span>Are you tired of <span className="underline">complicated</span> project management?</span>
            </div>

            <div className="text-4xl font-bold mt-10">
              Meet <span className="text-orange-600">Fuel</span>.
            </div>
          </div>
        );
      case 2:
        return (
          <div className="fuel-concept-container flex flex-col items-center justify-start w-full flex-1">
            <div className="text-4xl font-bold">
              <span>Are you tired of <span className="underline">lost</span> project management?</span>
            </div>

            <div className="text-4xl font-bold mt-10">
              Meet <span className="text-orange-600">Fuel</span>.
            </div>
          </div>
        );
    }
  }

  return (
    <div className="fuel-main-container flex flex-col items-center justify-center min-h-screen pb-2 dark:bg-stone-700 dark:text-white">
      <Head>
        <title>Fuel Project Management - Fuel Your Project</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="fuel-bigscreen-container h-screen w-screen flex flex-col bg-orange-600">
        <FloatingHeader></FloatingHeader>
        <div className="fuel-bigscreen flex-auto flex flex-col justify-center items-center">
          <div className="fuel-logo-container flex flex-row text-7xl font-mono">
            <span className="fuel-logo-fuel">Fuel</span>
            <div className="fuel-logo-pm-container flex flex-col justify-center items-center">
              <span className="fuel-logo-p text-3xl leading-8">P</span>
              <span className="fuel-logo-m text-3xl leading-8">M</span>
            </div>
          </div>
          <span>Keep your projects running on full.</span>
        </div>
        <div className="fuel-concept-bar bg-zinc-700 flex flex-row">
          <button onClick={() => setConcept(0)} className={((concept === 0) ? 'bg-white text-zinc-700' : 'bg-transparent text-white hover:bg-white hover:text-zinc-700') + ` h-14 text-xl flex flex-row flex-1 justify-center items-center`}>Simple</button>
          <button onClick={() => setConcept(1)} className={((concept === 1) ? 'bg-white text-zinc-700' : 'bg-transparent text-white hover:bg-white hover:text-zinc-700') + ` h-14 text-xl flex flex-row flex-1 justify-center items-center border-solid border-l border-zinc-800 border-r`}>Shareable</button>
          <button onClick={() => setConcept(2)} className={((concept === 2) ? 'bg-white text-zinc-700' : 'bg-transparent text-white hover:bg-white hover:text-zinc-700') + ` h-14 text-xl flex flex-row flex-1 justify-center items-center`}>Trackable</button>
        </div>
      </div>

      <main className="flex flex-col items-center justify-start w-full flex-1 p-5 mt-5 md:mt-10">
        {renderConcept(concept)}
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/netlify.svg" alt="Netlify Logo" className="h-6 ml-2" />
          {' '}{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  )
}
