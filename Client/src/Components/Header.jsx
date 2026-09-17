import React, { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Header = () => {

  const defaultAvatar = 'https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w='


// Updated Header.jsx to: read currentUser from localStorage
  const [currentUser, setCurrentUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    setCurrentUser(storedUser ? JSON.parse(storedUser) : null)
  }, [location.pathname])

  const avatarUrl = (currentUser?.avatar || '').trim() || defaultAvatar
 
  const navigate= useNavigate();

  const [searchTerm, setsearchTerm] =useState('')




    const handleSubmit=(e)=>{
      e.preventDefault();
      const urlParams = new URLSearchParams(window.location.search);    // Gets current URL query parameters
      urlParams.set('searchTerm', searchTerm);          // Adds or updates the 'searchTerm' parameter in the URL
      const searchQuery = urlParams.toString();         // Converts the parameters into a query string format
      navigate(`/search?${searchQuery}`);               // Redirects to the search page with the updated query parameters
    }




    useEffect(() => {
    const urlParams = new URLSearchParams(location.search);           // Creates an object to read query parameters from the URL
    const searchTermFromUrl = urlParams.get('searchTerm') || '';      // Gets the value of 'searchTerm' from URL, or empty string if it doesn't exist
    if (searchTermFromUrl) {                                          // Checks if searchTerm exists in the URL
      setsearchTerm(searchTermFromUrl);                               // Updates the state with the search term from the URL
    }
    }, [location.search]);                                              // Dependency: run this effect whenever the URL query string changes



  return (
    <header className='bg-slate-300'>

      <div className='max-w-6xl mx-auto flex justify-between items-center py-3'>

    <Link to='/'>
      <h1 className='text-3xl font-bold'>
        <span className='text-slate-600'>Pak</span>
        <span className='text-slate-800'>Estate</span>
      </h1>
    </Link>



  
      <form onSubmit={handleSubmit} className='bg-slate-100 p-1 rounded-lg flex justify-center items-center w-24 sm:w-64 '>
        <input 
         onChange={(e)=> setsearchTerm(e.target.value)} 
         className='px-3 py-2 rounded  bg-transparent outline-none border-none'
         type="text"
         placeholder='Search...' />
         
         
        {/* //REACT K ICONS KI LIBRARY INSTALL KI ( NPM I REACT-ICONS ) PHIR US KO TOP PE IMPORT KIYA AND YAHAN USE KR LIYA AS A COMPONENT FASEARCH*/}
        <button>
          <FaSearch className='text-slate-600'/> 
        </button>
      </form>



      <ul className='flex gap-3'>
{/* home and about ko mobile main show nhi krana  */}
        <Link to='/'> <li className='hidden sm:inline hover:underline cursor-pointer'>Home</li> </Link> 
        <Link to='/about'>  <li className='hidden sm:inline hover:underline  cursor-pointer'>About</li> </Link> 

{/*AGar user exist krta hai to us ka avatar show kro nhi to simple login */}
        {currentUser ? (
          <Link to='/profile'>
            <img
              className='h-7 w-7 rounded-full object-cover'
              src={avatarUrl}

              onError={(e) => {                         //adds onError fallback to default image if avatar URL fails
                e.currentTarget.onerror = null
                e.currentTarget.src = defaultAvatar
              }}
              referrerPolicy='no-referrer'          // referrerPolicy='no-referrer' (helps with some Google image URL restrictions) mean ab shi se hoga render aap ki image
              alt='profile'
              
            />
          </Link>
        ) : (
          <Link to='/sign-in'> <li className=' cursor-pointer hover:underline'>Sign in</li> </Link>
        )}

      </ul>

      </div>
    </header>
  )
}

export default Header