import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ListingCard from '../Components/ListingCard';


const Search = () => {

  
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const[showmore,setshowmore]=useState(false)


  console.log(listings)

  const [sidebardata,setsidebardata]=useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  })

  // console.log(sidebardata)








  //har input pe on change pe ye wala lgaya a
  const handleChange=(e)=>{

    if(e.target.id==='searchTerm'){
      setsidebardata({...sidebardata, searchTerm: e.target.value})
    }

    if(e.target.id==='all' || e.target.id==='sale' || e.target.id==='rent'){
      setsidebardata({...sidebardata, type:e.target.id})
    }

    if(e.target.id==='offer' || e.target.id==='furnished' || e.target.id==='parking'){
      setsidebardata({...sidebardata, [e.target.id]: e.target.checked  || e.target.checked==='true' ?
        true:false
      })
    }


    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setsidebardata({ ...sidebardata, sort, order });
    }

  }










  const navigate=useNavigate();
  const location = useLocation();




  
  //search button pe ye onsubmit pe ye lgaya a
  const handleSubmit=(e)=>{
    e.preventDefault(); 

  const urlParams = new URLSearchParams();  // Create an object to store URL query parameters

  urlParams.set('searchTerm', sidebardata.searchTerm);  // Add search term from sidebarData to the URL
  urlParams.set('type', sidebardata.type);              // Add property type (rent/sale etc.) to the URL
  urlParams.set('parking', sidebardata.parking);        // Add parking filter value
  urlParams.set('furnished', sidebardata.furnished);    // Add furnished filter value
  urlParams.set('offer', sidebardata.offer);            // Add offer filter value
  urlParams.set('sort', sidebardata.sort);              // Add sorting field (e.g., price, date)
  urlParams.set('order', sidebardata.order);            // Add sorting order (asc/desc)

  const searchQuery = urlParams.toString();             // Convert parameters into query string format
  navigate(`/search?${searchQuery}`);                   // Navigate to /search page with query parameters
  }









  useEffect(()=>{
    const fetchListings = async () => {
      setLoading(true);
      setshowmore(false)

      try {
        const urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.toString();
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${backendUrl}/api/listing/get?${searchQuery}`);
        const data = await res.json();


        if(data.length > 8){
          setshowmore(true)
        }else{
          setshowmore(false)
        }


        setListings(Array.isArray(data) ? data : []);
        setShowMore(Array.isArray(data) && data.length > 8);
      } catch (error) {
        setListings([]);
        setShowMore(false);
      } finally {
        setLoading(false);
      }
    };

    const urlParams = new URLSearchParams(location.search);  //get current URL query parameters

    const searchTermFromUrl = urlParams.get('searchTerm');   //get searchterm from url
    const typeFromUrl = urlParams.get('type');               //get type from url 
    const parkingFromUrl = urlParams.get('parking');        //....
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setsidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });

    }

    fetchListings();
  },[location.search])   //if there is  a change in location.search to  ye chale ga and :    get url se data get kren ge and sidebardata set kr den ge  ..... and fetchlisting wala function b call kr le ga

  









  //thisfunction will run when we click show more
  const onShowMoreClick=async ()=>{
    const numberoflistings= listings.length;
    const startIndex=numberoflistings;                    //jitni listings pehle hain un se aage se ye wali new listings shuru ho gee
    const urlParams=new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)               //url main yye b add krdo
    const searchQuery=urlParams.toString();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${backendUrl}/api/listing/get?${searchQuery}`);
        const data = await res.json();

      if(data.length < 9){                            //agar 9 se kam hui remaining pictures to phir showmore dikhane ki zrurat nhi
        setshowmore(false)
      }

      setListings([...listings, ...data])               //pehli listings wesee e rkho bs and new wali b add krdo                          
  }

  

  return (


    <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit}
        className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>






          <div className='flex gap-2 flex-wrap items-center'>
          <label> Type:</label>



          <div className='flex gap-2 '>
              <input type="checkbox" 
              id='all' 
              className='w-7'
              checked={sidebardata.type==='all'}
              onChange={handleChange}
               />
              <span>Rent & Sale</span>
          </div>



          <div className='flex gap-2'>
              <input type="checkbox" 
              id='rent' 
              className='w-7' 
              checked={sidebardata.type==='rent'}
              onChange={handleChange}
              />
              <span>Rent</span>
          </div>



          <div className='flex gap-2 '>
              <input type="checkbox" 
              id='sale' 
              className='w-7' 
              checked={sidebardata.type==='sale'}
              onChange={handleChange}
              />
              <span>Sale</span>
          </div>


          <div className='flex gap-2'>
              <input type="checkbox" 
              id='offer'
              className='w-7' 
              checked={sidebardata.offer}
              onChange={handleChange}
              />
              <span>Offer</span>
          </div>


          </div>









           <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
           
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>


            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>


          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>

        </form>
      </div>

      <div>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing Results
        </h1>








      {/* jb listings show krni hain mean jo cards bnae Liisting Card page pe*/}

        <div className='p-7 flex flex-wrap gap-4'>


{/* if there are no listings available based on search ya abhi kuch upload nhi hua, show a message to the user that no listings were found */}
          {!loading  && listings.length===0 && (
            <p className='text-slate-700 text-xl'>
              No listing found
            </p>
          )}



{/* If the data is currently loading from the server display a loading message */}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}

           


{/*   When loading is finished and listings exist, iterate through the listings array and render a ListingCard for each listing item*/}
          {!loading && listings && listings.map((listing)=>(
            <ListingCard key={listing._id || listing.id} listing={listing} />
          ))}





         

         {showmore && (
          <button className='text-green-700 hover:underline p-7 text-center w-full' 
          onClick={onShowMoreClick}
          >
            Show more
          </button>
         )}


        </div>

        
      </div>
    </div>
  )
}

export default Search