import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import FloatingHeader from '../components/common/FloatingHeader';

export default function Home() {
  const [concept, setConcept] = useState(0);

  async function toggleConcept(index) {
    const smoothScroll = (await import('../utils/helpers')).smoothScroll;
    setConcept(index);
    smoothScroll(document.getElementById('concept_bar'));
  }

  function renderConcept(index) {
    switch (index) {
      default:
      case 0:
        return (
          <div className="fuel-concept-container flex flex-col items-center justify-start w-full flex-1">
            <div className="text-4xl font-bold">
              <span>Are you tired of <span className="underline">complicated</span> project management?</span>
            </div>

            <div className="mt-3 text-2xl relative">
              Creating tasks, managing tasks, assigning tasks, making labels, assigning labels, expectations, goals, reports, and on and on...
              <div className="bg-gradient-to-tl from-[#FFFFFF] dark:from-stone-700 absolute top-0 right-0 bottom-0 left-0">&nbsp;</div>
            </div>

            <div className="text-4xl font-bold mt-10 mb-5">
              Meet <span className="text-orange-600">Fuel</span>.
            </div>

            <div className="fuel-pros-container">
              <p className="mb-2">FuelPM is the <span className="font-bold text-orange-600">simple</span> project management tool you have been waiting for. Every project is linear, with each task coming after the last and before the next, so you never wonder which item should be next. This may sound counter-intuitive, but options are the enemy of efficiency. By making your project linear, you can focus on each task as it is needed.</p>
              <p className="mb-2"><span className="font-bold">Are you a dev shop?</span> Linear project management means you can easily see if your development team is keeping pace with QA and vice versa. If you don't have a QA team, linear is even more straight forward, because each task is completed in order. What if you identify new tasks as you work? Just add them after your current task and FuelPM will link later tasks to them, keeping you moving forward.</p>
              <p className="mb-2"><span className="font-bold">Are you in construction?</span> Linear project management means that you can easily track multiple projects at once! Simply name your project after the address of your build and assign your workers to their project. FuelPM is mobile-first, which means your crew can update thair tasks on their phones as they complete them, giving you peace of mind.</p>
              <p className="mb-2"><span className="font-bold">Are you a small business?</span> FuelPM is designed with you in mind. Our free tier lets you run up to five projects at the same time, and you can delete old ones as you go, so you never have to let a good idea slip away. Our mobile-first approach means that you can build projects and add ideas as you have them, wherever you have them. Best of all, we <span className="underline">want</span> you to use our free tier, because we love small businesses, so you will never get those annoying upgrade emails.</p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="fuel-concept-container flex flex-col items-center justify-start w-full flex-1">
            <div className="text-4xl font-bold">
              <span>Are you tired of <span className="underline">isolated</span> project management?</span>
            </div>

            <div className="mt-3 text-2xl relative">
              Does my client know what's next? Did my teammates get their work done? Checking email, instant messaging, calling, and on and on...
              <div className="bg-gradient-to-tl from-[#FFFFFF] dark:from-stone-700 absolute top-0 right-0 bottom-0 left-0">&nbsp;</div>
            </div>

            <div className="text-4xl font-bold mt-10 mb-5">
              Meet <span className="text-orange-600">Fuel</span>.
            </div>

            <div className="fuel-pros-container">
              <p className="mb-2">FuelPM is the <span className="font-bold text-orange-600">shareable</span> project management tool you have been waiting for. Every project and task can be seamlessly shared on via hotlink, with a link preview that contains the most valueable information from the task or project, so they don't even need to click the link to know what you're asking about.</p>
              <p className="mb-2"><span className="font-bold">Are you a startup?</span> Big project management software suites can be expensive and time-consuming to teach everyone to use. FuelPM is built specifically so that each project and task is as simple as possible, meaning that you can put links in your wiki directly to content you want people to see without having to teach people how to login.</p>
              <p className="mb-2"><span className="font-bold">Are you in finance?</span> Shareable project and task links make it easy to build a project for your client with actionable tasks and then send them the links when they need to complete the step. Projects are only accessible by the people assigned to them, so you can be sure your clients privacy is proected as well.</p>
              <p className="mb-2"><span className="font-bold">Are you a dreamer?</span> Plan out future projects and ideas for the next big thing in FuelPM and then share your content and proposals with friends, family, and investors when the time is right. Intuitive interfaces and mobile-first design make FuelPM the perfect place to design your nest big idea, knowing that it won't be stolen and will look good when you're done.</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="fuel-concept-container flex flex-col items-center justify-start w-full flex-1">
            <div className="text-4xl font-bold">
              <span>Are you tired of <span className="underline">unused</span> project management?</span>
            </div>

            <div className="mt-3 text-2xl relative">
              Sent that report, did I update my status? Changed all the logos, did I update my task?, updating, catching up, and on and on...
              <div className="bg-gradient-to-tl from-[#FFFFFF] dark:from-stone-700 absolute top-0 right-0 bottom-0 left-0">&nbsp;</div>
            </div>

            <div className="text-4xl font-bold mt-10 mb-5">
              Meet <span className="text-orange-600">Fuel</span>.
            </div>

            <div className="fuel-pros-container">
              <p className="mb-2">FuelPM is the <span className="font-bold text-orange-600">trackable</span> project management tool you have been waiting for. FuelPM's project dashboard allows you to get an idea of where each project is in your organization. Because projects are linear, you can always see exactly how fast they are moving forward by looking at the time spent on the current task.</p>
              <p className="mb-2"><span className="font-bold">Are you starting a new store?</span> It's easy to get bogged down by the things that need to be done when beginning a brick-and-morter store, and with FuelPM's simplicity and dashboard you can always see what comes next. By adding and assigning employees to your projects, you can get a day-to-day view of everything that is happening in your store.</p>
              <p className="mb-2"><span className="font-bold">Are you a teacher?</span> Linear, trackable projects mean that you can build lesson plans in FuelPM and update them as you teach from your phone. Projects can be bulk reset, so you can mark lessons complete when you finish and then start over again at the end of the school year. Shareable links also mean you can give a substitute your next lesson plan and let them check things off too!</p>
              <p className="mb-2"><span className="font-bold">Are you a planner?</span> Track big life events as they happen, giving you insight into your past as well as where you want to be in the future. Think of FuelPM as your personal scrapbook to store memories and information you need in the future.</p>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="fuel-main-container flex flex-col items-center justify-center min-h-screen pb-2 dark:bg-stone-700 dark:text-white">
      <Head>
        <title>FuelPM - Fuel Your Project with efficient, linear management</title>
        <meta name="description" content="FuelPM is a linear, easy to use project management software designed to be touched as little as possible." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.fuelpm.com/" />
        <meta property="og:title" content="FuelPM - Efficient, linear project management" />
        <meta
          property="og:description"
          content="FuelPM is a linear, easy to use project management software designed to be touched as little as possible."
        />
        <link rel="icon" href="/Fuel-Favicon.svg" />
      </Head>

      <div className="fuel-bigscreen-container h-screen w-screen flex flex-col bg-orange-600">
        <FloatingHeader noTopbranding="true"></FloatingHeader>
        <div className="fuel-bigscreen flex-auto flex flex-col justify-center items-center">
          <div className="w-screen flex flex-row justify-center items-center">
            <Image src="/Fuel-Logo-Full.svg" alt="FuelPM" width={380} height={250}/>
          </div>
          <span className="text-black">Keep your projects running on full.</span>
        </div>
        <div id="concept_bar" className="fuel-concept-bar bg-stone-700 flex flex-row">
          <button onClick={() => toggleConcept(0)} className={((concept === 0) ? 'bg-white hover:bg-white text-stone-700' : 'bg-transparent text-white hover:bg-white hover:text-stone-700') + ` h-14 text-xl flex flex-row flex-1 justify-center items-center border-none rounded-none`}>Simple</button>
          <button onClick={() => toggleConcept(1)} className={((concept === 1) ? 'bg-white hover:bg-white text-stone-700' : 'bg-transparent text-white hover:bg-white hover:text-stone-700') + ` h-14 text-xl flex flex-row flex-1 justify-center items-center border-solid border-l border-stone-800 border-r border-t-0 border-b-0 rounded-none`}>Shareable</button>
          <button onClick={() => toggleConcept(2)} className={((concept === 2) ? 'bg-white hover:bg-white text-stone-700' : 'bg-transparent text-white hover:bg-white hover:text-stone-700') + ` h-14 text-xl flex flex-row flex-1 justify-center items-center border-none rounded-none`}>Trackable</button>
        </div>
      </div>

      <main id="concept_container" className="flex flex-col items-center justify-start w-full flex-1 p-5 mt-5 md:mt-10">
        {renderConcept(concept)}
      </main>

      <div id="fuel_pricing_container" className={`flex flex-col items-center w-full px-5 pb-5`}>
        <div className={`text-3xl w-100`}>Pricing</div>
        <div className={`grid grid-cols-3`}>
          <div></div>
          <div className={`fuel-free-grid-label p-2 text-green-600 font-bold`}>Free Tier</div>
          {/* <div className={`fuel-no-limits-grid-label p-2 text-orange-600 font-bold`}>No Limits</div> */}
          <div></div>

          <div className={`fuel-pricing-type-label p-2 border-solid border-t border-stone-300`}>Monthly Cost</div>
          <div className={`fuel-pricing-item-label p-2 border-solid border-t border-r border-stone-300`}>$0 (forever)</div>
          {/* <div className={`fuel-pricing-item-label p-2 border-solid border-t border-stone-300`}>$5 / member</div> */}
          <div></div>

          <div className={`fuel-pricing-type-label p-2 border-solid border-t border-stone-300`}>Projects</div>
          <div className={`fuel-pricing-item-label p-2 border-solid border-t border-r border-stone-300`}>5</div>
          {/* <div className={`fuel-pricing-item-label p-2 border-solid border-t border-stone-300`}>No Limit</div> */}
          <div></div>

          <div className={`fuel-pricing-type-label p-2 border-solid border-t border-stone-300`}>Members</div>
          <div className={`fuel-pricing-item-label p-2 border-solid border-t border-r border-stone-300`}>5</div>
          {/* <div className={`fuel-pricing-item-label p-2 border-solid border-t border-stone-300`}>No Limit</div> */}
          <div></div>
        </div>
      </div>

      <div className="pb-5 underline">
        Unlimited Accounts Available In The Future.
      </div>

{/* Uncomment this when there are some questions to be answered */}
      {/* <div id="fuel_faqs_container" className={`flex flex-col items-center w-full px-5 py-2`}>
        <div className="text-3xl w-100">FAQs</div>

      </div> */}

      <div className={`fuel-call-to-action flex flex-col`}>
        <div className="font-bold mb-5">Ready to get to work?</div>
        <Link href="/app/dashboard">
          <button className={`fuel-cta-signup-button rounded bg-orange-600 hover:bg-orange-500 text-white p-3 mb-5`}>Get Started / Login</button>
        </Link>
      </div>

      <footer className="flex items-center justify-center w-full h-24 border-t flex-col">
        <div className="vercel-container">
          <a
            className="flex items-center justify-center"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} className="h-4 ml-2" />
          </a>
        </div>
        <div className="samhuckaby-container">
          Built by <a href="https://samhuckaby.com/" target="_blank" className="text-orange-600">Sam Huckaby</a>
        </div>
      </footer>
    </div>
  )
}
