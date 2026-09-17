import React, { useState } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import OAuth from '../Components/OAuth'

 const Signin = () => {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate=useNavigate();


//jb main hum form main values add kren ge to vo stah sath us ko handle krta jae ga
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  console.log(formData)





  const handleSubmit = async (e) => { 
    e.preventDefault()

    setLoading(true)

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await axios.post(`${backendUrl}/api/auth/signin`, formData, { withCredentials: true })


      if (res?.data?.success) {
        if (res?.data?.user) {
// Takes the user object. Converts it into string using JSON.stringify(). (because localStorage can only store strings). Saves it in browser storage with key "currentUser
          localStorage.setItem('currentUser', JSON.stringify(res.data.user))
        }


        toast.success(res.data.message || 'Logged in successfully')
        setFormData({})
        navigate('/')
      } 
      else {
        toast.error(res?.data?.message || 'Error! Please try again')
      }
    }
    catch (err) {
      toast.error(err.response?.data?.message || err.message || 'An error occurred')
    }
    finally {
      setLoading(false)
    }
  }





  return (
    <div>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign In
      </h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-lg mx-auto'>
       

        <input
          value={formData.email || ''}
          type='email'
          placeholder='email'
          id='email'
          onChange={handleChange}
          required
          className='border p-3 rounded-lg  bg-white'
        />

        <input
          value={formData.password || ''}
          type='password'
          placeholder='password'
          id='password'
          onChange={handleChange}
          required
          className='border p-3 rounded-lg  bg-white'
        />

        <button
          disabled={loading} onSubmit={handleSubmit}
          className='bg-slate-600 p-2 cursor-pointer text-white rounded-lg hover:bg-slate-500  disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'SIGN IN'}
        </button>


      <OAuth />
        
      </form>



      <div className='flex gap-2 text-center max-w-lg mx-auto my-2'>
        <p> Dont Have an account? </p>
        <span className='text-blue-500 underline'>
          <Link to={'/sign-up'}>Sign Up</Link>
        </span>
      </div>
    </div>



  )
}

export default Signin