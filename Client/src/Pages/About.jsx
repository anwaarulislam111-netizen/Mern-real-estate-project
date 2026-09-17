import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <main className='min-h-screen bg-linear-to-b from-slate-50 via-white to-emerald-50/40'>
      <section className='mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 md:grid-cols-2 md:items-center md:pt-20'>
        <div className='space-y-6'>
          

          <h1 className='text-4xl font-black leading-tight text-slate-900 md:text-5xl'>
            We help people find homes that feel right from day one.
          </h1>

          <p className='max-w-xl text-base leading-7 text-slate-600 md:text-lg'>
            PakEstate was built to make property searching clear, fast, and stress-free.
            From your first search to your final decision, we bring trusted listings,
            honest details, and smooth communication into one platform.
          </p>

          <div className='flex flex-wrap gap-3'>
            <Link
              to='/search'
              className='rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800'
            >
              Explore Listings
            </Link>
            
          </div>
        </div>

        <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-8'>
          <div className='rounded-2xl bg-slate-900 p-5 text-slate-100'>
            <p className='text-sm leading-6 text-slate-300'>
              "Our goal is simple: match every buyer and renter with a place they can trust and love."
            </p>
            <p className='mt-4 text-sm font-semibold'>PakEstate Team</p>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 pb-16'>
        <div className='mb-8 flex items-end justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700'>Why people choose us</p>
            <h2 className='mt-2 text-2xl font-black text-slate-900 md:text-3xl'>Built on trust, data, and speed</h2>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          <article className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-lg font-bold text-slate-900'>Verified Listings</h3>
            <p className='mt-3 text-sm leading-6 text-slate-600'>
              Every property goes through a quality check so users see accurate photos,
              pricing, and key details before they inquire.
            </p>
          </article>

          <article className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-lg font-bold text-slate-900'>Smart Search Experience</h3>
            <p className='mt-3 text-sm leading-6 text-slate-600'>
              Filter by location, budget, property type, and must-have features to find
              the most relevant options in seconds.
            </p>
          </article>

          <article className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h3 className='text-lg font-bold text-slate-900'>Human Support</h3>
            <p className='mt-3 text-sm leading-6 text-slate-600'>
              Questions about a listing? Our team is ready to guide you quickly with clear
              and practical answers.
            </p>
          </article>
        </div>
      </section>

      <section className='border-y border-slate-200 bg-white/80'>
        <div className='mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-3'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-500'>Our process</p>
            <h2 className='mt-3 text-2xl font-black text-slate-900'>Simple steps, better decisions</h2>
          </div>

          <div className='space-y-4 md:col-span-2'>
            <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
              <p className='text-sm font-bold text-slate-900'>1. Discover</p>
              <p className='mt-1 text-sm text-slate-600'>Browse curated listings with detailed property insights.</p>
            </div>
            <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
              <p className='text-sm font-bold text-slate-900'>2. Compare</p>
              <p className='mt-1 text-sm text-slate-600'>Shortlist options and compare price, amenities, and location fit.</p>
            </div>
            <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
              <p className='text-sm font-bold text-slate-900'>3. Move Forward</p>
              <p className='mt-1 text-sm text-slate-600'>Connect confidently and take the next step toward your ideal place.</p>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 py-16'>
        <div className='rounded-3xl bg-slate-900 p-8 text-center text-white md:p-12'>
          <h2 className='text-3xl font-black'>Ready to find your next home?</h2>
          <p className='mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300'>
            Start searching verified properties on PakEstate and discover a place that fits
            your lifestyle, budget, and future plans.
          </p>
          <Link
            to='/search'
            className='mt-7 inline-flex rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300'
          >
            Start Searching
          </Link>
        </div>
      </section>
    </main>
  )
}

export default About