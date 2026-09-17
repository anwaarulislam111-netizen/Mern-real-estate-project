import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import SwiperCore from 'swiper'
import ListingCard from '../Components/ListingCard.jsx'

const Home = () => {

  SwiperCore.use([Navigation])

  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

        const results = await Promise.allSettled([
          axios.get(`${backendUrl}/api/listing/get?offer=true&limit=4`, { timeout: 10000 }),
          axios.get(`${backendUrl}/api/listing/get?type=rent&limit=4`, { timeout: 10000 }),
          axios.get(`${backendUrl}/api/listing/get?type=sale&limit=4`, { timeout: 10000 }),
        ])

        const offerRes = results[0]
        const rentRes = results[1]
        const saleRes = results[2]

        setOfferListings(
          offerRes.status === 'fulfilled' && Array.isArray(offerRes.value.data)
            ? offerRes.value.data
            : []
        )

        setRentListings(
          rentRes.status === 'fulfilled' && Array.isArray(rentRes.value.data)
            ? rentRes.value.data
            : []
        )

        setSaleListings(
          saleRes.status === 'fulfilled' && Array.isArray(saleRes.value.data)
            ? saleRes.value.data
            : []
        )
      } catch (error) {
        console.log('Failed to load home listings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])





  if (loading) {
    return (
      <div className="text-center text-xl mt-10">
        Loading listings...
      </div>
    )
  }

  return (
    <div>

      {/* TOP SECTION */}
      <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>

        <div className='text-gray-600 mt-4 text-md'>
          PakEstate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose for.
        </div>

        <Link to={'/search'} className='text-xs sm:text-sm text-white  font-bold hover:underline'>
          <button className=' bg-slate-700 m-1 rounded-lg hover:bg-slate-600 p-5 cursor-pointer'>
            Lets get started
          </button>
        </Link>
      </div>

      {/* SWIPER */}
      {Array.isArray(offerListings) && offerListings.length > 0 && (
        <Swiper navigation>
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className='h-[500px]'
                style={{
                  background: `url(${listing.imageUrls?.[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                  transform: 'translateZ(0)',   // 👈 forces GPU repaint
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* LISTINGS */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>

        {/* OFFERS */}
        {Array.isArray(offerListings) && offerListings.length > 0 && (
          <div className='flex flex-col gap-6'>
            <div>
              <h2 className='text-2xl font-semibold'>Recent Offers</h2>
              <Link className='text-sm text-blue-700 hover:underline' to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>

            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* RENT */}
        {Array.isArray(rentListings) && rentListings.length > 0 && (
          <div className='flex flex-col gap-6'>
            <div>
              <h2 className='text-2xl font-semibold'>Recent places for rent</h2>
              <Link className='text-sm text-blue-700 hover:underline' to={'/search?type=rent'}>
                Show more places for rent
              </Link>
            </div>

            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* SALE */}
        {Array.isArray(saleListings) && saleListings.length > 0 && (
          <div className='flex flex-col gap-6'>
            <div>
              <h2 className='text-2xl font-semibold'>Recent places for sale</h2>
              <Link className='text-sm text-blue-700 hover:underline' to={'/search?type=sale'}>
                Show more places for sale
              </Link>
            </div>

            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Home