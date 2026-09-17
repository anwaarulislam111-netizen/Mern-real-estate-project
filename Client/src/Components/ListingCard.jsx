import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import { FaBath, FaBed } from 'react-icons/fa'

const ListingCard = ({ listing }) => {

  const firstImage = listing?.imageUrls?.[0] || '/placeholder.jpg'

  return (

    <div className='bg-white w-full sm:w-[330px] shadow-md hover:shadow-lg overflow-hidden rounded-l-lg'>
      


      <Link to={`/listing/${listing?._id}`}>
      


        <img src={firstImage} alt={listing?.name || 'Listing image'}
        className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />




        <div className='p-3 flex flex-col gap-2'>
          <p className='text-lg font-semibold truncate'>
            {listing.name}
          </p>




          <div className='flex  items-center gap-1.5'>
            <MdLocationOn/>  
            <p className='text-sm  text-gray-600 truncate w-full'>
              {listing.address}
            </p>

          </div>





          <div>
            <p className='text-sm  text-gray-600 line-clamp-2'>
              {listing.description}
            </p>
          </div>







          <div>
            <p className='font-semibold '>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
          </p>
          </div>



          


          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold flex gap-1 text-center items-center text-sm'>
              <FaBed/>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>

             <div className='font-bold flex gap-1 text-center items-center text-sm'>
                <FaBath/>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>




        </div>
        
      </Link>
    </div>
  )
}

export default ListingCard