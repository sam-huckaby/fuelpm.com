import Head from 'next/head'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 dark:bg-stone-700 dark:text-white">
      <Head>
        <title>Fuel Project Management - Fuel Your Project</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="fixed md:hidden bg-orange-600 top-0 right-0 left-0 flex flex-row">
        <div className="flex-auto">&nbsp;</div>
        <button className="rounded bg-transparent text-white h-10 w-10 text-3xl flex flex-row justify-center">&equiv;</button>
      </div>

      <main className="flex flex-col items-center justify-start w-full flex-1 p-5 mt-5">
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
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  )
}
