import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Signin from './Pages/Signin'
import SignUp from './Pages/SignUp'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Header from './Components/Header'
import Private from './Components/Private'
import CreateListing from './Pages/CreateListing'
import Listing from './Pages/Listing'
import UpdateListing from './Pages/UpdateListing'
import Search from './Pages/Search'


function App() {

  return (
    <>
    <Header />
     <Routes>
       <Route path='/' element={<Home />}></Route>
       <Route path='sign-in' element={<Signin />}></Route>
       <Route path='sign-up' element={<SignUp />}></Route>
       <Route path='/about' element={<About />}></Route>
       <Route path='/search' element={<Search/>}></Route>
       <Route path='/listing/:listingId' element={<Listing />}></Route>
      <Route  element={<Private />}>                            
            <Route path='/profile' element={<Profile />}></Route>
            <Route path='/create-listing' element={<CreateListing />}></Route>
            <Route path='/update-listing/:listingId' element={<UpdateListing />}></Route>
      </Route>
   </Routes>
    </>
  )
}

export default App
