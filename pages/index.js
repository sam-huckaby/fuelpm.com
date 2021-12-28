import Head from 'next/head'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Fuel Project Management - Fuel Your Project</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1  ">
        <div className="text-4xl font-bold">Are you tired of <span className="underline">endless</span> project management tasks?</div>

        <div className="mt-3 text-2xl relative">
          Creating tasks, managing tasks, making labels, assigning labels, expectations, goals, and on and on and on and on and on...
          <div className="bg-gradient-to-t from-[#FFFFFF] absolute top-0 right-0 bottom-0 left-0">&nbsp;</div>
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
